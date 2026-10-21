// Progress lives in this browser only (localStorage). Settings > Export
// saves it as a JSON file; Import loads it back on any device.
import { useSyncExternalStore } from 'react'

export type Progress = {
  version: 1
  lessons: Record<string, string> // lesson id -> date finished
  missions: Record<string, string>
  quizzes: Record<string, boolean> // question id -> answered right
  xp: number
  days: Record<string, number> // YYYY-MM-DD -> things done that day
  name?: string
}

const KEY = 'bossgit-progress-v1'
const empty = (): Progress => ({ version: 1, lessons: {}, missions: {}, quizzes: {}, xp: 0, days: {} })

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...empty(), ...JSON.parse(raw) } : empty()
  } catch {
    return empty()
  }
}

let state = load()
const listeners = new Set<() => void>()

function save(next: Progress) {
  state = next
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch {}
  listeners.forEach(l => l())
}

const today = () => new Date().toISOString().slice(0, 10)

function award(p: Progress, xp: number): Progress {
  const d = today()
  return { ...p, xp: p.xp + xp, days: { ...p.days, [d]: (p.days[d] ?? 0) + 1 } }
}

export const XP = { lesson: 10, quiz: 5, mission: 25, boss: 60 }

export function finishLesson(id: string) {
  if (state.lessons[id]) return
  save(award({ ...state, lessons: { ...state.lessons, [id]: today() } }, XP.lesson))
}
export function finishMission(id: string, boss = false) {
  if (state.missions[id]) return
  save(award({ ...state, missions: { ...state.missions, [id]: today() } }, boss ? XP.boss : XP.mission))
}
export function answerQuiz(id: string, right: boolean) {
  if (id in state.quizzes) return
  const next = { ...state, quizzes: { ...state.quizzes, [id]: right } }
  save(right ? award(next, XP.quiz) : next)
}
export function setName(name: string) { save({ ...state, name }) }

export function exportProgress(): string {
  return JSON.stringify({ app: 'bossgit', savedAt: new Date().toISOString(), progress: state }, null, 2)
}
export function importProgress(text: string) {
  const parsed = JSON.parse(text)
  const p = parsed.progress ?? parsed
  if (typeof p !== 'object' || !p.lessons) throw new Error('This file is not a BossGit backup.')
  save({ ...empty(), ...p })
}
export function resetProgress() { save(empty()) }

export function useProgress(): Progress {
  return useSyncExternalStore(
    l => { listeners.add(l); return () => { listeners.delete(l) } },
    () => state,
  )
}

export function streak(p: Progress): number {
  let n = 0
  const d = new Date()
  if (!p.days[d.toISOString().slice(0, 10)]) d.setDate(d.getDate() - 1)
  while (p.days[d.toISOString().slice(0, 10)]) { n++; d.setDate(d.getDate() - 1) }
  return n
}

const RANKS = ['Newcomer', 'Committer', 'Brancher', 'Merger', 'Rebaser', 'Rescuer', 'Maintainer', 'Git Boss']
export function level(xp: number) {
  const lvl = Math.floor(Math.sqrt(xp / 40))
  const at = (l: number) => l * l * 40
  return { level: lvl + 1, rank: RANKS[Math.min(lvl, RANKS.length - 1)], into: xp - at(lvl), need: at(lvl + 1) - at(lvl) }
}

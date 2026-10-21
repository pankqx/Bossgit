import { frontmatter, parseBlocks, type Block } from './parse'

export type Lesson = {
  id: string // "03-first-repo/02-three-areas"
  slug: string
  moduleId: string
  title: string
  minutes: number
  setup: string[]
  blocks: Block[]
  source: string
}
export type Module = {
  id: string // "03-first-repo"
  number: string // "03"
  title: string
  tagline: string
  track: string
  boss: string
  intro: string
  lessons: Lesson[]
  planned: string[]
}

const files = import.meta.glob('../../content/*/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

const byModule = new Map<string, { module?: string; lessons: [string, string][] }>()
for (const [path, src] of Object.entries(files)) {
  const [, folder, file] = path.match(/content\/([^/]+)\/([^/]+)\.md$/) ?? []
  if (!folder) continue
  if (!byModule.has(folder)) byModule.set(folder, { lessons: [] })
  const entry = byModule.get(folder)!
  if (file === 'module') entry.module = src
  else if (/^\d+/.test(file)) entry.lessons.push([file, src])
}

export const modules: Module[] = [...byModule.entries()]
  .filter(([, e]) => e.module)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([id, e]) => {
    const { data, body } = frontmatter(e.module!)
    const plannedMatch = body.match(/##\s*Planned lessons\s*\n([\s\S]*?)(\n##|$)/i)
    const planned = plannedMatch ? plannedMatch[1].split('\n').map(l => l.replace(/^[-*]\s*/, '').trim()).filter(Boolean) : []
    const intro = body.replace(/##\s*Planned lessons[\s\S]*?(\n##|$)/i, '$1').trim()
    const lessons = e.lessons.sort(([a], [b]) => a.localeCompare(b)).map(([slug, src]): Lesson => {
      const fm = frontmatter(src)
      const lid = `${id}/${slug}`
      return {
        id: lid, slug, moduleId: id,
        title: fm.data.title ?? slug,
        minutes: Number(fm.data.minutes ?? 8),
        setup: (fm.data.setup ?? '').split(/\s*;;\s*/).filter(Boolean),
        blocks: parseBlocks(fm.body, lid),
        source: src,
      }
    })
    return {
      id, number: id.slice(0, 2),
      title: data.title ?? id,
      tagline: data.tagline ?? '',
      track: data.track ?? 'Other',
      boss: data.boss ?? '',
      intro,
      lessons,
      planned,
    }
  })

export const tracks: { name: string; modules: Module[] }[] = []
for (const m of modules) {
  let t = tracks.find(x => x.name === m.track)
  if (!t) tracks.push((t = { name: m.track, modules: [] }))
  t.modules.push(m)
}

export const allLessons = modules.flatMap(m => m.lessons)
export const findModule = (id?: string) => modules.find(m => m.id === id)
export const findLesson = (moduleId?: string, slug?: string) => findModule(moduleId)?.lessons.find(l => l.slug === slug)
export function nextLesson(l: Lesson): Lesson | undefined {
  const i = allLessons.findIndex(x => x.id === l.id)
  return allLessons[i + 1]
}
export function prevLesson(l: Lesson): Lesson | undefined {
  const i = allLessons.findIndex(x => x.id === l.id)
  return i > 0 ? allLessons[i - 1] : undefined
}
export const missionCount = allLessons.reduce((n, l) => n + l.blocks.filter(b => b.type === 'mission').length, 0)
export const plannedCount = modules.reduce((n, m) => n + m.planned.length, 0)

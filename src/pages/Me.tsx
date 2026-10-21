import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { allLessons, missionCount } from '../content'
import { exportProgress, importProgress, level, resetProgress, setName, streak, useProgress } from '../store/progress'

function Heatmap({ days }: { days: Record<string, number> }) {
  const weeks = 26
  const end = new Date()
  const start = new Date(end)
  start.setDate(end.getDate() - (weeks * 7 - 1) - end.getDay())
  const cells: { date: string; n: number }[] = []
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const k = d.toISOString().slice(0, 10)
    cells.push({ date: k, n: days[k] ?? 0 })
  }
  const shade = (n: number) => (n === 0 ? 'var(--paper-2)' : n < 2 ? 'color-mix(in srgb, var(--moss) 35%, var(--paper))' : n < 4 ? 'color-mix(in srgb, var(--moss) 65%, var(--paper))' : 'var(--moss)')
  return (
    <div className="overflow-x-auto">
      <div className="grid grid-flow-col grid-rows-7 gap-[3px] w-max">
        {cells.map(c => <span key={c.date} title={`${c.date}: ${c.n} done`} className="w-3 h-3 rounded-[3px]" style={{ background: shade(c.n) }} />)}
      </div>
    </div>
  )
}

export default function Me() {
  const p = useProgress()
  const lv = level(p.xp)
  const file = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)
  const download = () => {
    const blob = new Blob([exportProgress()], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `bossgit-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
    setMsg('Backup saved to your downloads.')
  }
  const load = async (f?: File) => {
    if (!f) return
    try { importProgress(await f.text()); setMsg('Progress loaded.') } catch (e: any) { setMsg(e.message ?? 'That file could not be read.') }
  }
  const stats: [string, string][] = [
    [String(p.xp), 'XP'],
    [String(streak(p)), 'day streak'],
    [`${Object.keys(p.lessons).length}/${allLessons.length}`, 'lessons'],
    [`${Object.keys(p.missions).length}/${missionCount}`, 'missions'],
  ]
  return (
    <div className="gutter max-w-[1100px] mx-auto pt-14">
      <div className="eyebrow mb-3">Your progress</div>
      <h1 className="font-display font-extrabold text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.95] tracking-[-0.04em]">Level {lv.level}. <span className="font-serif italic font-normal">{lv.rank}.</span></h1>
      <div className="mt-6 max-w-md">
        <div className="h-2 rounded-full bg-paper-2 overflow-hidden"><div className="h-full bg-signal" style={{ width: `${(lv.into / lv.need) * 100}%` }} /></div>
        <div className="mt-2 font-mono text-xs text-mute">{lv.need - lv.into} XP to level {lv.level + 1}</div>
      </div>
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 border-y border-line">
        {stats.map(([n, l], i) => (
          <div key={l} className={`py-6 ${i ? 'md:pl-6 md:border-l' : ''} ${i % 2 ? 'pl-6 border-l' : ''} border-line`}>
            <div className="font-display font-extrabold text-4xl tabular-nums">{n}</div>
            <div className="text-ink-2">{l}</div>
          </div>
        ))}
      </div>
      <section className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Your last six months</h2>
        <Heatmap days={p.days} />
        <p className="mt-3 text-sm text-mute">Each square is a day. Finish a lesson, a mission or a quiz to colour it.</p>
      </section>
      <section className="mt-14 grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Back up your progress</h2>
          <p className="font-serif text-lg text-ink-2 mb-5">Progress is saved in this browser only. Download a backup file to keep it safe, or to move it to another computer.</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={download} className="px-5 py-2.5 rounded-full bg-ink text-paper font-semibold">Export backup</button>
            <button onClick={() => file.current?.click()} className="px-5 py-2.5 rounded-full border border-line hover:border-ink">Import backup</button>
            <input id="import-file" ref={file} type="file" accept="application/json,.json" className="hidden" onChange={e => load(e.target.files?.[0])} />
          </div>
          {msg && <p className="mt-3 text-sm text-moss" role="status">{msg}</p>}
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Your name</h2>
          <p className="font-serif text-lg text-ink-2 mb-4">Shown on your certificate when you finish the course.</p>
          <input id="learner-name" value={p.name ?? ''} onChange={e => setName(e.target.value)} placeholder="Your name" className="w-full max-w-sm border-b-2 border-ink bg-transparent py-2 text-xl outline-none" />
          <div className="mt-10">
            {!confirmReset
              ? <button onClick={() => setConfirmReset(true)} className="text-sm text-mute underline hover:text-signal">Reset all progress</button>
              : <div className="flex flex-wrap items-center gap-3 text-sm"><span>This deletes everything. Sure?</span><button onClick={() => { resetProgress(); setConfirmReset(false) }} className="px-4 py-1.5 rounded-full bg-signal text-white">Yes, reset</button><button onClick={() => setConfirmReset(false)} className="px-4 py-1.5 rounded-full border border-line">Keep it</button></div>}
          </div>
        </div>
      </section>
      <Link to="/learn" className="mt-16 inline-block text-lg font-semibold hover:text-signal">Continue the course →</Link>
    </div>
  )
}

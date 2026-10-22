import { Link, useParams } from 'react-router-dom'
import { findModule, modules } from '../content'
import { useProgress } from '../store/progress'
import { Md } from '../components/Blocks'
import NotFound from './NotFound'

export default function ModulePage() {
  const { moduleId } = useParams()
  const m = findModule(moduleId)
  const p = useProgress()
  if (!m) return <NotFound />
  const i = modules.indexOf(m)
  const next = modules[i + 1]
  return (
    <div className="gutter max-w-[1100px] mx-auto pt-14">
      <Link to="/learn" className="font-mono text-xs text-mute hover:text-ink">← The course / {m.track}</Link>
      <header className="mt-8 grid md:grid-cols-[auto_1fr] gap-x-10 gap-y-4 items-end pb-10 border-b border-line">
        <div className="font-display font-extrabold text-[clamp(6rem,16vw,12rem)] leading-[0.8] tracking-[-0.06em] text-signal">{m.number}</div>
        <div>
          <h1 className="font-display font-extrabold text-[clamp(2.2rem,5vw,4rem)] leading-[0.98] tracking-[-0.035em]">{m.title}</h1>
          <p className="mt-3 font-serif text-xl text-ink-2">{m.tagline}</p>
        </div>
      </header>
      {m.intro && <div className="py-10 max-w-[68ch]"><Md text={m.intro} /></div>}
      {m.boss && (
        <div className="rounded-2xl bg-ink text-paper px-6 py-5 flex flex-wrap items-center gap-x-4 gap-y-1 mb-10">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-signal">Boss</span>
          <span className="text-lg font-semibold">{m.boss}</span>
          <span className="text-sm opacity-60">waits at the end of this module.</span>
        </div>
      )}
      <ol className="border-t border-line">
        {m.lessons.map((l, n) => (
          <li key={l.id}>
            <Link to={`/learn/${m.id}/${l.slug}`} className="group grid grid-cols-[3rem_1fr_auto] gap-4 items-baseline py-5 border-b border-line">
              <span className="font-mono text-sm text-mute">{String(n + 1).padStart(2, '0')}</span>
              <span className="text-xl font-semibold tracking-tight group-hover:text-signal transition-colors">{l.title}</span>
              <span className="font-mono text-xs text-mute whitespace-nowrap">{p.lessons[l.id] ? <span className="text-moss">✓ done</span> : `${l.minutes} min`}</span>
            </Link>
          </li>
        ))}
        {m.planned.map((t, n) => (
          <li key={t} className="grid grid-cols-[3rem_1fr_auto] gap-4 items-baseline py-5 border-b border-line text-mute">
            <span className="font-mono text-sm">{String(m.lessons.length + n + 1).padStart(2, '0')}</span>
            <span className="text-xl tracking-tight">{t}</span>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded-full border border-line whitespace-nowrap">not written yet</span>
          </li>
        ))}
      </ol>
      {m.planned.length > 0 && (
        <p className="mt-6 text-sm text-mute">Lessons marked "not written yet" are on the way. Want to write one? Read <a className="underline hover:text-ink" href="https://github.com/pankqx/BossGit/blob/main/HOW-TO-ADD-A-LESSON.md" target="_blank" rel="noreferrer">how to add a lesson</a>.</p>
      )}
      {next && (
        <Link to={`/learn/${next.id}`} className="mt-16 group flex items-baseline justify-between gap-6 border-t-2 border-ink pt-6">
          <span className="eyebrow">Next module</span>
          <span className="text-2xl font-bold tracking-tight group-hover:text-signal transition-colors text-right">M{next.number} · {next.title} →</span>
        </Link>
      )}
    </div>
  )
}

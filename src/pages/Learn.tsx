import { Link } from 'react-router-dom'
import { tracks, allLessons } from '../content'
import { useProgress, level, streak } from '../store/progress'

export default function Learn() {
  const p = useProgress()
  const next = allLessons.find(l => !p.lessons[l.id]) ?? allLessons[0]
  const done = allLessons.filter(l => p.lessons[l.id]).length
  const lv = level(p.xp)
  return (
    <div className="gutter max-w-[1400px] mx-auto pt-14">
      <header className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-10 items-end pb-12 border-b border-line">
        <div>
          <div className="eyebrow mb-4">The course</div>
          <h1 className="font-display font-extrabold text-[clamp(2.6rem,6vw,5.2rem)] leading-[0.95] tracking-[-0.04em]">From zero to <span className="font-serif italic font-normal">Git boss</span>.</h1>
          <p className="mt-6 font-serif text-xl text-ink-2 max-w-2xl">Seven tracks, in order. Each module is a handful of short lessons, a few missions in the lab and a boss fight at the end. Go at your own speed. One lesson a day is plenty.</p>
        </div>
        <div className="rounded-2xl bg-ink text-paper p-6">
          <div className="flex justify-between font-mono text-xs opacity-70"><span>LV {lv.level} · {lv.rank}</span><span>{streak(p)} day streak</span></div>
          <div className="mt-3 h-1.5 rounded-full bg-paper/20 overflow-hidden"><div className="h-full bg-signal" style={{ width: `${(lv.into / lv.need) * 100}%` }} /></div>
          <div className="mt-5 text-sm opacity-70">{done} of {allLessons.length} lessons done</div>
          {next && (
            <Link to={`/learn/${next.moduleId}/${next.slug}`} className="mt-2 block text-xl font-semibold leading-snug hover:text-signal transition">
              {done ? 'Continue: ' : 'Start: '}{next.title} →
            </Link>
          )}
        </div>
      </header>

      {tracks.map((t, ti) => (
        <section key={t.name} className="grid lg:grid-cols-[260px_minmax(0,1fr)] gap-8 py-12 border-b border-line">
          <div className="lg:sticky lg:top-24 self-start">
            <div className="font-mono text-xs text-mute">Track {ti}</div>
            <h2 className="text-3xl font-bold tracking-tight mt-1">{t.name}</h2>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {t.modules.map(m => {
              const d = m.lessons.filter(l => p.lessons[l.id]).length
              const total = m.lessons.length + m.planned.length
              return (
                <Link key={m.id} to={`/learn/${m.id}`} className="group rounded-2xl border border-line bg-card p-6 flex flex-col gap-3 hover:border-ink transition">
                  <div className="flex items-start justify-between">
                    <span className="font-display font-extrabold text-5xl tracking-tighter text-line group-hover:text-signal transition-colors leading-none">{m.number}</span>
                    {m.lessons.length === 0
                      ? <span className="font-mono text-[11px] px-2 py-0.5 rounded-full border border-line text-mute">being written</span>
                      : d === m.lessons.length ? <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-moss text-paper">done</span> : null}
                  </div>
                  <h3 className="text-xl font-bold tracking-tight leading-snug">{m.title}</h3>
                  <p className="font-serif text-ink-2 leading-snug">{m.tagline}</p>
                  <div className="mt-auto pt-3">
                    <div className="flex justify-between font-mono text-[11px] text-mute mb-1.5"><span>{m.lessons.length} written · {m.planned.length} planned</span><span>{d}/{total}</span></div>
                    <div className="h-1 rounded-full bg-paper-2 overflow-hidden"><div className="h-full bg-moss" style={{ width: total ? `${(d / total) * 100}%` : 0 }} /></div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

import { Link } from 'react-router-dom'
import { allLessons, modules, missionCount } from '../content'
import { problems } from '../content/problems'
import { useProgress, setName, level } from '../store/progress'
import { Mark } from '../components/Logo'

// A printable, line-art certificate built from the learner's own progress.
// Full mastery needs every lesson done. Before that it is a progress certificate.
export default function Certificate() {
  const p = useProgress()
  const lessons = allLessons.filter(l => p.lessons[l.id]).length
  const missions = Object.keys(p.missions).length
  const solved = Object.keys(p.problems).length
  const modulesDone = modules.filter(m => m.lessons.length && m.lessons.every(l => p.lessons[l.id])).length
  const pct = Math.round((lessons / Math.max(1, allLessons.length)) * 100)
  const master = lessons === allLessons.length
  const lv = level(p.xp)
  const dates = Object.values(p.lessons).sort()
  const last = dates[dates.length - 1]
  const when = (last ? new Date(last) : new Date()).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const name = p.name?.trim() || 'Your name here'

  return (
    <div className="gutter max-w-[1100px] mx-auto pt-10 sm:pt-14">
      <div className="print:hidden mb-8 grid md:grid-cols-[1fr_auto] gap-6 items-end">
        <div>
          <div className="eyebrow mb-3">Certificate</div>
          <h1 className="font-display font-extrabold text-[clamp(2.2rem,5vw,4rem)] leading-[0.95] tracking-[-0.04em]">{master ? 'You did it. Print it.' : <>You are <span className="hl">{pct}%</span> of the way.</>}</h1>
          <p className="mt-4 font-serif text-lg text-ink-2 max-w-[60ch]">{master ? 'Every lesson is done. This certificate lists exactly what you cleared.' : 'Finish every lesson to unlock the Certificate of Mastery. Until then you can print a progress certificate.'}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="sr-only" htmlFor="cert-name">Name on the certificate</label>
          <input id="cert-name" value={p.name ?? ''} onChange={e => setName(e.target.value)} placeholder="Name on the certificate" className="border-[1.5px] border-ink rounded-full px-4 py-2.5 bg-card outline-none min-w-0 w-full sm:w-64" />
          <button onClick={() => window.print()} className="btn-ink">Print or save as PDF</button>
        </div>
      </div>

      <article className="relative bg-card border-[1.5px] border-ink rounded-[18px] p-3 sm:p-4 shadow-[6px_6px_0_var(--ink)] print:shadow-none">
        <div className="relative border border-dashed border-ink/50 rounded-[12px] px-5 py-10 sm:px-14 sm:py-16 overflow-hidden text-center">
          {/* corner line art */}
          {[['left-3 top-3', ''], ['right-3 top-3', 'scale-x-[-1]'], ['left-3 bottom-3', 'scale-y-[-1]'], ['right-3 bottom-3', 'scale-[-1]']].map(([pos, flip]) => (
            <svg key={pos} className={`absolute ${pos} ${flip} w-14 sm:w-20 text-ink`} viewBox="0 0 80 80" aria-hidden="true">
              <g fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round"><path d="M6 74V6h68" /><path d="M14 74V14h60" /><path d="M14 40c14 0 26-12 26-26" /></g>
              <circle cx={40} cy={14} r={4} fill="var(--card)" stroke="currentColor" strokeWidth={1.4} />
              <circle cx={14} cy={40} r={4} fill="var(--signal)" stroke="currentColor" strokeWidth={1.4} />
            </svg>
          ))}
          <div className="flex justify-center text-ink"><Mark size={56} /></div>
          <div className="mt-5 font-mono text-[11px] sm:text-xs tracking-[0.2em] uppercase text-mute">BossGit · Git and GitHub, zero to mastery</div>
          <h2 className="mt-4 font-serif italic text-[clamp(1.6rem,4vw,2.6rem)] leading-tight">{master ? 'Certificate of Mastery' : 'Certificate of Progress'}</h2>
          <p className="mt-6 font-serif text-lg text-ink-2">This certifies that</p>
          <p className="mt-2 font-display font-extrabold text-[clamp(2rem,6vw,4rem)] leading-none tracking-[-0.03em] break-words"><span className="hl">{name}</span></p>
          <p className="mt-6 font-serif text-lg text-ink-2 max-w-[52ch] mx-auto">
            {master
              ? <>has completed every lesson of BossGit, from the terminal to Git internals, and built a working Git and GitHub of their own.</>
              : <>has completed {lessons} of {allLessons.length} BossGit lessons and is on the way to Git mastery.</>}
          </p>
          <dl className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-px bg-ink/20 border border-ink/20 rounded-xl overflow-hidden text-left">
            {[
              ['Lessons', `${lessons} / ${allLessons.length}`],
              ['Modules', `${modulesDone} / ${modules.length}`],
              ['Missions', `${missions} / ${missionCount}`],
              ['Problems', `${solved} / ${problems.length}`],
            ].map(([k, v]) => (
              <div key={k} className="bg-card p-4">
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-mute">{k}</dt>
                <dd className="mt-1 font-display font-bold text-xl sm:text-2xl tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-12 grid sm:grid-cols-3 gap-8 items-end text-sm">
            <div><div className="border-b border-ink pb-1 font-serif text-lg">{when}</div><div className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-mute">Date</div></div>
            <div><div className="border-b border-ink pb-1 font-mono">LV {lv.level} · {lv.rank}</div><div className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-mute">Rank · {p.xp} XP</div></div>
            <div><div className="border-b border-ink pb-1 font-serif italic text-xl">K S Pankaj</div><div className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-mute">Creator, BossGit</div></div>
          </div>
          <p className="mt-10 font-mono text-[10px] text-mute">Designed, developed and owned by K S Pankaj · Progress is recorded in the learner's own browser.</p>
        </div>
      </article>

      <p className="print:hidden mt-8 font-serif text-ink-2">Keep going: <Link className="text-signal underline underline-offset-4" to="/learn">open the course</Link> or <Link className="text-signal underline underline-offset-4" to="/me">back up your progress</Link>.</p>
    </div>
  )
}

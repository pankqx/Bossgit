import { Link } from 'react-router-dom'
import { tracks } from '../content'
import { useProgress } from '../store/progress'

const TONES = ['var(--signal)', 'var(--moss)', 'var(--ochre)', 'var(--slate)', 'var(--ink-2)', 'var(--signal)', 'var(--moss)']

/** the course drawn as a transit map: one line per track, one station per module */
export default function CourseMap({ inverted = false }: { inverted?: boolean }) {
  const p = useProgress()
  return (
    <ol className="flex flex-col">
      {tracks.map((t, ti) => {
        const tone = TONES[ti % TONES.length]
        return (
          <li key={t.name} className={`grid md:grid-cols-[220px_1fr] gap-x-8 gap-y-4 py-7 ${ti ? 'border-t' : ''} ${inverted ? 'border-white/10' : 'border-line'}`}>
            <div>
              <div className={`font-mono text-xs ${inverted ? 'text-white/50' : 'text-mute'}`}>Track {ti}</div>
              <div className="text-xl font-bold tracking-tight">{t.name}</div>
            </div>
            <div className="relative min-w-0">
              <span className="absolute left-0 right-0 top-[9px] h-[3px] rounded-full hidden sm:block" style={{ background: tone, opacity: 0.85 }} />
              <ul className="relative grid gap-x-4 gap-y-5 grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
                {t.modules.map(m => {
                  const done = m.lessons.filter(l => p.lessons[l.id]).length
                  const total = m.lessons.length + m.planned.length
                  const full = m.lessons.length > 0 && done === m.lessons.length
                  return (
                    <li key={m.id}>
                      <Link to={`/learn/${m.id}`} className="group flex sm:block items-start gap-3">
                        <span className="relative z-10 block w-[21px] h-[21px] rounded-full border-[3px] shrink-0 transition group-hover:scale-125" style={{ borderColor: tone, background: full ? tone : inverted ? 'var(--term-bg)' : 'var(--paper)' }} />
                        <span className="block sm:mt-3">
                          <span className={`font-mono text-[11px] ${inverted ? 'text-white/50' : 'text-mute'}`}>M{m.number}{m.lessons.length ? ` · ${done}/${total}` : ' · soon'}</span>
                          <span className="block font-semibold leading-snug group-hover:underline underline-offset-4">{m.title}</span>
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

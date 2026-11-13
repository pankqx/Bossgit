import { Link } from 'react-router-dom'
import { tracks } from '../content'
import { useProgress } from '../store/progress'
import { TrackIcon } from './LineArt'

const TONES = ['var(--signal)', 'var(--moss)', 'var(--ochre)', 'var(--slate)', 'var(--lime)', 'var(--signal)', 'var(--moss)']

/** the course drawn as a transit map: one line per track, one station per module */
export default function CourseMap({ inverted = false }: { inverted?: boolean }) {
  const p = useProgress()
  return (
    <ol className="flex flex-col">
      {tracks.map((t, ti) => {
        const tone = TONES[ti % TONES.length]
        return (
          <li key={t.name} className={`grid md:grid-cols-[220px_1fr] gap-x-8 gap-y-4 py-7 ${ti ? 'border-t' : ''} ${inverted ? 'border-white/10' : 'border-line'}`}>
            <div className="flex md:block items-center gap-3">
              <span className="md:mb-2 block" style={{ color: tone }}><TrackIcon name={t.name} size={36} /></span>
              <span className="block">
                <span className={`block font-mono text-xs ${inverted ? 'text-white/50' : 'text-mute'}`}>Track {ti}</span>
                <span className="block text-xl font-bold tracking-tight">{t.name}</span>
              </span>
            </div>
            <div className="relative min-w-0">
              <span className="absolute left-0 right-0 top-[9px] h-0 border-t-2 border-dashed hidden sm:block" style={{ borderColor: tone, opacity: 0.8 }} /><span className="absolute left-[9px] top-2 bottom-2 w-0 border-l-2 border-dashed sm:hidden" style={{ borderColor: tone, opacity: 0.6 }} />
              <ul className="relative grid gap-x-4 gap-y-5 grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
                {t.modules.map(m => {
                  const done = m.lessons.filter(l => p.lessons[l.id]).length
                  const total = m.lessons.length + m.planned.length
                  const full = m.lessons.length > 0 && done === m.lessons.length
                  return (
                    <li key={m.id}>
                      <Link to={`/learn/${m.id}`} className="group flex sm:block items-start gap-3">
                        <span className="relative z-10 block w-[21px] h-[21px] rounded-full border-[2.5px] shrink-0 transition group-hover:scale-125" style={{ borderColor: tone, background: full ? tone : inverted ? 'var(--term-bg)' : 'var(--paper)' }} />
                        <span className="block sm:mt-3">
                          <span className={`font-mono text-[11px] ${inverted ? 'text-white/50' : 'text-mute'}`}>M{m.number} · {done}/{total}{full ? ' ✓' : ''}</span>
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

import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { findLesson, findModule, nextLesson, prevLesson } from '../content'
import { Lab } from '../engine/lab'
import Blocks from '../components/Blocks'
import LabPanel from '../components/LabPanel'
import { finishLesson, useProgress } from '../store/progress'
import NotFound from './NotFound'

export default function LessonPage() {
  const { moduleId, slug } = useParams()
  const lesson = findLesson(moduleId, slug)
  const mod = findModule(moduleId)
  const p = useProgress()
  const nav = useNavigate()
  const lab = useMemo(() => (lesson ? new Lab('lesson', lesson.setup) : null), [lesson])
  const [sheet, setSheet] = useState(false)
  // only one terminal per lab, so lesson buttons type into the visible one
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 1024px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const on = () => setWide(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  useEffect(() => { setSheet(false); if (!lab) return; return lab.onType(() => { if (!window.matchMedia('(min-width: 1024px)').matches) setSheet(true) }) }, [lab])

  if (!lesson || !mod || !lab) return <NotFound />
  const next = nextLesson(lesson)
  const prev = prevLesson(lesson)
  const index = mod.lessons.indexOf(lesson)
  const done = !!p.lessons[lesson.id]
  const finish = () => { finishLesson(lesson.id); if (next) nav(`/learn/${next.moduleId}/${next.slug}`); else nav('/learn') }
  const reset = () => lab.reset(lesson.setup)

  return (
    <div className="gutter max-w-[1500px] mx-auto pt-10 grid lg:grid-cols-[minmax(0,1fr)_minmax(440px,560px)] gap-12 xl:gap-16">
      <article className="min-w-0 max-w-[720px] w-full mx-auto lg:mx-0 lg:ml-auto pb-10">
        <Link to={`/learn/${mod.id}`} className="font-mono text-xs text-mute hover:text-ink">← M{mod.number} {mod.title}</Link>
        <div className="mt-8 flex items-center gap-3 font-mono text-xs text-mute">
          <span>Lesson {index + 1} of {mod.lessons.length}</span><span>·</span><span>{lesson.minutes} min</span>
          {done && <><span>·</span><span className="text-moss">done</span></>}
        </div>
        <h1 className="mt-3 font-display font-extrabold text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1] tracking-[-0.035em]">{lesson.title}</h1>
        <div className="mt-10"><Blocks blocks={lesson.blocks} lab={lab} /></div>
        <div className="mt-16 pt-8 border-t-2 border-ink flex flex-wrap items-center justify-between gap-4">
          {prev ? <Link to={`/learn/${prev.moduleId}/${prev.slug}`} className="text-mute hover:text-ink">← {prev.title}</Link> : <span />}
          <button onClick={finish} className="group inline-flex items-center gap-3 bg-ink text-paper pl-6 pr-5 py-3.5 rounded-full font-semibold hover:bg-signal transition-colors">
            {done ? (next ? 'Next lesson' : 'Back to the course') : (next ? 'Done, next lesson' : 'Finish module')}
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
        {next && <p className="mt-3 text-right text-sm text-mute">Up next: {next.title}</p>}
      </article>

      {wide ? <aside>
        <div className="sticky top-24 pb-8">
          <LabPanel lab={lab} onReset={reset} height={340} />
        </div>
      </aside> : (
      /* phones and tablets: the lab slides up from the bottom */
      <div>
        <button onClick={() => setSheet(true)} className="fixed z-40 right-4 bg-ink text-paper rounded-full px-5 py-3 font-semibold shadow-lg" style={{ bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}>Open lab</button>
        <div className={`fixed inset-x-0 bottom-0 z-50 bg-paper border-t border-line rounded-t-2xl shadow-2xl transition-transform duration-300 ${sheet ? 'translate-y-0' : 'translate-y-full'}`} style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }} aria-hidden={!sheet}>
          <div className="gutter py-3 flex items-center justify-between">
            <span className="eyebrow">Lab</span>
            <button onClick={() => setSheet(false)} className="font-mono text-sm px-3 py-1 rounded-full border border-line">close</button>
          </div>
          <div className="gutter pb-4 max-h-[78vh] overflow-y-auto"><LabPanel lab={lab} onReset={reset} height={240} /></div>
        </div>
      </div>)}
    </div>
  )
}

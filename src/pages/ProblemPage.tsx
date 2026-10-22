import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { findProblem, problems } from '../content/problems'
import { Lab } from '../engine/lab'
import { runChecks, type CheckResult } from '../engine/checker'
import Blocks, { Md, Solution } from '../components/Blocks'
import LabPanel from '../components/LabPanel'
import { solveProblem, useProgress, PROBLEM_XP } from '../store/progress'
import { DIFF_TONE } from './Problems'
import NotFound from './NotFound'

export default function ProblemPage() {
  const { slug } = useParams()
  const pr = findProblem(slug)
  const p = useProgress()
  const lab = useMemo(() => (pr ? new Lab('problem', pr.mission.setup) : null), [pr])
  const [results, setResults] = useState<CheckResult[] | null>(null)
  const [hints, setHints] = useState(0)
  const [busy, setBusy] = useState(false)
  const [tries, setTries] = useState(0)
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 1024px)').matches)
  const [sheet, setSheet] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const on = () => setWide(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  useEffect(() => { setResults(null); setHints(0); setTries(0) }, [slug])

  if (!pr || !lab) return <NotFound />
  const solved = !!p.problems?.[pr.slug]
  const i = problems.indexOf(pr)
  const next = problems[i + 1]
  const submit = async () => {
    setBusy(true)
    await lab.ready
    const r = await runChecks(lab.shell, pr.mission.checks)
    setResults(r); setTries(t => t + 1); setBusy(false)
    if (r.every(x => x.ok)) solveProblem(pr.slug, pr.difficulty)
  }
  const reset = async () => { setResults(null); await lab.reset(pr.mission.setup) }
  const passed = results?.every(r => r.ok)

  const panel = <LabPanel lab={lab} onReset={reset} height={wide ? 360 : 240} />
  return (
    <div className="gutter max-w-[1500px] mx-auto pt-10 grid lg:grid-cols-[minmax(0,1fr)_minmax(440px,580px)] gap-12">
      <article className="min-w-0 max-w-[720px] w-full lg:ml-auto pb-10">
        <Link to="/problems" className="font-mono text-xs text-mute hover:text-ink">← All problems</Link>
        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
          <span className="font-semibold" style={{ color: DIFF_TONE[pr.difficulty] }}>{pr.difficulty}</span>
          <span className="text-mute font-mono text-xs">{PROBLEM_XP[pr.difficulty]} XP</span>
          {pr.tags.map(t => <span key={t} className="font-mono text-[11px] px-2 py-0.5 rounded-full border border-line text-ink-2">{t}</span>)}
          {solved && <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-moss text-paper">solved</span>}
        </div>
        <h1 className="mt-3 font-display font-extrabold text-[clamp(2rem,4vw,3.2rem)] leading-[1] tracking-[-0.035em]">{pr.number}. {pr.title}</h1>
        <div className="mt-8"><Blocks blocks={pr.statement} lab={lab} /></div>
        <section className="mt-8 rounded-2xl bg-paper-2 border border-line p-6">
          <div className="eyebrow mb-3">Goal</div>
          <Md text={pr.mission.goal} className="prose-bg text-[1.12rem]" />
          <div className="flex flex-wrap gap-2 mt-5">
            <button onClick={submit} disabled={busy} className="px-5 py-2.5 rounded-full font-semibold bg-signal text-white hover:opacity-90 disabled:opacity-50">Submit</button>
            <button onClick={reset} className="px-5 py-2.5 rounded-full border border-line hover:border-ink">Reset repository</button>
            {pr.mission.hints.length > hints && <button onClick={() => setHints(h => h + 1)} className="px-5 py-2.5 rounded-full border border-line hover:border-ink">{hints ? 'Next hint' : 'Hint'}</button>}
            {!wide && <button onClick={() => setSheet(true)} className="px-5 py-2.5 rounded-full bg-ink text-paper">Open terminal</button>}
          </div>
          {hints > 0 && <ol className="mt-4 space-y-2">{pr.mission.hints.slice(0, hints).map((h, n) => <li key={n} className="grid grid-cols-[4.5rem_1fr] items-baseline"><span className="eyebrow">Hint {n + 1}</span><Md text={h} className="prose-bg text-[1rem]" /></li>)}</ol>}
          {results && (
            <div className="mt-5">
              <div className={`text-lg font-bold ${passed ? 'text-moss' : 'text-signal'}`}>{passed ? 'Accepted' : 'Wrong answer'} <span className="font-mono text-xs text-mute font-normal">attempt {tries}</span></div>
              <ul className="mt-2 space-y-1">
                {results.map(r => <li key={r.check} className="flex gap-2.5"><span className={`font-mono ${r.ok ? 'text-moss' : 'text-signal'}`}>{r.ok ? '✓' : '✗'}</span><span>{r.label}</span></li>)}
              </ul>
            </div>
          )}
        </section>
        {pr.solution && <div className="mt-6"><Solution text={pr.solution} /></div>}
        {next && (
          <Link to={`/problems/${next.slug}`} className="mt-12 group flex items-baseline justify-between gap-6 border-t-2 border-ink pt-6">
            <span className="eyebrow">Next problem</span>
            <span className="text-xl font-bold tracking-tight group-hover:text-signal transition-colors text-right">{next.number}. {next.title} →</span>
          </Link>
        )}
      </article>
      {wide ? <aside><div className="sticky top-24 pb-8">{panel}</div></aside> : (
        <div className={`fixed inset-x-0 bottom-0 z-50 bg-paper border-t border-line rounded-t-2xl shadow-2xl transition-transform duration-300 ${sheet ? 'translate-y-0' : 'translate-y-full'}`} style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <div className="gutter py-3 flex items-center justify-between"><span className="eyebrow">Terminal</span><button onClick={() => setSheet(false)} className="font-mono text-sm px-3 py-1 rounded-full border border-line">close</button></div>
          <div className="gutter pb-4 max-h-[78vh] overflow-y-auto">{panel}</div>
        </div>
      )}
    </div>
  )
}

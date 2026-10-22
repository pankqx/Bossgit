import { useEffect, useId, useMemo, useState } from 'react'
import { marked } from 'marked'
import type { Block, Mission, Question } from '../content/parse'
import type { Lab } from '../engine/lab'
import { runChecks, type CheckResult } from '../engine/checker'
import { answerQuiz, finishMission, useProgress } from '../store/progress'

marked.setOptions({ gfm: true, breaks: false })

export function Md({ text, className = 'prose-bg' }: { text: string; className?: string }) {
  const html = useMemo(() => marked.parse(text) as string, [text])
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
}

export default function Blocks({ blocks, lab }: { blocks: Block[]; lab: Lab }) {
  return (
    <div className="flex flex-col gap-7">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'md': return <Md key={i} text={b.text} />
          case 'try': return <Try key={i} commands={b.commands} lab={lab} />
          case 'quiz': return <Quiz key={i} questions={b.questions} />
          case 'mission': return <MissionCard key={i} mission={b.mission} lab={lab} />
          case 'flow': return <Flow key={i} code={b.code} />
          case 'box': return <Box key={i} kind={b.kind} text={b.text} />
        }
      })}
    </div>
  )
}

const BOX = {
  fact: { label: 'Did you know', bar: 'var(--slate)' },
  tip: { label: 'Tip', bar: 'var(--moss)' },
  warn: { label: 'Careful', bar: 'var(--signal)' },
  story: { label: 'Story', bar: 'var(--ochre)' },
}

function Box({ kind, text }: { kind: keyof typeof BOX; text: string }) {
  const b = BOX[kind]
  return (
    <aside className={`relative pl-5 py-1 ${kind === 'story' ? 'font-serif italic' : ''}`}>
      <span className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full" style={{ background: b.bar }} />
      <div className="eyebrow mb-1.5" style={{ color: b.bar }}>{b.label}</div>
      <Md text={text} className="prose-bg !text-[1.05rem] text-ink-2" />
    </aside>
  )
}

function Try({ commands, lab }: { commands: string[]; lab: Lab }) {
  const [ran, setRan] = useState<number[]>([])
  return (
    <div className="rounded-xl bg-[#1c1916] text-[#e8e1d7] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
        <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#a39a8f]">Try it</span>
        <span className="font-mono text-[11px] text-[#a39a8f] hidden sm:inline">click a line to run it in the lab</span>
      </div>
      <ul className="py-1.5">
        {commands.map((c, i) => (
          <li key={i}>
            <button
              onClick={async () => { await lab.type(c); setRan(r => [...r, i]) }}
              className="group w-full text-left px-4 py-1.5 font-mono text-[13.5px] flex items-center gap-3 hover:bg-white/5 transition"
            >
              <span className={ran.includes(i) ? 'text-[#9cc28a]' : 'text-[#e8664a]'}>{ran.includes(i) ? '✓' : '$'}</span>
              <span className="flex-1 break-all">{c}</span>
              <span className="text-[11px] text-[#a39a8f] opacity-0 group-hover:opacity-100 transition">run ↵</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Quiz({ questions }: { questions: Question[] }) {
  return (
    <div className="flex flex-col gap-4">
      {questions.map((q, i) => <QuizQuestion key={q.id} q={q} n={i + 1} total={questions.length} />)}
    </div>
  )
}

function QuizQuestion({ q, n, total }: { q: Question; n: number; total: number }) {
  const progress = useProgress()
  const done = q.id in progress.quizzes
  const [picked, setPicked] = useState<number | null>(null)
  const show = picked !== null || done
  const name = useId()
  return (
    <fieldset className="rounded-xl border border-line bg-card p-5 sm:p-6">
      <legend className="sr-only">Question {n}</legend>
      <div className="eyebrow mb-2">Quick check{total > 1 ? ` · ${n} of ${total}` : ''}</div>
      <p className="text-lg font-semibold leading-snug mb-4">{q.q}</p>
      <div className="grid gap-2">
        {q.options.map((o, i) => {
          const right = i === q.answer
          const state = !show ? '' : right ? 'border-moss bg-moss/10' : picked === i ? 'border-signal bg-signal/10' : 'opacity-60'
          return (
            <label key={i} className={`flex items-start gap-3 rounded-lg border border-line px-3.5 py-2.5 cursor-pointer transition hover:border-ink-2 ${state}`}>
              <input type="radio" name={name} className="mt-1 accent-[var(--signal)]" disabled={show} checked={picked === i} onChange={() => { setPicked(i); answerQuiz(q.id, i === q.answer) }} />
              <span className="font-serif text-[1.05rem]" dangerouslySetInnerHTML={{ __html: marked.parseInline(o) as string }} />
              {show && right && <span className="ml-auto text-moss font-mono text-xs mt-1">correct</span>}
            </label>
          )
        })}
      </div>
      {show && q.why && (
        <p className="mt-4 font-serif text-ink-2"><span className="font-display font-semibold text-ink">{picked === null || picked === q.answer ? 'Yes. ' : 'Not quite. '}</span><span dangerouslySetInnerHTML={{ __html: marked.parseInline(q.why) as string }} /></p>
      )}
    </fieldset>
  )
}

function MissionCard({ mission, lab }: { mission: Mission; lab: Lab }) {
  const progress = useProgress()
  const done = !!progress.missions[mission.id]
  const [results, setResults] = useState<CheckResult[] | null>(null)
  const [hints, setHints] = useState(0)
  const [busy, setBusy] = useState(false)
  const [started, setStarted] = useState(false)
  useEffect(() => lab.onReset(() => setResults(null)), [lab])

  const start = async () => {
    setBusy(true)
    await lab.reset(mission.setup)
    setStarted(true); setResults(null); setBusy(false)
  }
  const check = async () => {
    setBusy(true)
    const r = await runChecks(lab.shell, mission.checks)
    setResults(r); setBusy(false)
    if (r.every(x => x.ok)) finishMission(mission.id, mission.boss)
  }
  const passed = results?.every(r => r.ok)
  return (
    <section className={`rounded-2xl p-6 sm:p-7 ${mission.boss ? 'bg-ink text-paper' : 'bg-paper-2 border border-line'}`}>
      <div className="flex items-center gap-3 mb-3">
        <span className={`eyebrow ${mission.boss ? '!text-signal' : ''}`}>{mission.boss ? 'Boss fight' : 'Mission'}</span>
        {done && <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-moss text-paper">cleared</span>}
      </div>
      <h3 className="text-2xl font-bold tracking-tight mb-2">{mission.title}</h3>
      <div className={mission.boss ? 'text-paper/85' : 'text-ink-2'}><Md text={mission.goal} className="font-serif text-[1.1rem] leading-relaxed" /></div>
      <div className="flex flex-wrap gap-2 mt-5">
        <button onClick={start} disabled={busy} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${mission.boss ? 'bg-paper text-ink hover:bg-white' : 'bg-ink text-paper hover:opacity-90'}`}>
          {started ? 'Restart mission' : 'Start mission'}
        </button>
        <button onClick={check} disabled={busy || (!started && !!mission.setup.length)} className="px-4 py-2 rounded-full text-sm font-semibold bg-signal text-white hover:opacity-90 disabled:opacity-40 transition">Check my work</button>
        {mission.hints.length > 0 && hints < mission.hints.length && (
          <button onClick={() => setHints(h => h + 1)} className={`px-4 py-2 rounded-full text-sm border transition ${mission.boss ? 'border-paper/30 hover:border-paper' : 'border-line hover:border-ink-2'}`}>
            {hints ? 'Another hint' : 'Show a hint'}
          </button>
        )}
      </div>
      {!started && mission.setup.length > 0 && <p className={`mt-3 text-sm ${mission.boss ? 'text-paper/60' : 'text-mute'}`}>Starting the mission resets the lab and sets up a repository for you.</p>}
      {hints > 0 && (
        <ol className="mt-4 space-y-1.5 text-sm font-mono">
          {mission.hints.slice(0, hints).map((h, i) => <li key={i}>→ {h}</li>)}
        </ol>
      )}
      {results && (
        <ul className="mt-5 space-y-1.5">
          {results.map(r => (
            <li key={r.check} className="flex items-start gap-2.5 text-[15px]">
              <span className={`font-mono mt-0.5 ${r.ok ? 'text-moss' : 'text-signal'}`}>{r.ok ? '✓' : '✗'}</span>
              <span className={r.ok ? '' : 'opacity-90'}>{r.label}</span>
            </li>
          ))}
          <li className="pt-2 font-semibold">{passed ? (mission.boss ? 'Boss defeated. That one was real Git.' : 'Mission cleared. Nice work.') : 'Not yet. Fix the red lines and check again.'}</li>
        </ul>
      )}
    </section>
  )
}

let mermaidLoader: Promise<typeof import('mermaid').default> | null = null
function Flow({ code }: { code: string }) {
  const [svg, setSvg] = useState('')
  const id = useId().replace(/:/g, '')
  useEffect(() => {
    let alive = true
    const dark = document.documentElement.dataset.theme === 'dark' || (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches)
    mermaidLoader ??= import('mermaid').then(m => m.default)
    mermaidLoader.then(async mermaid => {
      const css = getComputedStyle(document.documentElement)
      const v = (n: string) => css.getPropertyValue(n).trim()
      mermaid.initialize({
        startOnLoad: false, theme: 'base', securityLevel: 'strict',
        fontFamily: '"Schibsted Grotesk Variable", sans-serif',
        themeVariables: { primaryColor: v('--card'), primaryTextColor: v('--ink'), primaryBorderColor: v('--ink-2'), lineColor: v('--mute'), secondaryColor: v('--paper-2'), tertiaryColor: v('--paper'), fontSize: '15px', darkMode: dark },
      })
      try {
        const out = await mermaid.render(`flow-${id}`, code)
        if (alive) setSvg(out.svg)
      } catch (e) { if (alive) setSvg(`<pre>${String(e)}</pre>`) }
    })
    return () => { alive = false }
  }, [code, id])
  return (
    <figure className="rounded-xl border border-line bg-card p-5 overflow-x-auto">
      <div className="eyebrow mb-3">Flowchart</div>
      <div className="mermaid-box flex justify-center min-h-24" dangerouslySetInnerHTML={{ __html: svg }} />
    </figure>
  )
}

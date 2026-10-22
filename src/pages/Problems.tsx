import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { problems, allTags, problemOfTheDay, type Difficulty } from '../content/problems'
import { useProgress } from '../store/progress'

export const DIFF_TONE: Record<Difficulty, string> = { Easy: 'var(--moss)', Medium: 'var(--ochre)', Hard: 'var(--signal)' }

function Ring({ label, done, total }: { label: Difficulty; done: number; total: number }) {
  const r = 26, c = 2 * Math.PI * r
  return (
    <div className="flex items-center gap-3">
      <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r={r} fill="none" stroke="var(--line)" strokeWidth="6" />
        <circle cx="32" cy="32" r={r} fill="none" stroke={DIFF_TONE[label]} strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (total ? done / total : 0) * c} transform="rotate(-90 32 32)" />
      </svg>
      <div>
        <div className="font-semibold" style={{ color: DIFF_TONE[label] }}>{label}</div>
        <div className="font-mono text-sm tabular-nums">{done}<span className="text-mute">/{total}</span></div>
      </div>
    </div>
  )
}

export default function Problems() {
  const p = useProgress()
  const solved = p.problems ?? {}
  const [diff, setDiff] = useState<Difficulty | 'All'>('All')
  const [status, setStatus] = useState<'All' | 'Solved' | 'Unsolved'>('All')
  const [tag, setTag] = useState('')
  const [q, setQ] = useState('')
  const daily = problemOfTheDay(solved)
  const list = useMemo(() => problems.filter(pr =>
    (diff === 'All' || pr.difficulty === diff) &&
    (status === 'All' || (status === 'Solved') === !!solved[pr.slug]) &&
    (!tag || pr.tags.includes(tag)) &&
    (!q || pr.title.toLowerCase().includes(q.toLowerCase()) || String(pr.number) === q.trim())
  ), [diff, status, tag, q, solved])
  const count = (d: Difficulty) => problems.filter(x => x.difficulty === d)
  const chip = (on: boolean) => `px-3.5 py-1.5 rounded-full text-sm border transition ${on ? 'bg-ink text-paper border-ink' : 'border-line hover:border-ink'}`

  return (
    <div className="gutter max-w-[1200px] mx-auto pt-14">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-10 items-end pb-10 border-b border-line">
        <div>
          <div className="eyebrow mb-3">Practice</div>
          <h1 className="font-display font-extrabold text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.95] tracking-[-0.04em]">{problems.length} Git problems. <span className="font-serif italic font-normal">Real repos. Real checks.</span></h1>
          <p className="mt-5 font-serif text-xl text-ink-2 max-w-2xl">Like coding practice, but for Git. Each problem drops you into a broken or unfinished repository. Fix it with real commands, then press Submit. BossGit inspects the repository and tells you what is still wrong.</p>
        </div>
        <div className="rounded-2xl border border-line bg-card p-6 flex flex-col gap-5">
          <div className="flex justify-between items-baseline"><span className="eyebrow">Solved</span><span className="font-display font-extrabold text-3xl tabular-nums">{Object.keys(solved).filter(s => problems.some(x => x.slug === s)).length}<span className="text-mute text-xl">/{problems.length}</span></span></div>
          <div className="grid grid-cols-3 gap-2">
            {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map(d => <Ring key={d} label={d} total={count(d).length} done={count(d).filter(x => solved[x.slug]).length} />)}
          </div>
        </div>
      </div>

      {daily && (
        <Link to={`/problems/${daily.slug}`} className="group mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl bg-ink text-paper px-6 py-5">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-signal">Problem of the day</span>
          <span className="text-xl font-semibold">{daily.number}. {daily.title}</span>
          <span className="font-mono text-xs" style={{ color: DIFF_TONE[daily.difficulty] }}>{daily.difficulty}</span>
          <span className="ml-auto group-hover:translate-x-1 transition">Solve →</span>
        </Link>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-2">
        {(['All', 'Easy', 'Medium', 'Hard'] as const).map(d => <button key={d} className={chip(diff === d)} onClick={() => setDiff(d)}>{d}</button>)}
        <span className="w-px h-6 bg-line mx-1" />
        {(['All', 'Unsolved', 'Solved'] as const).map(s => <button key={s} className={chip(status === s)} onClick={() => setStatus(s)}>{s === 'All' ? 'Any status' : s}</button>)}
        <select id="problem-tag" value={tag} onChange={e => setTag(e.target.value)} className="px-3 py-1.5 rounded-full text-sm border border-line bg-paper">
          <option value="">Every topic</option>
          {allTags.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <input id="problem-search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search" className="ml-auto px-4 py-1.5 rounded-full text-sm border border-line bg-paper outline-none focus:border-ink w-44" />
      </div>

      <div className="mt-6 border-t border-line">
        {list.map(pr => (
          <Link key={pr.slug} to={`/problems/${pr.slug}`} className="group grid grid-cols-[1.5rem_3rem_minmax(0,1fr)_auto] sm:grid-cols-[1.5rem_3rem_minmax(0,1fr)_minmax(0,16rem)_5rem] gap-3 items-center py-4 border-b border-line">
            <span className={solved[pr.slug] ? 'text-moss' : 'text-line'}>{solved[pr.slug] ? '✓' : '○'}</span>
            <span className="font-mono text-sm text-mute tabular-nums">{String(pr.number).padStart(3, '0')}</span>
            <span className="font-semibold truncate group-hover:text-signal transition-colors">{pr.title}</span>
            <span className="hidden sm:block font-mono text-[11px] text-mute truncate">{pr.tags.join(' · ')}</span>
            <span className="text-sm font-semibold text-right" style={{ color: DIFF_TONE[pr.difficulty] }}>{pr.difficulty}</span>
          </Link>
        ))}
        {!list.length && <p className="py-10 font-serif text-xl text-ink-2">No problems match these filters.</p>}
      </div>
    </div>
  )
}

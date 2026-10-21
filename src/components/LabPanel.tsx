import { useEffect, useState } from 'react'
import type { Lab } from '../engine/lab'
import type { Snapshot } from '../engine/shell'
import Terminal from './Terminal'
import GitGraph from './GitGraph'

export function useSnapshot(lab: Lab) {
  const [snap, setSnap] = useState<Snapshot | null>(null)
  useEffect(() => {
    let alive = true
    let timer: number | undefined
    const refresh = () => {
      clearTimeout(timer)
      timer = window.setTimeout(async () => { await lab.ready; const s = await lab.shell.snapshot(); if (alive) setSnap(s) }, 40)
    }
    const off1 = lab.shell.onChange(refresh)
    const off2 = lab.onReset(refresh)
    refresh()
    return () => { alive = false; off1(); off2(); clearTimeout(timer) }
  }, [lab])
  return snap
}

/** working folder -> staging area -> repository, the three places a file can be */
export function Areas({ snap }: { snap: Snapshot }) {
  const committed = snap.commits.length
  const cols = [
    { name: 'Working folder', hint: 'files you are editing', items: [...snap.untracked.map(f => ({ f, tag: 'new' })), ...snap.modified.map(f => ({ f, tag: 'changed' }))], tone: 'var(--signal)' },
    { name: 'Staging area', hint: 'ready for the next commit', items: snap.staged.map(f => ({ f, tag: 'staged' })), tone: 'var(--ochre)' },
    { name: 'Repository', hint: 'saved in history', items: [] as { f: string; tag: string }[], tone: 'var(--moss)', note: committed ? `${committed} commit${committed > 1 ? 's' : ''}` : 'empty' },
  ]
  return (
    <div className="grid grid-cols-3 gap-px bg-line rounded-lg overflow-hidden text-xs">
      {cols.map((c, i) => (
        <div key={c.name} className="bg-card p-2.5 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.tone }} />
            <span className="font-semibold truncate">{c.name}</span>
            {i < 2 && <span className="ml-auto text-mute hidden sm:inline">→</span>}
          </div>
          <div className="text-mute text-[11px] mb-1.5 truncate">{c.hint}</div>
          <ul className="font-mono space-y-0.5 min-h-[18px]">
            {c.items.slice(0, 5).map(it => <li key={it.f + it.tag} className="truncate" title={it.f}>{it.f}</li>)}
            {c.items.length > 5 && <li className="text-mute">+{c.items.length - 5} more</li>}
            {!c.items.length && <li className="text-mute">{c.note ?? '—'}</li>}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default function LabPanel({ lab, onReset, height = 300, welcome }: { lab: Lab; onReset?: () => void; height?: number; welcome?: string }) {
  const snap = useSnapshot(lab)
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-line bg-card overflow-hidden">
        <div className="flex items-center justify-between px-3.5 py-2 border-b border-line">
          <span className="eyebrow">History</span>
          <span className="font-mono text-[11px] text-mute truncate ml-3">
            {snap?.repo ? (snap.head.branch ? `on ${snap.head.branch}` : 'HEAD detached') : 'no repository'}
            {snap?.op ? ` · ${snap.op} in progress` : ''}
          </span>
        </div>
        {snap ? <GitGraph snap={snap} compact /> : <div className="h-28" />}
      </div>
      {snap?.repo && <Areas snap={snap} />}
      <div className="relative">
        <Terminal lab={lab} height={height} welcome={welcome} />
        {onReset && (
          <button onClick={onReset} className="absolute top-2 right-3 text-[11px] font-mono px-2 py-1 rounded-md text-[#b5aca1] hover:text-white hover:bg-white/10 transition">
            reset lab
          </button>
        )}
      </div>
    </div>
  )
}

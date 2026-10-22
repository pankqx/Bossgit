import { useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Snapshot } from '../engine/shell'

const DX = 64
const DY = 46
const PAD_X = 34
const PAD_Y = 64

type Node = { oid: string; x: number; y: number; lane: number; message: string; parents: string[]; author: string }

export function layout(snap: Snapshot) {
  // commits arrive newest first; give each a lane, keeping first parents in the same lane
  const lanes: (string | null)[] = []
  const pos = new Map<string, { lane: number; row: number }>()
  snap.commits.forEach((c, row) => {
    let lane = lanes.indexOf(c.oid)
    if (lane < 0) { lane = lanes.indexOf(null); if (lane < 0) { lane = lanes.length; lanes.push(null) } }
    for (let i = 0; i < lanes.length; i++) if (i !== lane && lanes[i] === c.oid) lanes[i] = null
    pos.set(c.oid, { lane, row })
    lanes[lane] = c.parents[0] ?? null
    for (const p of c.parents.slice(1)) {
      if (lanes.includes(p) || pos.has(p)) continue
      let free = lanes.indexOf(null)
      if (free < 0) { free = lanes.length; lanes.push(null) }
      lanes[free] = p
    }
  })
  const n = snap.commits.length
  const nodes: Node[] = snap.commits.map(c => {
    const p = pos.get(c.oid)!
    return { oid: c.oid, lane: p.lane, x: PAD_X + (n - 1 - p.row) * DX, y: PAD_Y + p.lane * DY, message: c.message, parents: c.parents, author: c.author }
  })
  const byOid = new Map(nodes.map(nd => [nd.oid, nd]))
  const edges: { key: string; d: string; lane: number }[] = []
  for (const nd of nodes) {
    nd.parents.forEach(p => {
      const pn = byOid.get(p)
      if (!pn) return
      const midX = (nd.x + pn.x) / 2
      const d = pn.y === nd.y
        ? `M${pn.x},${pn.y} L${nd.x},${nd.y}`
        : `M${pn.x},${pn.y} C${midX},${pn.y} ${midX},${nd.y} ${nd.x},${nd.y}`
      edges.push({ key: `${nd.oid}-${p}`, d, lane: Math.max(nd.lane, pn.lane) })
    })
  }
  const maxLane = nodes.reduce((m, nd) => Math.max(m, nd.lane), 0)
  return { nodes, edges, width: PAD_X * 2 + Math.max(0, n - 1) * DX + 90, height: PAD_Y + maxLane * DY + 40 }
}

const laneColor = (lane: number) => ['var(--moss)', 'var(--ochre)', 'var(--slate)', 'var(--signal)', 'var(--ink-2)'][lane % 5]

export default function GitGraph({ snap, compact = false }: { snap: Snapshot; compact?: boolean }) {
  const { nodes, edges, width, height } = useMemo(() => layout(snap), [snap])
  const scroller = useRef<HTMLDivElement>(null)
  useEffect(() => { const el = scroller.current; if (el) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' }) }, [nodes.length])

  const labels = useMemo(() => {
    const m = new Map<string, { text: string; kind: 'branch' | 'head' | 'remote' | 'tag' }[]>()
    const add = (oid: string, text: string, kind: 'branch' | 'head' | 'remote' | 'tag') => { if (!m.has(oid)) m.set(oid, []); m.get(oid)!.push({ text, kind }) }
    for (const [b, oid] of Object.entries(snap.branches)) add(oid, b, b === snap.head.branch ? 'head' : 'branch')
    for (const [r, oid] of Object.entries(snap.remotes)) add(oid, r, 'remote')
    for (const [t, oid] of Object.entries(snap.tags)) add(oid, t, 'tag')
    if (!snap.head.branch && snap.head.oid) add(snap.head.oid, 'HEAD', 'head')
    return m
  }, [snap])

  if (!snap.repo) return <Empty text="No repository yet. Run git init to make one." />
  if (!nodes.length) return <Empty text={`On ${snap.head.branch ?? 'main'}. No commits yet — make your first one.`} />

  const headOid = snap.head.oid
  return (
    <div ref={scroller} className="overflow-x-auto overflow-y-hidden" style={{ maxHeight: compact ? 220 : 360 }}>
      <svg width={width} height={height} role="img" aria-label={`Commit graph with ${nodes.length} commits`} className="block">
        <g fill="none" strokeWidth={2.5} strokeLinecap="round">
          <AnimatePresence>
            {edges.map(e => (
              <motion.path key={e.key} d={e.d} stroke={laneColor(e.lane)} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: 'easeOut' }} />
            ))}
          </AnimatePresence>
        </g>
        <AnimatePresence>
          {nodes.map(nd => {
            const isHead = nd.oid === headOid
            const tags = labels.get(nd.oid) ?? []
            return (
              <motion.g key={nd.oid} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.4 }} transition={{ type: 'spring', stiffness: 380, damping: 26 }} style={{ originX: `${nd.x}px`, originY: `${nd.y}px` }}>
                <title>{`${nd.oid.slice(0, 7)} ${nd.message} — ${nd.author}`}</title>
                {isHead && <circle cx={nd.x} cy={nd.y} r={13} fill="none" stroke="var(--signal)" strokeWidth={2} strokeDasharray="3 3" />}
                <circle cx={nd.x} cy={nd.y} r={nd.parents.length > 1 ? 8 : 7} fill={nd.parents.length > 1 ? 'var(--paper)' : laneColor(nd.lane)} stroke={laneColor(nd.lane)} strokeWidth={3} />
                <text x={nd.x} y={nd.y + 25} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={10} fill="var(--mute)">{nd.oid.slice(0, 7)}</text>
                {tags.map((t, i) => <Label key={t.text} x={nd.x} y={nd.y - 20 - i * 19} text={t.text} kind={t.kind} />)}
              </motion.g>
            )
          })}
        </AnimatePresence>
      </svg>
    </div>
  )
}

function Label({ x, y, text, kind }: { x: number; y: number; text: string; kind: 'branch' | 'head' | 'remote' | 'tag' }) {
  const w = text.length * 6.6 + (kind === 'head' ? 22 : 14)
  const fill = kind === 'head' ? 'var(--signal)' : kind === 'branch' ? 'var(--ink)' : 'var(--paper)'
  const stroke = kind === 'remote' ? 'var(--slate)' : kind === 'tag' ? 'var(--ochre)' : 'none'
  const color = kind === 'head' || kind === 'branch' ? 'var(--paper)' : kind === 'remote' ? 'var(--slate)' : 'var(--ochre)'
  return (
    <g>
      <rect x={x - w / 2} y={y - 9} width={w} height={17} rx={kind === 'tag' ? 2 : 8.5} fill={fill} stroke={stroke} strokeWidth={1.2} />
      <text x={x} y={y + 3.5} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={10.5} fontWeight={600} fill={color}>
        {kind === 'head' ? `● ${text}` : text}
      </text>
    </g>
  )
}

function Empty({ text }: { text: string }) {
  return <div className="h-28 grid place-items-center text-sm text-mute font-mono px-4 text-center">{text}</div>
}

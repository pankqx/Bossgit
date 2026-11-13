import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

// Hand-drafted line art for BossGit. Everything is one even ink stroke on paper,
// drawn with pathLength={1} so CSS can "draw" it in (see .draw-in in styles.css).

const d = (s: number): CSSProperties => ({ animationDelay: `${s}s` })

/**
 * The hero drawing: a Git history drawn as a tree on a drafting table.
 * main is the trunk, feature branches grow out and merge back, a fix
 * branch is still growing, and the remote floats above as a cloud.
 */
export function HeroTree({ className = '' }: { className?: string }) {
  const ink = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const commit = (cx: number, cy: number, t: number, key: string) => (
    <circle key={key} className="pop-in" style={d(t)} cx={cx} cy={cy} r={7} fill="var(--card)" stroke="currentColor" strokeWidth={2} />
  )
  return (
    <svg viewBox="0 0 520 540" className={`text-ink ${className}`} role="img" aria-label="A line drawing of a Git history shaped like a tree">
      {/* construction lines: compass circle, rulers, dimension marks */}
      <g stroke="var(--line)" strokeWidth={1.2} fill="none">
        <circle className="draw-in" style={d(0)} cx={262} cy={250} r={196} strokeDasharray="4 6" pathLength={1} />
        <path className="draw-in" style={d(0.1)} d="M40 486H490" pathLength={1} />
        <path className="draw-in" style={d(0.2)} d="M60 476v20M120 480v12M180 476v20M240 480v12M300 476v20M360 480v12M420 476v20M480 480v12" pathLength={1} />
      </g>
      {/* ground */}
      <path {...ink} className="draw-in" style={d(0.2)} d="M120 470c40-6 90-8 142-8s110 3 150 9" pathLength={1} />
      <path {...ink} strokeWidth={1.5} className="draw-in" style={d(0.4)} d="M200 470c8-10 18-12 28-6M300 468c10-9 22-10 32-2" pathLength={1} />

      {/* main: the trunk */}
      <path {...ink} strokeWidth={3} className="draw-in" style={d(0.3)} d="M262 466V104" pathLength={1} />
      {/* feature/login: grows right, merges back */}
      <path {...ink} strokeWidth={2.4} className="draw-in" style={d(0.9)} d="M262 392c0-30 30-44 64-50s56-28 56-62v-36c0-34-30-50-64-56s-56-18-56-46" pathLength={1} />
      {/* fix/typo: grows left, still open */}
      <path {...ink} strokeWidth={2.4} className="draw-in" style={d(1.2)} d="M262 330c0-26-26-38-56-44s-50-24-50-56v-40" pathLength={1} />
      {/* tiny experiment twig */}
      <path {...ink} strokeWidth={1.8} className="draw-in" style={d(1.5)} d="M156 230c-26-6-44-22-48-46" pathLength={1} />

      {/* commits */}
      {[[262, 440, 0.6], [262, 392, 0.7], [262, 330, 0.8], [262, 270, 0.9], [262, 210, 1.0], [262, 142, 1.1]].map(([x, y, t], i) => commit(x, y, t, 'm' + i))}
      {[[340, 338, 1.3], [382, 276, 1.4], [382, 232, 1.5]].map(([x, y, t], i) => commit(x, y, t, 'f' + i))}
      {[[200, 284, 1.6], [156, 226, 1.7], [156, 190, 1.8]].map(([x, y, t], i) => commit(x, y, t, 'x' + i))}
      {commit(108, 184, 1.9, 'e')}
      {/* HEAD */}
      <circle className="pop-in" style={d(2.1)} cx={262} cy={104} r={10} fill="var(--signal)" stroke="currentColor" strokeWidth={2.2} />

      {/* leaves: little sketched strokes around the crown */}
      <g {...ink} strokeWidth={1.6}>
        <path className="draw-in" style={d(1.9)} d="M282 96c10-14 26-16 36-8-8 12-24 16-36 8z" pathLength={1} />
        <path className="draw-in" style={d(2.0)} d="M242 96c-10-14-26-16-36-8 8 12 24 16 36 8z" pathLength={1} />
        <path className="draw-in" style={d(2.1)} d="M398 228c14-6 28 0 32 12-14 6-28 0-32-12z" pathLength={1} />
        <path className="draw-in" style={d(2.2)} d="M94 176c-8-12-4-26 8-32 8 12 4 26-8 32z" pathLength={1} />
      </g>

      {/* labels, drawn as tags with a string */}
      <g fontFamily="JetBrains Mono, monospace" fontSize={13} fill="currentColor">
        <g className="pop-in" style={d(2.3)}>
          <path d="M296 104h16" stroke="var(--signal)" strokeWidth={2} />
          <rect x={312} y={90} width={118} height={28} rx={6} fill="var(--signal)" />
          <text x={322} y={109} fill="#fff" fontWeight={600}>HEAD → main</text>
        </g>
        <g className="pop-in" style={d(2.4)}>
          <path d="M398 276h14" stroke="currentColor" strokeWidth={1.5} />
          <rect x={412} y={263} width={98} height={26} rx={6} fill="var(--card)" stroke="currentColor" strokeWidth={1.5} />
          <text x={421} y={281}>feat/login</text>
        </g>
        <g className="pop-in" style={d(2.5)}>
          <rect x={34} y={258} width={82} height={26} rx={6} fill="var(--lime)" stroke="currentColor" strokeWidth={1.5} />
          <path d="M116 271c16 0 28-14 33-38" fill="none" stroke="currentColor" strokeWidth={1.5} strokeDasharray="3 4" />
          <text x={43} y={276} fill="#14213d">fix/typo</text>
        </g>
        <text x={282} y={446} fill="var(--mute)" fontSize={11} className="pop-in" style={d(2.6)}>a1f3c9e  first commit</text>
      </g>

      {/* the remote: a cloud above, with a dashed push arrow */}
      <g {...ink} strokeWidth={1.8}>
        <path className="draw-in" style={d(2.2)} d="M370 46c-2-16 12-28 28-24 6-14 28-16 36-2 16-2 26 12 20 26 12 6 8 24-6 24h-72c-14 0-18-18-6-24z" pathLength={1} />
        <path className="draw-in" style={d(2.6)} d="M300 92c20-24 40-36 64-40" strokeDasharray="5 6" pathLength={1} />
        <path className="draw-in" style={d(2.8)} d="M352 46l14 6-10 12" pathLength={1} />
      </g>
      <text x={392} y={60} fontFamily="JetBrains Mono, monospace" fontSize={12} fill="currentColor" className="pop-in" style={d(2.8)}>origin</text>
      <text x={286} y={64} fontFamily="JetBrains Mono, monospace" fontSize={11} fill="var(--mute)" transform="rotate(-24 300 64)" className="pop-in" style={d(3)}>git push</text>
    </svg>
  )
}

/** Line icons for the seven tracks of the course. */
export function TrackIcon({ name, size = 44 }: { name: string; size?: number }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const body: Record<string, ReactNode> = {
    'Before Git': <><rect {...p} x={5} y={9} width={34} height={26} rx={4} /><path {...p} d="M12 18l5 4-5 4M21 27h9" /></>,
    Foundations: <><path {...p} d="M8 34h28M12 34V20M22 34V14M32 34V24" /><circle {...p} cx={12} cy={16} r={3} /><circle {...p} cx={22} cy={10} r={3} /><circle {...p} cx={32} cy={20} r={3} /></>,
    Branching: <><path {...p} d="M14 38V8M14 30c0-8 16-6 16-16V10" /><circle {...p} cx={14} cy={8} r={3} fill="var(--card)" /><circle {...p} cx={30} cy={8} r={3} fill="var(--card)" /><circle {...p} cx={14} cy={38} r={3} fill="var(--card)" /></>,
    GitHub: <><path {...p} d="M11 26c-6 0-7-8-2-9 0-7 8-9 11-4 3-5 12-3 11 4 6 1 5 9-1 9z" /><path {...p} d="M17 32l5 5 5-5M22 37V27" /></>,
    Automation: <><circle {...p} cx={22} cy={22} r={6} /><path {...p} d="M22 6v5M22 33v5M6 22h5M33 22h5M10.7 10.7l3.5 3.5M29.8 29.8l3.5 3.5M10.7 33.3l3.5-3.5M29.8 14.2l3.5-3.5" /></>,
    Advanced: <><path {...p} d="M22 6l14 8v16l-14 8-14-8V14z" /><path {...p} d="M8 14l14 8 14-8M22 22v16" /></>,
    Mastery: <><path {...p} d="M8 32l-2-18 9 8 7-12 7 12 9-8-2 18z" /><path {...p} d="M8 37h28" /><circle cx={22} cy={10} r={2.4} fill="var(--signal)" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden="true">{body[name] ?? body.Foundations}</svg>
}

/** A hand-drawn underline. */
export function Squiggle({ className = '', color = 'var(--signal)', delay = 0.9 }: { className?: string; color?: string; delay?: number }) {
  return (
    <svg className={className} viewBox="0 0 300 18" preserveAspectRatio="none" aria-hidden="true">
      <path className="draw-in" style={d(delay)} d="M3 12C40 4 80 15 120 8s80-6 110 1 50 3 67-3" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" pathLength={1} />
    </svg>
  )
}

/** Small sketches used beside sections. */
export function Sketch({ kind, className = '' }: { kind: 'terminal' | 'shield' | 'puzzle' | 'trophy' | 'people' | 'rocket'; className?: string }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, pathLength: 1, className: 'draw-on-view' }
  const art: Record<string, ReactNode> = {
    terminal: <><rect {...p} x={8} y={14} width={104} height={72} rx={8} /><path {...p} d="M8 28h104" /><path {...p} d="M22 46l10 8-10 8M40 64h22" /><circle cx={18} cy={21} r={2.4} fill="var(--signal)" /></>,
    shield: <><path {...p} d="M60 10l38 12v26c0 22-16 36-38 44-22-8-38-22-38-44V22z" /><path {...p} d="M44 52l12 12 22-24" /></>,
    puzzle: <><path {...p} d="M20 30h24c0-10 16-10 16 0h24v24c-10 0-10 16 0 16v24H60c0-10-16-10-16 0H20V70c10 0 10-16 0-16z" /></>,
    trophy: <><path {...p} d="M38 14h44v22c0 18-10 30-22 30S38 54 38 36z" /><path {...p} d="M38 22H24c0 16 8 22 16 22M82 22h14c0 16-8 22-16 22M60 66v14M42 92h36M48 80h24" /></>,
    people: <><circle {...p} cx={40} cy={34} r={12} /><circle {...p} cx={82} cy={38} r={10} /><path {...p} d="M16 90c0-18 10-30 24-30s24 12 24 30M64 88c2-14 8-24 18-24s18 10 20 24" /></>,
    rocket: <><path {...p} d="M60 10c20 14 26 40 16 66H44C34 50 40 24 60 10z" /><circle {...p} cx={60} cy={40} r={8} /><path {...p} d="M44 66l-14 14 4 10 12-6M76 66l14 14-4 10-12-6M52 86l8 18 8-18" /></>,
  }
  return <svg viewBox="0 0 120 110" className={className} aria-hidden="true">{art[kind]}</svg>
}

/** Adds .seen to an element once it scrolls into view, so .draw-on-view paths draw themselves. */
export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) { el.classList.add('seen'); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('seen'); io.disconnect() } }, { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>
}

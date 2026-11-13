// The BossGit mark: a capital B drawn as a Git graph in one even ink line.
// The stem is main; each bowl is a branch that leaves and merges back.
// Open rings are commits. The filled orange dot is HEAD.
export function Mark({ size = 32, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" className={animated ? 'bg-mark' : undefined}>
      <g fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path className="m-stem" d="M14 7v34" pathLength={1} />
        <path className="m-top" d="M14 7h11a8 8 0 0 1 0 16H14" pathLength={1} />
        <path className="m-bot" d="M14 23h13a9 9 0 0 1 0 18H14" pathLength={1} />
      </g>
      <g fill="var(--paper)" stroke="currentColor" strokeWidth={2.6}>
        <circle className="m-dot" cx={14} cy={23} r={3.4} />
        <circle className="m-dot" cx={36} cy={32} r={3.4} />
      </g>
      <circle className="m-head" cx={33} cy={15} r={4} fill="var(--signal)" stroke="currentColor" strokeWidth={2.2} />
    </svg>
  )
}

export function Wordmark({ size = 30 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2 text-ink" aria-label="BossGit">
      <Mark size={size} />
      <span className="leading-none tracking-tight" style={{ fontSize: size * 0.74 }}>
        <span className="font-display font-extrabold">Boss</span>
        <span className="font-serif italic font-normal">Git</span>
      </span>
    </span>
  )
}

/** The full-screen loader: the mark draws itself, again and again, while code loads. */
export function Loader({ label = 'git init…', inline = false }: { label?: string; inline?: boolean }) {
  return (
    <div className={inline ? 'grid place-items-center py-24' : 'bg-loader'} role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4 text-ink">
        <LoaderMark />
        <span className="font-mono text-xs tracking-[0.14em] uppercase text-mute">{label}</span>
      </div>
    </div>
  )
}

export function LoaderMark({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" className="bg-loader-mark">
      <g fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 7v34" pathLength={1} />
        <path className="l2" d="M14 7h11a8 8 0 0 1 0 16H14" pathLength={1} />
        <path className="l3" d="M14 23h13a9 9 0 0 1 0 18H14" pathLength={1} />
      </g>
      <circle cx={33} cy={15} r={3.6} fill="var(--signal)" />
    </svg>
  )
}

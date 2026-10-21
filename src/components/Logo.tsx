// The BossGit mark: a capital B drawn as a Git graph. The stem is the main
// branch; each bowl is a branch that leaves and merges back. The red dot is HEAD.
export function Mark({ size = 32, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" className={animated ? 'bg-mark' : undefined}>
      <g fill="none" stroke="currentColor" strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round">
        <path className="m-stem" d="M15 9v30" pathLength={1} />
        <path className="m-top" d="M15 9h10a7.5 7.5 0 0 1 0 15H15" pathLength={1} />
        <path className="m-bot" d="M15 24h12a7.5 7.5 0 0 1 0 15H15" pathLength={1} />
      </g>
      <circle className="m-head" cx={32.5} cy={16.5} r={3.6} fill="var(--signal)" />
      <circle className="m-dot" cx={34.5} cy={31.5} r={3.6} fill="currentColor" />
    </svg>
  )
}

export function Wordmark({ size = 30 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2 text-ink" aria-label="BossGit">
      <Mark size={size} />
      <span className="leading-none tracking-tight" style={{ fontSize: size * 0.72 }}>
        <span className="font-display font-extrabold">Boss</span>
        <span className="font-serif italic font-normal">Git</span>
      </span>
    </span>
  )
}

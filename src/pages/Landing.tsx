import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lab } from '../engine/lab'
import { useSnapshot, Areas } from '../components/LabPanel'
import Terminal from '../components/Terminal'
import GitGraph from '../components/GitGraph'
import CourseMap from '../components/CourseMap'
import { HeroTree, TrackIcon, Squiggle, Sketch, Reveal } from '../components/LineArt'
import { modules, allLessons, missionCount, tracks } from '../content'
import { problems } from '../content/problems'
import { DIFF_TONE } from './Problems'

// a few problems to show off on the landing page, from easy to hard
const SHOWCASE = ['wrong-branch', 'recover-deleted-branch', 'purge-password', 'rebase-onto', 'sync-fork']

const DEMO = [
  'git init',
  'echo "# My first project" > README.md',
  'git add README.md',
  'git commit -m "Start my project"',
  'git switch -c idea',
  'echo "a bold idea" > idea.txt',
  'git add . && git commit -m "Try a bold idea"',
  'git switch main',
  'echo "Made with BossGit" >> README.md',
  'git commit -am "Polish the readme"',
  'git merge idea -m "Keep the idea"',
  'git log --oneline',
]

function HeroLab() {
  const lab = useMemo(() => new Lab('hero', ['mkdir project', 'cd project']), [])
  const snap = useSnapshot(lab)
  const [phase, setPhase] = useState<'idle' | 'playing' | 'yours'>('idle')
  const box = useRef<HTMLDivElement>(null)

  const play = async () => {
    setPhase('playing')
    for (const c of DEMO) {
      await lab.type(c)
      await new Promise(r => setTimeout(r, 380))
    }
    setPhase('yours')
  }
  useEffect(() => {
    const el = box.current
    if (!el) return
    let started = false
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) { started = true; setTimeout(play, 700) }
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={box} className="drawn overflow-hidden">
      <div className="flex items-center gap-2 px-4 h-10 border-b-[1.5px] border-ink">
        <span className="w-3 h-3 rounded-full border-[1.5px] border-ink bg-signal" />
        <span className="w-3 h-3 rounded-full border-[1.5px] border-ink" />
        <span className="w-3 h-3 rounded-full border-[1.5px] border-ink" />
        <span className="ml-3 font-mono text-[11px] text-mute truncate">~/project · real Git, running in this tab</span>
        {phase === 'yours' && (
          <button onClick={async () => { await lab.reset(['mkdir project', 'cd project']); play() }} className="ml-auto font-mono text-[11px] text-mute hover:text-ink">replay</button>
        )}
      </div>
      <div className="px-2 pt-2 min-h-[176px]">{snap && <GitGraph snap={snap} compact />}</div>
      {snap?.repo && <div className="px-3 pb-3"><Areas snap={snap} /></div>}
      <Terminal lab={lab} height={typeof window !== "undefined" && window.innerWidth < 640 ? 200 : 240} />
      <div className="px-4 py-2.5 text-[13px] border-t-[1.5px] border-ink flex items-center gap-2 min-h-[42px]">
        {phase === 'yours'
          ? <><span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" /><span>Your turn. Click the terminal and type <code className="font-mono text-signal">git log --oneline --all</code></span></>
          : <span className="text-mute">Watch a branch leave main and merge back…</span>}
      </div>
    </div>
  )
}

const HARD_THINGS = [
  { q: 'What is HEAD, really?', a: 'A sticky note that says "you are here". Move it and your files change to match.', to: '/learn/06-branches' },
  { q: 'Why does rebase "rewrite history"?', a: 'It does not move your commits. It makes new copies of them somewhere else.', to: '/learn/08-rebase' },
  { q: 'Can I undo this?', a: 'Almost always. Git keeps a private diary of every place you have been: the reflog.', to: '/rescue' },
  { q: 'What is inside the .git folder?', a: 'Four kinds of objects and a few text files. You will build one by hand.', to: '/learn/19-internals' },
]

const STEPS: { n: string; t: string; d: string; code: string; art: 'terminal' | 'shield' | 'puzzle' | 'trophy' }[] = [
  { art: 'puzzle', n: '01', t: 'Read', d: 'Short lessons in plain English, with stories, pictures and facts. No jargon without an explanation.', code: '# a branch is just a name\n# pointing at a commit' },
  { art: 'terminal', n: '02', t: 'Try', d: 'Click any command in a lesson and it runs in the lab beside you. Watch the graph change.', code: '$ git switch -c idea\nSwitched to a new branch' },
  { art: 'shield', n: '03', t: 'Prove', d: 'Missions give you a goal. BossGit reads your real repository and tells you what is right.', code: '✓ A branch called idea exists\n✓ idea is merged into main' },
  { art: 'trophy', n: '04', t: 'Fight', d: 'Every module ends with a boss: a broken repository only real skill can fix.', code: 'CONFLICT (content):\nMerge conflict in app.js' },
]

const HOOKS = [
  { t: 'A streak you will not want to break', d: 'One lesson a day lights up your streak. Miss a day and it starts again, just like your GitHub graph.' },
  { t: 'Eight ranks to climb', d: 'Every lesson, quiz, mission and problem gives XP. Go from Newcomer to Committer, Rebaser, Rescuer and finally Git Boss.' },
  { t: 'A boss at the end of every module', d: 'A broken repository that only real skill can fix. Beat it and the module turns solid on your map.' },
  { t: 'A certificate with your name', d: 'Finish the course and print a certificate that lists every lesson, mission and problem you cleared.' },
]

export default function Landing() {
  const written = allLessons.length
  const first = allLessons[0] ? `/learn/${allLessons[0].moduleId}/${allLessons[0].slug}` : '/learn'
  const fade = (delay: number) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] as const } })
  return (
    <div className="overflow-x-clip">
      {/* hero */}
      <section className="gutter max-w-[1400px] mx-auto pt-10 sm:pt-16 pb-14 sm:pb-20 grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-8 lg:gap-14 items-center">
        <div>
          <motion.div {...fade(0)} className="inline-flex items-center gap-2 border-[1.5px] border-ink rounded-full pl-1.5 pr-4 py-1 mb-7 bg-card">
            <span className="font-mono text-[11px] bg-ink text-paper rounded-full px-2 py-0.5">v1.0</span>
            <span className="text-[13px] sm:text-sm font-medium">The whole course is out: {written} lessons</span>
          </motion.div>
          <h1 className="font-display font-extrabold tracking-[-0.04em] leading-[0.95] text-[clamp(2.7rem,8vw,6.6rem)]">
            <motion.span className="block" {...fade(0.08)}>From your first</motion.span>
            <motion.span className="block" {...fade(0.16)}>commit to</motion.span>
            <motion.span className="block" {...fade(0.24)}>
              <span className="relative inline-block whitespace-nowrap">
                <span className="hl">Git boss.</span>
                <Squiggle className="absolute left-0 -bottom-3 w-full h-4" delay={1} />
              </span>
            </motion.span>
          </h1>
          <motion.p {...fade(0.4)} className="mt-9 font-serif text-[1.2rem] sm:text-[1.35rem] leading-relaxed text-ink-2 max-w-[34rem]">
            The complete, hands-on course for Git and GitHub. A real Git terminal runs in your browser. You read, you type, BossGit checks your work. It ends with you building your own Git and your own GitHub.
          </motion.p>
          <motion.div {...fade(0.5)} className="mt-8 flex flex-wrap items-center gap-3">
            <Link to={first} className="btn-ink text-[17px] group">Start lesson one <span className="transition-transform group-hover:translate-x-1">→</span></Link>
            <Link to="/learn" className="btn-line text-[17px]">See all {modules.length} modules</Link>
          </motion.div>
          <motion.p {...fade(0.6)} className="mt-6 font-mono text-xs text-mute">No account · no install · works on your phone</motion.p>
        </div>
        <motion.figure {...fade(0.2)} className="relative min-w-0 max-w-[560px] w-full mx-auto">
          <HeroTree className="w-full h-auto" />
          <figcaption className="mt-1 text-center font-mono text-[11px] text-mute">Fig. 1 — a repository is a tree you grow, one commit at a time.</figcaption>
        </motion.figure>
      </section>

      {/* numbers */}
      <section className="gutter max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {[
            [String(modules.length), 'modules, from mkdir to Git internals'],
            [String(written), 'lessons, every one with things to type'],
            [String(problems.length + missionCount), `checked challenges: ${missionCount} missions and ${problems.length} problems`],
            ['1', 'capstone: build your own GitHub'],
          ].map(([n, l], i) => (
            <div key={l} className="drawn p-4 sm:p-6" style={{ boxShadow: `4px 4px 0 ${['var(--ink)', 'var(--signal)', 'var(--ink)', 'var(--moss)'][i]}` }}>
              <div className="font-display font-extrabold text-[clamp(2.2rem,5vw,3.8rem)] leading-none tracking-tight tabular-nums">{n}</div>
              <div className="mt-2 text-ink-2 text-[14px] sm:text-[15px] leading-snug">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* live lab */}
      <section className="gutter max-w-[1400px] mx-auto pt-20 sm:pt-28 grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-10 items-center">
        <div>
          <div className="eyebrow mb-4">Try it right now</div>
          <h2 className="font-display font-bold text-[clamp(2rem,4vw,3.4rem)] leading-[1] tracking-[-0.03em]">This is <span className="hl">real Git</span>, running in this tab.</h2>
          <p className="mt-5 font-serif text-[1.15rem] leading-relaxed text-ink-2 max-w-[38ch]">Watch a branch leave main and come back. Then type your own commands. The graph and the three areas of Git redraw after every command, so you always see what Git is doing.</p>
          <ul className="mt-6 space-y-2 font-mono text-[13px] text-ink-2">
            <li>✓ about 70 Git commands, with their real options</li>
            <li>✓ branches, merges, rebase, stash, reflog, bisect</li>
            <li>✓ fake remotes so you can push, pull and open PRs</li>
          </ul>
        </div>
        <div className="min-w-0"><HeroLab /></div>
      </section>

      {/* how it works */}
      <section className="gutter max-w-[1400px] mx-auto py-20 sm:py-28">
        <div className="eyebrow mb-4">How a lesson works</div>
        <h2 className="font-display font-bold text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.02] tracking-[-0.03em] mb-10">You learn Git by <span className="font-serif italic font-normal">doing</span> Git.</h2>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map(s => (
            <li key={s.n}>
              <Reveal className="drawn p-6 h-full flex flex-col gap-4">
                <Sketch kind={s.art} className="w-20 h-auto text-ink" />
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-sm text-signal">{s.n}</span>
                  <h3 className="text-2xl font-bold tracking-tight">{s.t}</h3>
                </div>
                <p className="font-serif text-[1.08rem] leading-relaxed text-ink-2">{s.d}</p>
                <pre className="mt-auto font-mono text-[12px] leading-relaxed bg-[#0e1a2e] text-[#e4ebf6] rounded-lg px-4 py-3 whitespace-pre-wrap">{s.code}</pre>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* the route, on a blueprint */}
      <section className="bg-[#0b1a2e] text-[#e9eff9] relative" style={{ backgroundImage: 'linear-gradient(rgba(150,190,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(150,190,255,.08) 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
        <div className="gutter max-w-[1400px] mx-auto py-20 sm:py-24">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_auto] gap-6 items-end mb-10">
            <div>
              <div className="font-mono text-xs tracking-[0.14em] uppercase text-white/50 mb-4">The blueprint</div>
              <h2 className="font-display font-bold text-[clamp(2rem,4.4vw,3.8rem)] leading-[1] tracking-[-0.035em] max-w-[18ch]">One line from <span className="font-mono font-normal text-[0.8em] text-[#ff7440]">mkdir</span> to mastery.</h2>
            </div>
            <Link to="/learn" className="inline-flex px-5 py-3 rounded-full border-[1.5px] border-[#e9eff9] font-semibold hover:bg-[#e9eff9] hover:text-[#0b1a2e] transition w-fit">Open the course</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 mb-6 -mx-1 px-1 snap-x">
            {tracks.map((t, i) => (
              <div key={t.name} className="snap-start shrink-0 flex items-center gap-3 rounded-xl border border-white/20 px-4 py-3">
                <span className="text-[#d4ff4f]"><TrackIcon name={t.name} size={34} /></span>
                <span><span className="block font-mono text-[10px] text-white/50">TRACK {i}</span><span className="block font-semibold text-[15px] whitespace-nowrap">{t.name}</span></span>
              </div>
            ))}
          </div>
          <CourseMap inverted />
        </div>
      </section>

      {/* capstone */}
      <section className="gutter max-w-[1400px] mx-auto pt-20 sm:pt-28">
        <Reveal className="drawn p-6 sm:p-12 grid md:grid-cols-[auto_1fr] gap-8 items-center" >
          <Sketch kind="rocket" className="w-28 sm:w-40 h-auto text-ink float-y" />
          <div>
            <div className="eyebrow mb-3 text-signal">The capstone · Module 29</div>
            <h2 className="font-display font-extrabold text-[clamp(2rem,4.6vw,3.8rem)] leading-[0.98] tracking-[-0.035em]">Build your own Git. Then build your own <span className="hl">GitHub</span>.</h2>
            <p className="mt-5 font-serif text-[1.15rem] leading-relaxed text-ink-2 max-w-[60ch]">You write <code className="font-mono text-[0.85em]">minigit</code>, a small Git in Node that makes real objects real Git can read. Then you build MiniHub: a server you can <code className="font-mono text-[0.85em]">git push</code> to, with a web page for code, commits and pull requests that merge on the server. It is the project that makes interviewers lean in.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/learn/29-capstone" className="btn-ink">See the capstone →</Link>
              <Link to="/learn/30-boss-rush" className="btn-line">Then the Boss Rush</Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* practice problems */}
      <section className="gutter max-w-[1400px] mx-auto pt-20 sm:pt-28">
        <div className="grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)] gap-10 lg:gap-12">
          <div>
            <div className="eyebrow mb-4">Practice</div>
            <h2 className="font-display font-bold text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.02] tracking-[-0.03em]">Then you train like it is <span className="font-serif italic font-normal">LeetCode</span>.</h2>
            <p className="mt-5 font-serif text-[1.15rem] leading-relaxed text-ink-2 max-w-[34ch]">{problems.length} real disasters, from a typo in a commit message to a password stuck in history. You fix them in a real repository and press Submit.</p>
            <Link to="/problems" className="mt-8 btn-ink">See all problems</Link>
          </div>
          <ul className="border-t-[1.5px] border-ink">
            {SHOWCASE.map(slug => problems.find(p => p.slug.endsWith(slug))).filter(p => !!p).map(p => (
              <li key={p!.slug}>
                <Link to={`/problems/${p!.slug}`} className="group grid grid-cols-[2.6rem_1fr_auto] sm:grid-cols-[3.2rem_1fr_auto] items-baseline gap-3 sm:gap-4 py-5 border-b border-dashed border-ink/30">
                  <span className="font-mono text-sm text-mute tabular-nums">{String(p!.number).padStart(3, '0')}</span>
                  <span className="text-[1.15rem] sm:text-[1.45rem] font-bold tracking-tight leading-tight group-hover:text-signal transition-colors">{p!.title}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] border rounded-full px-2 py-0.5" style={{ color: DIFF_TONE[p!.difficulty], borderColor: DIFF_TONE[p!.difficulty] }}>{p!.difficulty}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* why it sticks */}
      <section className="gutter max-w-[1400px] mx-auto pt-20 sm:pt-28">
        <div className="eyebrow mb-4">Why people keep coming back</div>
        <h2 className="font-display font-bold text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.02] tracking-[-0.03em] max-w-[22ch] mb-10">It feels like a game. You leave with a <span className="hl">real skill</span>.</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {HOOKS.map((h, i) => (
            <div key={h.t} className="drawn-soft p-6 border-[1.5px] !border-ink/70 border-dashed">
              <div className="font-mono text-xs text-signal mb-3">0{i + 1}</div>
              <h3 className="text-xl font-bold tracking-tight leading-snug">{h.t}</h3>
              <p className="mt-3 font-serif text-[1.05rem] leading-relaxed text-ink-2">{h.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* the hard things */}
      <section className="gutter max-w-[1400px] mx-auto py-20 sm:py-28">
        <div className="eyebrow mb-4">The parts nobody explains</div>
        <h2 className="font-display font-bold text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.02] tracking-[-0.03em] max-w-[22ch] mb-10">Plain answers to the questions that make people quit.</h2>
        <div className="grid md:grid-cols-2 gap-x-12">
          {HARD_THINGS.map((h, i) => (
            <Link key={h.q} to={h.to} className="group border-t-[1.5px] border-ink py-7 grid grid-cols-[2.2rem_1fr] gap-4">
              <span className="font-mono text-sm text-mute pt-2">{String(i + 1).padStart(2, '0')}</span>
              <span>
                <span className="block text-[1.35rem] sm:text-[1.6rem] font-bold tracking-tight leading-tight group-hover:text-signal transition-colors">{h.q}</span>
                <span className="block mt-3 font-serif text-[1.1rem] leading-relaxed text-ink-2">{h.a}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* closing */}
      <section className="gutter max-w-[1400px] mx-auto">
        <div className="rounded-[24px] border-[1.5px] border-ink bg-signal text-white px-6 py-14 sm:px-16 sm:py-20 grid md:grid-cols-[1fr_auto] gap-10 items-end relative overflow-hidden" style={{ boxShadow: '6px 6px 0 var(--ink)' }}>
          <svg className="absolute -right-16 -top-16 w-[360px] sm:w-[440px] opacity-[0.18] pointer-events-none" viewBox="0 0 48 48" aria-hidden="true">
            <g fill="none" stroke="white" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round"><path d="M14 7v34" /><path d="M14 7h11a8 8 0 0 1 0 16H14" /><path d="M14 23h13a9 9 0 0 1 0 18H14" /><circle cx={33} cy={15} r={3.6} /></g>
          </svg>
          <div className="relative">
            <div className="font-mono text-sm opacity-85 mb-5">$ git commit -m "day one"</div>
            <h2 className="font-display font-extrabold text-[clamp(2.3rem,5.5vw,5rem)] leading-[0.95] tracking-[-0.04em] max-w-[14ch]">Your first commit is four minutes away.</h2>
            <p className="mt-6 font-mono text-xs opacity-85">BossGit is designed, developed and owned by K S Pankaj.</p>
          </div>
          <Link to={first} className="relative inline-flex items-center gap-3 bg-white text-[#14213d] border-[1.5px] border-[#14213d] px-7 py-4 rounded-full text-lg font-semibold hover:bg-[#14213d] hover:text-white transition-colors w-fit" style={{ boxShadow: '3px 3px 0 #14213d' }}>Begin →</Link>
        </div>
      </section>
    </div>
  )
}

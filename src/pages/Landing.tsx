import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lab } from '../engine/lab'
import { useSnapshot, Areas } from '../components/LabPanel'
import Terminal from '../components/Terminal'
import GitGraph from '../components/GitGraph'
import CourseMap from '../components/CourseMap'
import { Mark } from '../components/Logo'
import { modules, allLessons, missionCount, plannedCount } from '../content'

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
    <div ref={box} className="rounded-[20px] bg-card border border-line shadow-[0_30px_80px_-40px_rgba(31,27,24,0.45)] overflow-hidden">
      <div className="flex items-center gap-2 px-4 h-10 border-b border-line">
        <span className="w-2.5 h-2.5 rounded-full bg-signal" />
        <span className="w-2.5 h-2.5 rounded-full bg-ochre" />
        <span className="w-2.5 h-2.5 rounded-full bg-moss" />
        <span className="ml-3 font-mono text-[11px] text-mute truncate">~/project · real Git, running in this tab</span>
        {phase === 'yours' && (
          <button onClick={async () => { await lab.reset(['mkdir project', 'cd project']); play() }} className="ml-auto font-mono text-[11px] text-mute hover:text-ink">replay</button>
        )}
      </div>
      <div className="px-2 pt-2 min-h-[176px]">{snap && <GitGraph snap={snap} compact />}</div>
      {snap?.repo && <div className="px-3 pb-3"><Areas snap={snap} /></div>}
      <Terminal lab={lab} height={230} />
      <div className="px-4 py-2.5 text-[13px] border-t border-line flex items-center gap-2 min-h-[42px]">
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

const STEPS = [
  { n: '01', t: 'Read', d: 'Short lessons in plain English, with stories, pictures and facts. No jargon without an explanation.', code: '# a branch is just a name\n# pointing at a commit' },
  { n: '02', t: 'Try', d: 'Click any command in a lesson and it runs in the lab beside you. Watch the graph change.', code: '$ git switch -c idea\nSwitched to a new branch' },
  { n: '03', t: 'Prove', d: 'Missions give you a goal. BossGit reads your real repository and tells you what is right.', code: '✓ A branch called idea exists\n✓ idea is merged into main' },
  { n: '04', t: 'Fight', d: 'Every module ends with a boss: a broken repository only real skill can fix.', code: 'CONFLICT (content):\nMerge conflict in app.js' },
]

export default function Landing() {
  const written = allLessons.length
  return (
    <div>
      {/* hero */}
      <section className="gutter max-w-[1400px] mx-auto pt-12 sm:pt-20 pb-20 grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-14 items-center">
        <div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex items-center gap-3 mb-8">
            <span className="text-ink"><Mark size={44} animated /></span>
            <span className="eyebrow">A free course · Git and GitHub · zero to mastery</span>
          </motion.div>
          <h1 className="font-display font-extrabold tracking-[-0.045em] leading-[0.92] text-[clamp(3rem,7.6vw,7rem)]">
            <motion.span className="block" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>Every expert</motion.span>
            <motion.span className="block" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>was once afraid</motion.span>
            <motion.span className="block" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
              of <span className="font-serif italic font-normal tracking-[-0.02em] relative whitespace-nowrap">
                git rebase.
                <svg className="absolute left-0 -bottom-2 w-full h-4" viewBox="0 0 300 16" preserveAspectRatio="none" aria-hidden="true">
                  <motion.path d="M2 10 C 60 2, 120 14, 180 7 S 270 4, 298 9" fill="none" stroke="var(--signal)" strokeWidth="4" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 0.9, ease: 'easeInOut' }} />
                </svg>
              </span>
            </motion.span>
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} className="mt-10 font-serif text-[1.35rem] leading-relaxed text-ink-2 max-w-[34rem]">
            BossGit takes you from your very first folder to Git's internals. Real commands, a real repository, running right here in your browser. No account. No install. Free forever.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }} className="mt-9 flex flex-wrap items-center gap-3">
            <Link to={allLessons[0] ? `/learn/${allLessons[0].moduleId}/${allLessons[0].slug}` : '/learn'} className="group inline-flex items-center gap-3 bg-ink text-paper pl-6 pr-5 py-3.5 rounded-full text-[17px] font-semibold hover:bg-signal transition-colors">
              Start lesson one
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link to="/learn" className="inline-flex items-center px-6 py-3.5 rounded-full text-[17px] border border-line hover:border-ink transition">See the whole course</Link>
          </motion.div>
          <p className="mt-6 font-mono text-xs text-mute">Lesson one takes four minutes. You only need a browser.</p>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }} className="min-w-0">
          <HeroLab />
        </motion.div>
      </section>

      {/* numbers strip */}
      <section className="border-y border-line">
        <div className="gutter max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4">
          {[
            [String(modules.length), 'modules, from mkdir to internals'],
            [String(written), `lessons written, ${plannedCount} more on the way`],
            [String(missionCount), 'missions checked against real Git'],
            ['0', 'accounts, installs or fees'],
          ].map(([n, l], i) => (
            <div key={l} className={`py-8 md:py-10 pr-6 ${i % 2 ? 'pl-6 border-l border-line' : ''} ${i >= 2 ? 'border-t md:border-t-0 border-line' : ''} ${i === 2 ? 'md:pl-6 md:border-l' : ''}`}>
              <div className="font-display font-extrabold text-[clamp(2.4rem,5vw,4rem)] leading-none tracking-tight tabular-nums">{n}</div>
              <div className="mt-2 text-ink-2 text-[15px]">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section className="gutter max-w-[1400px] mx-auto py-24">
        <div className="grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)] gap-12">
          <div>
            <div className="eyebrow mb-4">How a lesson works</div>
            <h2 className="font-display font-bold text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.02] tracking-[-0.03em]">You learn Git by <span className="font-serif italic font-normal">doing</span> Git.</h2>
          </div>
          <ol className="grid sm:grid-cols-2 gap-px bg-line rounded-2xl overflow-hidden border border-line">
            {STEPS.map(s => (
              <li key={s.n} className="bg-paper p-7 flex flex-col gap-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-sm text-signal">{s.n}</span>
                  <h3 className="text-2xl font-bold tracking-tight">{s.t}</h3>
                </div>
                <p className="font-serif text-[1.1rem] leading-relaxed text-ink-2">{s.d}</p>
                <pre className="mt-auto font-mono text-[12.5px] leading-relaxed bg-[#1c1916] text-[#e8e1d7] rounded-lg px-4 py-3 whitespace-pre-wrap">{s.code}</pre>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* course map on ink */}
      <section className="bg-[#1c1916] text-[#efe8de]">
        <div className="gutter max-w-[1400px] mx-auto py-24">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_auto] gap-6 items-end mb-12">
            <div>
              <div className="font-mono text-xs tracking-[0.14em] uppercase text-white/50 mb-4">The route</div>
              <h2 className="font-display font-bold text-[clamp(2rem,4.4vw,3.8rem)] leading-[1] tracking-[-0.035em] max-w-[18ch]">One line from <span className="font-mono font-normal text-[0.8em] text-[#e8664a]">mkdir</span> to mastery.</h2>
            </div>
            <Link to="/learn" className="inline-flex px-5 py-3 rounded-full bg-[#efe8de] text-[#1c1916] font-semibold hover:bg-white transition w-fit">Open the course</Link>
          </div>
          <CourseMap inverted />
        </div>
      </section>

      {/* the hard things */}
      <section className="gutter max-w-[1400px] mx-auto py-24">
        <div className="eyebrow mb-4">The parts nobody explains</div>
        <h2 className="font-display font-bold text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.02] tracking-[-0.03em] max-w-[22ch] mb-12">Plain answers to the questions that make people quit.</h2>
        <div className="grid md:grid-cols-2 gap-x-12">
          {HARD_THINGS.map((h, i) => (
            <Link key={h.q} to={h.to} className="group border-t border-line py-8 grid grid-cols-[2.5rem_1fr] gap-4">
              <span className="font-mono text-sm text-mute pt-2">{String(i + 1).padStart(2, '0')}</span>
              <span>
                <span className="block text-[1.6rem] font-bold tracking-tight leading-tight group-hover:text-signal transition-colors">{h.q}</span>
                <span className="block mt-3 font-serif text-[1.15rem] leading-relaxed text-ink-2">{h.a}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* closing */}
      <section className="gutter max-w-[1400px] mx-auto">
        <div className="rounded-[28px] bg-signal text-white px-8 py-16 sm:px-16 sm:py-20 grid md:grid-cols-[1fr_auto] gap-10 items-end relative overflow-hidden">
          <svg className="absolute -right-10 -top-10 w-[420px] opacity-[0.13] pointer-events-none" viewBox="0 0 48 48" aria-hidden="true">
            <g fill="none" stroke="white" strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round"><path d="M15 9v30" /><path d="M15 9h10a7.5 7.5 0 0 1 0 15H15" /><path d="M15 24h12a7.5 7.5 0 0 1 0 15H15" /></g>
          </svg>
          <div className="relative">
            <div className="font-mono text-sm opacity-80 mb-5">$ git commit -m "day one"</div>
            <h2 className="font-display font-extrabold text-[clamp(2.4rem,5.5vw,5rem)] leading-[0.95] tracking-[-0.04em] max-w-[14ch]">Your first commit is four minutes away.</h2>
          </div>
          <Link to="/learn" className="relative inline-flex items-center gap-3 bg-white text-[#1c1916] px-7 py-4 rounded-full text-lg font-semibold hover:bg-[#1c1916] hover:text-white transition-colors w-fit">Begin →</Link>
        </div>
      </section>
    </div>
  )
}

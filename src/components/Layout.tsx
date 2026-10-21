import { NavLink, Link, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Wordmark } from './Logo'
import { useProgress, streak, level } from '../store/progress'

const NAV = [
  { to: '/learn', label: 'Course' },
  { to: '/playground', label: 'Playground' },
  { to: '/cheatsheet', label: 'Cheat sheet' },
  { to: '/rescue', label: 'Rescue' },
]

export function ThemeToggle() {
  const [theme, setTheme] = useState<string | null>(() => { try { return localStorage.getItem('bossgit-theme') } catch { return null } })
  useEffect(() => {
    if (theme) document.documentElement.dataset.theme = theme
    else delete document.documentElement.dataset.theme
    try { theme ? localStorage.setItem('bossgit-theme', theme) : localStorage.removeItem('bossgit-theme') } catch {}
  }, [theme])
  const dark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  return (
    <button onClick={() => setTheme(dark ? 'light' : 'dark')} className="w-9 h-9 grid place-items-center rounded-full hover:bg-paper-2 text-ink-2" aria-label={dark ? 'Use light theme' : 'Use dark theme'}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        {dark ? <><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></> : <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />}
      </svg>
    </button>
  )
}

export default function Layout() {
  const p = useProgress()
  const s = streak(p)
  const lv = level(p.xp)
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  useEffect(() => { window.scrollTo(0, 0); setOpen(false) }, [pathname])
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky z-30 bg-paper/90 backdrop-blur-md border-b border-line" style={{ top: 'env(safe-area-inset-top, 0px)' }}>
        <div className="gutter max-w-[1400px] mx-auto h-16 flex items-center gap-6">
          <Link to="/" className="shrink-0" aria-label="BossGit home"><Wordmark size={28} /></Link>
          <nav className="hidden md:flex items-center gap-1 text-[15px]">
            {NAV.map(n => (
              <NavLink key={n.to} to={n.to} className={({ isActive }) => `px-3 py-1.5 rounded-full transition ${isActive ? 'bg-ink text-paper' : 'text-ink-2 hover:bg-paper-2'}`}>{n.label}</NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/me" className="hidden sm:flex items-center gap-3 pl-3 pr-1.5 py-1 rounded-full border border-line hover:border-ink-2 transition text-sm">
              <span className="font-mono text-xs text-mute">LV {lv.level}</span>
              <span className="font-semibold">{lv.rank}</span>
              <span className={`font-mono text-xs px-2 py-0.5 rounded-full ${s ? 'bg-signal text-paper' : 'bg-paper-2 text-mute'}`}>{s} day{s === 1 ? '' : 's'}</span>
            </Link>
            <ThemeToggle />
            <button className="md:hidden w-9 h-9 grid place-items-center rounded-full hover:bg-paper-2" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
              <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 8h16M4 16h16'} /></svg>
            </button>
          </div>
        </div>
        {open && (
          <nav className="md:hidden gutter pb-4 flex flex-col gap-1 text-lg">
            {[...NAV, { to: '/me', label: 'My progress' }].map(n => <NavLink key={n.to} to={n.to} className="py-2 border-b border-line">{n.label}</NavLink>)}
          </nav>
        )}
      </header>
      <main className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  )
}

function Footer() {
  return (
    <footer className="border-t border-line mt-24">
      <div className="gutter max-w-[1400px] mx-auto py-12 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-3">
          <Wordmark size={26} />
          <p className="font-serif text-ink-2 max-w-sm">A free course for anyone who wants to stop being scared of Git. Made in the open, one commit a day.</p>
        </div>
        <FooterCol title="Learn" links={[['/learn', 'The course'], ['/playground', 'Playground'], ['/cheatsheet', 'Cheat sheet'], ['/rescue', 'I broke something']]} />
        <FooterCol title="You" links={[['/me', 'Progress and backup'], ['/learn', 'Continue']]} />
        <div className="space-y-2 text-sm">
          <div className="eyebrow">Source</div>
          <a className="block text-ink-2 hover:text-signal" href="https://github.com/pankqx/BossGit" target="_blank" rel="noreferrer">github.com/pankqx/BossGit</a>
          <a className="block text-ink-2 hover:text-signal" href="https://github.com/pankqx/BossGit/blob/main/HOW-TO-ADD-A-LESSON.md" target="_blank" rel="noreferrer">Write a lesson</a>
        </div>
      </div>
      <div className="gutter max-w-[1400px] mx-auto pb-10 flex flex-wrap gap-x-6 gap-y-2 justify-between text-xs font-mono text-mute">
        <span>Your progress stays in this browser. No account, no tracking.</span>
        <span>git commit -m "keep going"</span>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="space-y-2 text-sm">
      <div className="eyebrow">{title}</div>
      {links.map(([to, label]) => <Link key={to + label} to={to} className="block text-ink-2 hover:text-signal">{label}</Link>)}
    </div>
  )
}

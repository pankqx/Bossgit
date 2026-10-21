import { useMemo, useState } from 'react'
import { CHEATSHEET } from '../content/cheatsheet'

export default function Cheatsheet() {
  const [q, setQ] = useState('')
  const [copied, setCopied] = useState('')
  const groups = useMemo(() => {
    const s = q.toLowerCase().trim()
    return CHEATSHEET.map(g => ({ ...g, items: g.items.filter(([c, d]) => !s || c.toLowerCase().includes(s) || d.toLowerCase().includes(s)) })).filter(g => g.items.length)
  }, [q])
  const copy = (c: string) => { navigator.clipboard?.writeText(c).then(() => { setCopied(c); setTimeout(() => setCopied(''), 1200) }).catch(() => {}) }
  return (
    <div className="gutter max-w-[1200px] mx-auto pt-14">
      <div className="eyebrow mb-3">Cheat sheet</div>
      <h1 className="font-display font-extrabold text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.95] tracking-[-0.04em]">Every command, <span className="font-serif italic font-normal">in plain words</span>.</h1>
      <label className="mt-8 flex items-center gap-3 border-b-2 border-ink pb-2 max-w-xl">
        <span className="font-mono text-signal">$</span>
        <input id="cheat-search" value={q} onChange={e => setQ(e.target.value)} placeholder="search: undo, branch, push…" className="flex-1 bg-transparent outline-none font-mono text-lg placeholder:text-mute" />
      </label>
      <div className="mt-10 columns-1 md:columns-2 gap-12">
        {groups.map(g => (
          <section key={g.group} className="break-inside-avoid mb-10">
            <h2 className="text-2xl font-bold tracking-tight mb-3">{g.group}</h2>
            <ul className="border-t border-line">
              {g.items.map(([c, d]) => (
                <li key={c} className="border-b border-line py-3">
                  <button onClick={() => copy(c)} className="font-mono text-[14px] text-left hover:text-signal break-all" title="Copy">{c}{copied === c && <span className="ml-2 text-moss text-xs">copied</span>}</button>
                  <p className="font-serif text-ink-2 mt-0.5">{d}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {!groups.length && <p className="font-serif text-xl text-ink-2">Nothing matches "{q}".</p>}
      </div>
    </div>
  )
}

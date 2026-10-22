import { useState } from 'react'
import { RESCUE } from '../content/rescue'

export default function Rescue() {
  const [path, setPath] = useState<string[]>(['start'])
  const id = path[path.length - 1]
  const node = RESCUE[id]
  return (
    <div className="gutter max-w-[900px] mx-auto pt-14">
      <div className="eyebrow mb-3">Rescue</div>
      <h1 className="font-display font-extrabold text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.95] tracking-[-0.04em]">Breathe. <span className="font-serif italic font-normal">Git almost never loses anything.</span></h1>
      <p className="mt-5 font-serif text-xl text-ink-2">Answer a few questions and get the exact commands. Try them in the playground first if you are nervous.</p>
      <ol className="mt-10 flex flex-wrap gap-2 font-mono text-xs">
        {path.map((p, i) => {
          const n = RESCUE[p]
          return (
            <li key={p + i}>
              <button onClick={() => setPath(path.slice(0, i + 1))} className={`px-3 py-1 rounded-full border ${i === path.length - 1 ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink'}`}>{'q' in n ? (i ? n.q : 'Start') : n.title}</button>
            </li>
          )
        })}
      </ol>
      <div className="mt-8">
        {'q' in node ? (
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-6">{node.q}</h2>
            <div className="grid gap-2">
              {node.choices.map(([label, next]) => (
                <button key={next} onClick={() => setPath([...path, next])} className="group text-left flex items-center justify-between gap-4 border border-line rounded-xl px-5 py-4 bg-card hover:border-ink transition">
                  <span className="text-lg">{label}</span><span className="text-mute group-hover:text-signal group-hover:translate-x-1 transition">→</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-6">{node.title}</h2>
            <pre className="font-mono text-[15px] leading-relaxed bg-[#1c1916] text-[#e8e1d7] rounded-xl p-5 overflow-x-auto">{node.steps.map(s => (s.startsWith('#') ? s : '$ ' + s)).join('\n')}</pre>
            {node.note && <p className="mt-5 font-serif text-lg text-ink-2 border-l-[3px] border-signal pl-4">{node.note}</p>}
            <button onClick={() => setPath(['start'])} className="mt-8 px-5 py-2.5 rounded-full border border-line hover:border-ink">Start over</button>
          </div>
        )}
      </div>
    </div>
  )
}

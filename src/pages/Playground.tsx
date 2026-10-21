import { useMemo, useState } from 'react'
import { Lab } from '../engine/lab'
import { useSnapshot, Areas } from '../components/LabPanel'
import Terminal from '../components/Terminal'
import GitGraph from '../components/GitGraph'

const SCENES: { name: string; about: string; setup: string[] }[] = [
  { name: 'Empty folder', about: 'A folder called project with nothing in it. Start with git init.', setup: ['mkdir project', 'cd project'] },
  { name: 'Small history', about: 'Three commits on main and a feature branch.', setup: ['mkdir project', 'cd project', 'git init', 'echo "# Shop" > README.md', 'git add . && git commit -m "Start the shop"', 'echo "apples" > stock.txt', 'git add . && git commit -m "Add stock list"', 'echo "pears" >> stock.txt && git commit -am "Add pears"', 'git switch -c discount', 'echo "10% off" > sale.txt', 'git add . && git commit -m "Plan a sale"', 'git switch main'] },
  { name: 'Merge conflict', about: 'Two branches changed the same line. Merge them and fix the conflict.', setup: ['mkdir project', 'cd project', 'git init', 'echo "Price: 10" > price.txt', 'git add . && git commit -m "Set price"', 'git switch -c cheaper', 'echo "Price: 8" > price.txt', 'git commit -am "Lower the price"', 'git switch main', 'echo "Price: 12" > price.txt', 'git commit -am "Raise the price"'] },
  { name: 'With GitHub', about: 'A repository pushed to a pretend GitHub, and a teammate who just pushed new work.', setup: ['mkdir project', 'cd project', 'git init', 'echo "# Team app" > README.md', 'git add . && git commit -m "First commit"', 'git remote add origin https://github.com/you/team-app.git', 'git push -u origin main', 'bossgit teammate https://github.com/you/team-app.git notes.txt Sam was here'] },
]

export default function Playground() {
  const lab = useMemo(() => new Lab('playground', SCENES[0].setup, true), [])
  const snap = useSnapshot(lab)
  const [scene, setScene] = useState<string | null>(null)
  const load = async (i: number) => { setScene(SCENES[i].name); await lab.reset(SCENES[i].setup) }
  return (
    <div className="gutter max-w-[1500px] mx-auto pt-12">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_auto] gap-6 items-end pb-8 border-b border-line">
        <div>
          <div className="eyebrow mb-3">Playground</div>
          <h1 className="font-display font-extrabold text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.95] tracking-[-0.04em]">Break things. <span className="font-serif italic font-normal">Nothing here is real.</span></h1>
          <p className="mt-4 font-serif text-lg text-ink-2 max-w-2xl">A real Git repository that lives only in this browser tab. It stays here when you reload. Type <code className="font-mono text-base">help</code> or <code className="font-mono text-base">git help</code> to see what you can do.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {SCENES.map((s, i) => (
            <button key={s.name} onClick={() => load(i)} title={s.about} className={`px-4 py-2 rounded-full text-sm border transition ${scene === s.name ? 'bg-ink text-paper border-ink' : 'border-line hover:border-ink'}`}>{s.name}</button>
          ))}
        </div>
      </div>
      {scene && <p className="mt-4 text-sm text-ink-2">{SCENES.find(s => s.name === scene)?.about}</p>}
      <div className="mt-6 grid xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6">
        <div className="flex flex-col gap-4 min-w-0">
          <div className="rounded-2xl border border-line bg-card min-h-[300px] p-2">{snap && <GitGraph snap={snap} />}</div>
          {snap?.repo && <Areas snap={snap} />}
        </div>
        <Terminal lab={lab} height={520} welcome={'\x1b[2mWelcome to the BossGit playground. Your repository is saved in this browser.\x1b[0m'} />
      </div>
    </div>
  )
}

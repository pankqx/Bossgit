// Rebuilds "The course" and "Practice problems" sections of ROADMAP.md from the content folders.
// Run it with: npm run roadmap
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const field = (src, key) => src.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1].trim()
let written = 0, planned = 0
const out = []
for (const mod of readdirSync('content').filter(d => /^\d\d-/.test(d)).sort()) {
  const meta = readFileSync(join('content', mod, 'module.md'), 'utf8')
  out.push(`### M${mod.slice(0, 2)} · ${field(meta, 'title')} (${field(meta, 'track')})`, '')
  for (const f of readdirSync(join('content', mod)).filter(f => f.endsWith('.md') && f !== 'module.md').sort()) {
    out.push(`- ✅ ${field(readFileSync(join('content', mod, f), 'utf8'), 'title')}`); written++
  }
  for (const l of (meta.split(/^## Planned lessons\s*$/m)[1] ?? '').split('\n').filter(l => l.startsWith('- '))) {
    out.push(`- [ ] ${l.slice(2)}`); planned++
  }
  out.push('')
}
const probs = existsSync('problems') ? readdirSync('problems').filter(f => f.endsWith('.md')) : []
const count = d => probs.filter(f => field(readFileSync(join('problems', f), 'utf8'), 'difficulty') === d).length

const course = `## The course

Lessons marked ✅ are written. The rest are planned: each one is listed in its module's \`module.md\` under **Planned lessons**. When you write one, remove it from that list.

**${written} lessons written, ${planned} planned.**

${out.join('\n')}
## Practice problems

**${probs.length} problems: ${count('Easy')} easy, ${count('Medium')} medium, ${count('Hard')} hard.** Aim for 100. Ideas still to write:

- [ ] Resolve a conflict in two files at once
- [ ] Rebase a branch that has a merge commit in it
- [ ] Revert a revert
- [ ] Find which commit deleted a line (log -S)
- [ ] Recover a dropped stash
- [ ] Fix an author name and email on the last three commits
- [ ] Move a single file's history into a new branch
- [ ] Undo a merge that was already pushed
- [ ] Rebuild main after someone force pushed over it
- [ ] Clean a repository of untracked junk safely
`
const old = readFileSync('ROADMAP.md', 'utf8')
const start = old.indexOf('## The course'), end = old.indexOf('## Features to build')
writeFileSync('ROADMAP.md', old.slice(0, start) + course + '\n' + old.slice(end))
console.log(`ROADMAP.md updated: ${written} lessons written, ${planned} planned, ${probs.length} problems.`)

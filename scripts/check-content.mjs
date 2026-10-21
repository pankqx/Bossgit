// Checks every lesson file for common mistakes. Run it with: npm run check
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const root = 'content'
const CHECKS = ['repo', 'norepo', 'cwd', 'branch', 'nobranch', 'head', 'detached', 'attached', 'commits', 'exactcommits', 'clean', 'staged', 'notstaged', 'modified', 'untracked', 'tracked', 'nottracked', 'branchhas', 'file', 'nofile', 'dir', 'contains', 'lacks', 'message', 'tag', 'merged', 'parents', 'linear', 'nooperation', 'stash', 'remote', 'pushed', 'config', 'same', 'run']
const problems = []
let lessons = 0

for (const mod of readdirSync(root).sort()) {
  const dir = join(root, mod)
  if (!/^\d\d-/.test(mod)) { problems.push(`${dir}: module folders must start with two digits, like 04-history`); continue }
  if (!existsSync(join(dir, 'module.md'))) problems.push(`${dir}: missing module.md`)
  for (const file of readdirSync(dir).filter(f => f.endsWith('.md') && f !== 'module.md')) {
    const path = join(dir, file)
    const src = readFileSync(path, 'utf8')
    lessons++
    if (!/^\d\d-[a-z0-9-]+\.md$/.test(file)) problems.push(`${path}: lesson file names look like 01-git-log.md (two digits, a dash, lowercase words)`)
    const fm = src.match(/^---\n([\s\S]*?)\n---/)
    if (!fm) { problems.push(`${path}: the file must start with --- title: ... --- (see HOW-TO-ADD-A-LESSON.md)`); continue }
    if (!/^title:\s*\S/m.test(fm[1])) problems.push(`${path}: add a title: line at the top`)
    const fences = src.match(/^```/gm) ?? []
    if (fences.length % 2) problems.push(`${path}: a \`\`\` block is not closed`)
    for (const [, body] of src.matchAll(/^```quiz\n([\s\S]*?)^```/gm)) {
      for (const q of body.split(/^q:/m).slice(1)) {
        const right = (q.match(/^- \[x\]/gim) ?? []).length
        if (right !== 1) problems.push(`${path}: each quiz question needs exactly one answer marked - [x] ("${q.split('\n')[0].trim().slice(0, 40)}…")`)
      }
    }
    for (const [, body] of src.matchAll(/^```mission\n([\s\S]*?)^```/gm)) {
      if (!/^goal:/m.test(body)) problems.push(`${path}: a mission needs a goal: line`)
      if (!/^check:/m.test(body)) problems.push(`${path}: a mission needs at least one check: line`)
      for (const [, c] of body.matchAll(/^check:\s*(\S+)/gm)) if (!CHECKS.includes(c)) problems.push(`${path}: unknown check "${c}"`)
    }
  }
}

if (problems.length) {
  console.error(`Found ${problems.length} problem(s):\n\n` + problems.map(p => '  ✗ ' + p).join('\n'))
  process.exit(1)
}
console.log(`All good: ${lessons} lessons checked.`)

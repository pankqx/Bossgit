// Plays every mission for real: setup, checks must FAIL, then the answer, checks must PASS.
// Lesson missions keep their answer in hidden `solve:` lines. Problems use their solution block.
// Run it with: npm run verify
import { build } from 'esbuild'
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { Volume, createFsFromVolume } from 'memfs'

const out = 'node_modules/.cache/bossgit-verify.mjs'
await build({
  stdin: { contents: "export { Shell } from './src/engine/shell'; export { runChecks } from './src/engine/checker'", resolveDir: '.', loader: 'ts' },
  bundle: true, platform: 'node', format: 'esm', outfile: out, logLevel: 'error',
  banner: { js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);" },
})
const { Shell, runChecks } = await import('../' + out)

const items = []
const blocks = src => [...src.matchAll(/^```mission\n([\s\S]*?)^```/gm)].map(m => m[1])
const lines = (body, key) => body.split('\n').map(l => l.trim()).filter(l => l.startsWith(key + ':')).map(l => l.slice(key.length + 1).trim())
for (const mod of readdirSync('content').sort()) for (const f of readdirSync(join('content', mod)).filter(f => f !== 'module.md').sort()) {
  const path = join('content', mod, f), src = readFileSync(path, 'utf8')
  const fmSetup = (src.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '').match(/^setup:\s*(.*)$/m)?.[1]
  blocks(src).forEach((b, i) => items.push({ name: `${path} #${i + 1}`, setup: lines(b, 'setup').length ? lines(b, 'setup') : (fmSetup ? [fmSetup] : []), checks: lines(b, 'check'), solve: lines(b, 'solve') }))
}
if (existsSync('problems')) for (const f of readdirSync('problems').sort()) {
  const src = readFileSync(join('problems', f), 'utf8'), b = blocks(src)[0] ?? ''
  const sol = (src.match(/^```solution\n([\s\S]*?)^```/m)?.[1] ?? '').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  items.push({ name: join('problems', f), setup: lines(b, 'setup'), checks: lines(b, 'check'), solve: sol })
}

let bad = 0, skipped = 0
for (const it of items) {
  if (!it.solve.length) { skipped++; console.log('  - no solve: lines  ' + it.name); continue }
  const sh = new Shell(createFsFromVolume(new Volume()))
  await sh.boot(); await sh.run('bossgit identity'); await sh.script(it.setup); sh.history = []
  const before = await runChecks(sh, it.checks)
  if (before.every(r => r.ok)) { bad++; console.log('  ✗ already solved before the answer: ' + it.name); continue }
  let log = ''
  for (const l of it.solve) log += `$ ${l}\n` + (await sh.run(l)) 
  const after = await runChecks(sh, it.checks)
  const failed = after.filter(r => !r.ok)
  if (failed.length) { bad++; console.log('  ✗ ' + it.name + '\n      failed: ' + failed.map(r => r.check).join(' | ') + '\n' + log.replace(/\x1b\[[0-9;]*m/g, '').split('\n').slice(-12).map(l => '      ' + l).join('\n')) }
}
console.log(`${items.length - skipped - bad} missions pass, ${bad} broken, ${skipped} without an answer.`)
process.exit(bad ? 1 : 0)

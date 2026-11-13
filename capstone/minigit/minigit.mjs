#!/usr/bin/env node
// minigit: a tiny Git written from scratch, for the BossGit capstone.
// It writes REAL Git objects, so the real `git` can read its repositories.
// Commands: init, hash-object [-w], cat-file (-t|-p), add, write-tree, commit -m, log, branch, switch, status
import { createHash } from 'node:crypto'
import { deflateSync, inflateSync } from 'node:zlib'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = findRoot(process.cwd())
const GIT = ROOT && path.join(ROOT, '.git')

function findRoot(dir) {
  for (let d = dir; ; d = path.dirname(d)) {
    if (fs.existsSync(path.join(d, '.git'))) return d
    if (path.dirname(d) === d) return null
  }
}
function need() { if (!GIT) die('fatal: not a minigit repository (run: minigit init)') }
function die(msg) { console.error(msg); process.exit(1) }

/* ---------- objects: "type size\0content", hashed with SHA-1, stored zlib-compressed ---------- */

export function hashObject(type, body, write = false) {
  const data = Buffer.concat([Buffer.from(`${type} ${body.length}\0`), body])
  const id = createHash('sha1').update(data).digest('hex')
  if (write) {
    const file = path.join(GIT, 'objects', id.slice(0, 2), id.slice(2))
    if (!fs.existsSync(file)) {
      fs.mkdirSync(path.dirname(file), { recursive: true })
      fs.writeFileSync(file, deflateSync(data))
    }
  }
  return id
}

export function readObject(id) {
  const file = path.join(GIT, 'objects', id.slice(0, 2), id.slice(2))
  if (!fs.existsSync(file)) die(`fatal: object ${id} not found (packed objects are not supported by minigit)`)
  const data = inflateSync(fs.readFileSync(file))
  const nul = data.indexOf(0)
  const [type] = data.subarray(0, nul).toString().split(' ')
  return { type, body: data.subarray(nul + 1) }
}

/* ---------- trees: entries "mode name\0<20 raw bytes>", sorted by name ---------- */

function parseTree(body) {
  const out = []
  for (let i = 0; i < body.length;) {
    const sp = body.indexOf(32, i), nul = body.indexOf(0, sp)
    out.push({ mode: body.subarray(i, sp).toString(), name: body.subarray(sp + 1, nul).toString(), id: body.subarray(nul + 1, nul + 21).toString('hex') })
    i = nul + 21
  }
  return out
}

// Git sorts tree entries by name, treating folders as if their name ended with "/"
const sortKey = e => e.mode === '40000' ? e.name + '/' : e.name

function writeTree(files) {            // files: Map("src/app.js" -> blob id)
  const here = new Map(), subdirs = new Map()
  for (const [p, id] of files) {
    const [first, ...rest] = p.split('/')
    if (rest.length) {
      if (!subdirs.has(first)) subdirs.set(first, new Map())
      subdirs.get(first).set(rest.join('/'), id)
    } else here.set(first, id)
  }
  const entries = [...[...here].map(([name, id]) => ({ mode: '100644', name, id })),
                   ...[...subdirs].map(([name, m]) => ({ mode: '40000', name, id: writeTree(m) }))]
  entries.sort((a, b) => (sortKey(a) < sortKey(b) ? -1 : 1))
  const body = Buffer.concat(entries.map(e => Buffer.concat([Buffer.from(`${e.mode} ${e.name}\0`), Buffer.from(e.id, 'hex')])))
  return hashObject('tree', body, true)
}

function treeFiles(treeId, prefix = '', out = new Map()) {
  for (const e of parseTree(readObject(treeId).body)) {
    if (e.mode === '40000') treeFiles(e.id, prefix + e.name + '/', out)
    else out.set(prefix + e.name, e.id)
  }
  return out
}

/* ---------- commits ---------- */

function parseCommit(body) {
  const text = body.toString(), split = text.indexOf('\n\n')
  const headers = text.slice(0, split).split('\n'), c = { parents: [], message: text.slice(split + 2) }
  for (const h of headers) {
    const [k, ...v] = h.split(' ')
    if (k === 'parent') c.parents.push(v.join(' ')); else c[k] = v.join(' ')
  }
  return c
}

function who() {
  const name = process.env.GIT_AUTHOR_NAME ?? gitConfig('user.name') ?? 'Mini Git'
  const email = process.env.GIT_AUTHOR_EMAIL ?? gitConfig('user.email') ?? 'mini@example.com'
  const now = Math.floor(Date.now() / 1000), off = -new Date().getTimezoneOffset()
  const tz = (off >= 0 ? '+' : '-') + String(Math.floor(Math.abs(off) / 60)).padStart(2, '0') + String(Math.abs(off) % 60).padStart(2, '0')
  return `${name} <${email}> ${now} ${tz}`
}
function gitConfig(key) {   // reads [user] name/email from .git/config, then ~/.gitconfig
  const [section, name] = key.split('.')
  for (const f of [path.join(GIT, 'config'), path.join(process.env.HOME ?? '', '.gitconfig')]) {
    if (!fs.existsSync(f)) continue
    let inSection = false
    for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
      const s = line.trim().match(/^\[(\S+)\]$/)
      if (s) { inSection = s[1] === section; continue }
      const kv = line.trim().match(/^(\w+)\s*=\s*(.*)$/)
      if (inSection && kv && kv[1] === name) return kv[2]
    }
  }
}

/* ---------- refs and HEAD ---------- */

const headRef = () => { const h = fs.readFileSync(path.join(GIT, 'HEAD'), 'utf8').trim(); return h.startsWith('ref: ') ? h.slice(5) : null }
function resolve(ref) {
  if (/^[0-9a-f]{40}$/.test(ref)) return ref
  for (const r of [ref, `refs/heads/${ref}`, `refs/tags/${ref}`]) {
    const f = path.join(GIT, r)
    if (fs.existsSync(f) && fs.statSync(f).isFile()) {
      const v = fs.readFileSync(f, 'utf8').trim()
      return v.startsWith('ref: ') ? resolve(v.slice(5)) : v
    }
  }
  return null
}
function updateRef(ref, id) { const f = path.join(GIT, ref); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, id + '\n') }

/* ---------- staging area: a JSON file (real Git uses a binary .git/index) ---------- */

const INDEX = () => path.join(GIT, 'minigit-index.json')
const readIndex = () => new Map(fs.existsSync(INDEX()) ? Object.entries(JSON.parse(fs.readFileSync(INDEX(), 'utf8'))) : [])
const writeIndex = m => fs.writeFileSync(INDEX(), JSON.stringify(Object.fromEntries([...m].sort())))

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git') continue
    const p = path.join(dir, e.name)
    e.isDirectory() ? walk(p, out) : out.push(path.relative(ROOT, p).split(path.sep).join('/'))
  }
  return out
}
const blobOf = (file, write) => hashObject('blob', fs.readFileSync(path.join(ROOT, file)), write)
const headFiles = () => { const c = resolve('HEAD'); return c ? treeFiles(parseCommit(readObject(c).body).tree) : new Map() }

/* ---------- commands ---------- */

const [cmd, ...args] = process.argv.slice(2)
const commands = {
  init() {
    const g = path.join(process.cwd(), '.git')
    for (const d of ['objects', 'refs/heads', 'refs/tags']) fs.mkdirSync(path.join(g, d), { recursive: true })
    fs.writeFileSync(path.join(g, 'HEAD'), 'ref: refs/heads/main\n')
    fs.writeFileSync(path.join(g, 'config'), '[core]\n\trepositoryformatversion = 0\n\tbare = false\n')
    console.log(`Initialized empty minigit repository in ${g}`)
  },
  'hash-object'() {
    need(); const file = args.find(a => a !== '-w')
    console.log(hashObject('blob', fs.readFileSync(file), args.includes('-w')))
  },
  'cat-file'() {
    need(); const [flag, rev] = args, o = readObject(resolve(rev) ?? die(`fatal: not a valid object name ${rev}`))
    if (flag === '-t') return console.log(o.type)
    if (o.type === 'tree') return parseTree(o.body).forEach(e => console.log(`${e.mode.padStart(6, '0')} ${e.mode === '40000' ? 'tree' : 'blob'} ${e.id}\t${e.name}`))
    process.stdout.write(o.body)
  },
  add() {
    need(); const index = readIndex()
    const files = args.includes('.') ? walk(ROOT) : args.map(a => path.relative(ROOT, path.resolve(a)).split(path.sep).join('/'))
    for (const f of files) fs.existsSync(path.join(ROOT, f)) ? index.set(f, blobOf(f, true)) : index.delete(f)
    writeIndex(index)
  },
  'write-tree'() { need(); console.log(writeTree(readIndex())) },
  commit() {
    need(); const m = args.indexOf('-m'); if (m < 0) die('usage: minigit commit -m "message"')
    const index = readIndex(); if (!index.size) die('nothing to commit')
    const tree = writeTree(index), parent = resolve('HEAD')
    if (parent && parseCommit(readObject(parent).body).tree === tree) die('nothing to commit, working tree clean')
    const me = who()
    const body = `tree ${tree}\n${parent ? `parent ${parent}\n` : ''}author ${me}\ncommitter ${me}\n\n${args[m + 1]}\n`
    const id = hashObject('commit', Buffer.from(body), true)
    const ref = headRef(); ref ? updateRef(ref, id) : fs.writeFileSync(path.join(GIT, 'HEAD'), id + '\n')
    console.log(`[${ref?.replace('refs/heads/', '') ?? 'detached'} ${id.slice(0, 7)}] ${args[m + 1]}`)
  },
  log() {
    need()
    for (let id = resolve(args[0] ?? 'HEAD'); id;) {
      const c = parseCommit(readObject(id).body), [, name, email, ts] = c.author.match(/^(.*) <(.*)> (\d+)/)
      console.log(`\x1b[33mcommit ${id}\x1b[0m\nAuthor: ${name} <${email}>\nDate:   ${new Date(ts * 1000).toString().slice(0, 24)}\n\n    ${c.message.trim()}\n`)
      id = c.parents[0]
    }
  },
  branch() {
    need()
    if (!args[0]) { const cur = headRef(); for (const b of fs.readdirSync(path.join(GIT, 'refs/heads'))) console.log(`${`refs/heads/${b}` === cur ? '*' : ' '} ${b}`); return }
    updateRef(`refs/heads/${args[0]}`, resolve('HEAD') ?? die('fatal: no commits yet'))
  },
  switch() {
    need(); const name = args[0], id = resolve(`refs/heads/${name}`) ?? die(`fatal: invalid reference: ${name}`)
    const target = treeFiles(parseCommit(readObject(id).body).tree)
    for (const f of headFiles().keys()) if (!target.has(f)) fs.rmSync(path.join(ROOT, f), { force: true })
    for (const [f, blob] of target) { const p = path.join(ROOT, f); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, readObject(blob).body) }
    writeIndex(target)
    fs.writeFileSync(path.join(GIT, 'HEAD'), `ref: refs/heads/${name}\n`)
    console.log(`Switched to branch '${name}'`)
  },
  status() {
    need(); const index = readIndex(), head = headFiles(), work = new Set(walk(ROOT))
    const staged = [...index].filter(([f, id]) => head.get(f) !== id).map(([f]) => f)
    const gone = [...head.keys()].filter(f => !index.has(f))
    const modified = [...index.keys()].filter(f => work.has(f) && blobOf(f, false) !== index.get(f))
    const untracked = [...work].filter(f => !index.has(f))
    console.log(`On branch ${headRef()?.replace('refs/heads/', '') ?? '(detached)'}`)
    if (staged.length || gone.length) console.log('Changes to be committed:\n' + [...staged.map(f => `\t\x1b[32m${head.has(f) ? 'modified' : 'new file'}:   ${f}\x1b[0m`), ...gone.map(f => `\t\x1b[32mdeleted:    ${f}\x1b[0m`)].join('\n'))
    if (modified.length) console.log('Changes not staged for commit:\n' + modified.map(f => `\t\x1b[31mmodified:   ${f}\x1b[0m`).join('\n'))
    if (untracked.length) console.log('Untracked files:\n' + untracked.map(f => `\t\x1b[31m${f}\x1b[0m`).join('\n'))
    if (!staged.length && !gone.length && !modified.length && !untracked.length) console.log('nothing to commit, working tree clean')
  },
}
if (!commands[cmd]) die(`usage: minigit <${Object.keys(commands).join(' | ')}>`)
commands[cmd]()

// BossGit's shell: a tiny Unix-like command line plus a Git command layer.
// Real Git objects come from isomorphic-git. Commands it does not have
// (rebase, cherry-pick, revert, stash, reflog, remotes on the same disk)
// are built here on top of its building blocks.
import git from 'isomorphic-git'
import { merge3, unifiedHunks } from './diff'

/* ------------------------------------------------------------------ */
/* basics                                                              */
/* ------------------------------------------------------------------ */

export const C = {
  red: (s: string) => `\x1b[31m${s}\x1b[0m`,
  green: (s: string) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
  blue: (s: string) => `\x1b[34m${s}\x1b[0m`,
  cyan: (s: string) => `\x1b[36m${s}\x1b[0m`,
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
}
export const stripAnsi = (s: string) => s.replace(/\x1b\[[0-9;]*m/g, '')

class UserError extends Error {}
const fail = (msg: string): never => { throw new UserError(msg) }

export const HOME = '/home/learner'
const GLOBAL = '/.bossgit/global.json'
const REMOTES = '/.bossgit/remotes'

type Pfs = {
  readFile(p: string, enc?: any): Promise<any>
  writeFile(p: string, d: any, enc?: any): Promise<void>
  mkdir(p: string): Promise<void>
  readdir(p: string): Promise<string[]>
  stat(p: string): Promise<{ isDirectory(): boolean; isFile(): boolean }>
  unlink(p: string): Promise<void>
  rmdir(p: string): Promise<void>
  lstat(p: string): Promise<any>
}
export type AnyFs = { promises: Pfs } & Record<string, any>

export function normalize(p: string): string {
  const parts: string[] = []
  for (const part of p.split('/')) {
    if (!part || part === '.') continue
    if (part === '..') parts.pop()
    else parts.push(part)
  }
  return '/' + parts.join('/')
}
const dirname = (p: string) => normalize(p + '/..')
const basename = (p: string) => p.split('/').filter(Boolean).pop() ?? ''
const short = (oid: string) => oid.slice(0, 7)

type Tokens = string[]
function tokenize(line: string): Tokens[] {
  // split into commands on && and ; while keeping quoted text intact
  const cmds: Tokens[] = [[]]
  let cur = '', quote = '', has = false
  const push = () => { if (has) cmds[cmds.length - 1].push(cur); cur = ''; has = false }
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (quote) {
      if (ch === quote) quote = ''
      else if (ch === '\\' && quote === '"' && i + 1 < line.length) cur += line[++i]
      else cur += ch
      continue
    }
    if (ch === '"' || ch === "'") { quote = ch; has = true; continue }
    if (ch === ' ' || ch === '\t') { push(); continue }
    if (ch === '&' && line[i + 1] === '&') { push(); cmds.push([]); i++; continue }
    if (ch === ';') { push(); cmds.push([]); continue }
    if (ch === '>') { push(); if (line[i + 1] === '>') { cmds[cmds.length - 1].push('>>'); i++ } else cmds[cmds.length - 1].push('>'); continue }
    cur += ch; has = true
  }
  if (quote) fail('bossgit: missing closing quote')
  push()
  return cmds.filter(c => c.length)
}

// simple flag reader: returns positional args and a set of flags with values
function parseArgs(args: string[], withValue: string[] = []) {
  const flags = new Map<string, string | true>()
  const pos: string[] = []
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '--') { pos.push(...args.slice(i + 1)); break }
    if (a.startsWith('--') && a.includes('=')) { const [k, v] = a.split(/=(.*)/); flags.set(k, v); continue }
    if (withValue.includes(a)) { flags.set(a, args[++i] ?? fail(`error: option '${a}' requires a value`)); continue }
    if (/^-[a-zA-Z]{2,}$/.test(a) && !withValue.includes(a)) {
      // -am "msg" style bundles
      const letters = a.slice(1).split('')
      letters.forEach((l, idx) => {
        const f = '-' + l
        if (withValue.includes(f) && idx === letters.length - 1) flags.set(f, args[++i] ?? fail(`error: switch '${l}' requires a value`))
        else flags.set(f, true)
      })
      continue
    }
    if (a.startsWith('-') && a.length > 1 && !/^-\d+$/.test(a)) { flags.set(a, true); continue }
    pos.push(a)
  }
  return { pos, flags, has: (...k: string[]) => k.some(x => flags.has(x)), get: (...k: string[]) => { for (const x of k) if (flags.has(x)) return flags.get(x) as string; return undefined } }
}

type BossState = {
  reflog: { oid: string; msg: string }[]
  stash: { msg: string; base: string; files: Record<string, string | null> }[]
  op?: { kind: 'merge' | 'cherry-pick' | 'revert' | 'rebase'; msg: string; theirs?: string; branch?: string; orig?: string; todo?: string[]; current?: string }
  conflicts: string[]
}

export type Snapshot = {
  repo: boolean
  commits: { oid: string; parents: string[]; message: string; time: number; author: string }[]
  branches: Record<string, string>
  remotes: Record<string, string>
  tags: Record<string, string>
  head: { branch?: string; oid?: string }
  op?: string
  staged: string[]
  modified: string[]
  untracked: string[]
  conflicts: string[]
  stash: number
}

/* ------------------------------------------------------------------ */
/* the shell                                                           */
/* ------------------------------------------------------------------ */

export class Shell {
  fs: AnyFs
  pfs: Pfs
  cwd = HOME
  private listeners = new Set<() => void>()
  history: string[] = []

  constructor(fs: AnyFs) {
    this.fs = fs
    this.pfs = fs.promises
  }

  /** swap in a fresh disk (used when a lab or mission resets) */
  useFs(fs: AnyFs) {
    this.fs = fs
    this.pfs = fs.promises
    this.cwd = HOME
    this.history = []
  }

  onChange(fn: () => void) { this.listeners.add(fn); return () => { this.listeners.delete(fn) } }
  private emit() { this.listeners.forEach(f => f()) }

  async boot(cwd = HOME) {
    await this.mkdirp(cwd)
    this.cwd = cwd
  }

  /** Run one line. Returns terminal output (with colours). Never throws. */
  async run(line: string): Promise<string> {
    const trimmed = line.trim()
    if (!trimmed) return ''
    this.history.push(trimmed)
    let out = ''
    try {
      for (const tokens of tokenize(trimmed)) {
        let redirect: { path: string; append: boolean } | null = null
        const ri = tokens.findIndex(t => t === '>' || t === '>>')
        if (ri >= 0) {
          const target = tokens[ri + 1] ?? fail('bossgit: syntax error: expected a file name after >')
          redirect = { path: this.abs(target), append: tokens[ri] === '>>' }
          tokens.splice(ri, 2)
        }
        const result = await this.exec(tokens)
        if (redirect) {
          const prev = redirect.append ? await this.readText(redirect.path).catch(() => '') : ''
          await this.writeText(redirect.path, prev + stripAnsi(result))
        } else out += result
      }
    } catch (e: any) {
      out += e instanceof UserError ? e.message + '\n' : C.red(`error: ${e?.message ?? e}`) + '\n'
    }
    this.emit()
    return out
  }

  /** Run several setup lines silently (used by missions). */
  async script(lines: string[]) {
    for (const l of lines) {
      const out = await this.run(l)
      if (/^(fatal|error)/m.test(stripAnsi(out))) console.warn('[bossgit setup]', l, '\n', stripAnsi(out))
    }
  }

  /* -------------------------------- files -------------------------------- */

  abs(p: string) {
    if (p === '~') return HOME
    if (p.startsWith('~/')) return normalize(HOME + p.slice(1))
    return normalize(p.startsWith('/') ? p : this.cwd + '/' + p)
  }
  async exists(p: string) { try { await this.pfs.stat(p); return true } catch { return false } }
  async isDir(p: string) { try { return (await this.pfs.stat(p)).isDirectory() } catch { return false } }
  async readText(p: string): Promise<string> { return await this.pfs.readFile(p, 'utf8') }
  async writeText(p: string, text: string) { await this.mkdirp(dirname(p)); await this.pfs.writeFile(p, text, 'utf8') }
  async mkdirp(p: string) {
    const parts = normalize(p).split('/').filter(Boolean)
    let cur = ''
    for (const part of parts) {
      cur += '/' + part
      if (!(await this.exists(cur))) await this.pfs.mkdir(cur)
    }
  }
  async rmrf(p: string) {
    if (!(await this.exists(p))) return
    if (await this.isDir(p)) {
      for (const n of await this.pfs.readdir(p)) await this.rmrf(p + '/' + n)
      await this.pfs.rmdir(p)
    } else await this.pfs.unlink(p)
  }
  async copyTree(src: string, dst: string, onlyMissing = true) {
    if (await this.isDir(src)) {
      await this.mkdirp(dst)
      for (const n of await this.pfs.readdir(src)) await this.copyTree(src + '/' + n, dst + '/' + n, onlyMissing)
    } else if (!onlyMissing || !(await this.exists(dst))) {
      await this.pfs.writeFile(dst, await this.pfs.readFile(src))
    }
  }
  /** all files below dir (repo-relative), skipping .git */
  async walkFiles(dir: string, prefix = ''): Promise<string[]> {
    const out: string[] = []
    let names: string[] = []
    try { names = await this.pfs.readdir(dir) } catch { return out }
    for (const n of names.sort()) {
      if (n === '.git') continue
      const full = dir + '/' + n
      if (await this.isDir(full)) out.push(...(await this.walkFiles(full, prefix + n + '/')))
      else out.push(prefix + n)
    }
    return out
  }

  /* -------------------------------- dispatch ----------------------------- */

  private async exec(tokens: string[]): Promise<string> {
    const [cmd, ...args] = tokens
    switch (cmd) {
      case 'pwd': return this.cwd + '\n'
      case 'cd': {
        const target = this.abs(args[0] ?? '~')
        if (!(await this.isDir(target))) fail(`cd: ${args[0]}: No such file or directory`)
        this.cwd = target
        return ''
      }
      case 'ls': return this.ls(args)
      case 'tree': return this.tree(args)
      case 'mkdir': {
        const p = parseArgs(args)
        if (!p.pos.length) fail('mkdir: missing operand')
        for (const d of p.pos) {
          const full = this.abs(d)
          if (await this.exists(full)) { if (!p.has('-p')) fail(`mkdir: cannot create directory '${d}': File exists`) }
          else if (!p.has('-p') && !(await this.isDir(dirname(full)))) fail(`mkdir: cannot create directory '${d}': No such file or directory`)
          else await this.mkdirp(full)
        }
        return ''
      }
      case 'touch': {
        if (!args.length) fail('touch: missing file operand')
        for (const f of args) { const full = this.abs(f); if (!(await this.exists(full))) await this.writeText(full, '') }
        return ''
      }
      case 'echo': {
        const p = args[0] === '-n' ? args.slice(1) : args
        return p.join(' ') + (args[0] === '-n' ? '' : '\n')
      }
      case 'cat': {
        if (!args.length) fail('cat: missing file operand')
        let out = ''
        for (const f of args) {
          const full = this.abs(f)
          if (await this.isDir(full)) fail(`cat: ${f}: Is a directory`)
          out += await this.readText(full).catch(() => fail(`cat: ${f}: No such file or directory`))
        }
        return out
      }
      case 'rm': {
        const p = parseArgs(args)
        const rec = p.has('-r', '-rf', '-fr', '-R')
        for (const f of p.pos) {
          const full = this.abs(f)
          if (!(await this.exists(full))) { if (p.has('-f', '-rf', '-fr')) continue; fail(`rm: cannot remove '${f}': No such file or directory`) }
          if ((await this.isDir(full)) && !rec) fail(`rm: cannot remove '${f}': Is a directory (use rm -r)`)
          await this.rmrf(full)
        }
        return ''
      }
      case 'mv': case 'cp': {
        const [a, b] = args
        if (!a || !b) fail(`${cmd}: missing file operand`)
        const src = this.abs(a)
        let dst = this.abs(b)
        if (!(await this.exists(src))) fail(`${cmd}: cannot stat '${a}': No such file or directory`)
        if (await this.isDir(dst)) dst = dst + '/' + basename(src)
        await this.copyTree(src, dst, false)
        if (cmd === 'mv') await this.rmrf(src)
        return ''
      }
      case 'clear': return '\x1b[2J\x1b[H'
      case 'whoami': return 'learner\n'
      case 'date': return new Date().toString() + '\n'
      case 'history': return this.history.map((h, i) => `${String(i + 1).padStart(4)}  ${h}`).join('\n') + '\n'
      case 'help': return HELP
      case 'nano': case 'vim': case 'vi': case 'code': case 'notepad':
        return C.yellow(`BossGit has no text editor inside the terminal.`) + `\nWrite to files with echo instead:\n  echo "hello" > ${args[0] ?? 'file.txt'}     (replace the file)\n  echo "more"  >> ${args[0] ?? 'file.txt'}    (add a line)\n`
      case 'git': return this.git(args)
      case 'bossgit': return this.bossgit(args)
      case 'sudo': return C.dim('Nice try. You are already the boss here.') + '\n'
      default: return fail(`${cmd}: command not found. Type ${C.cyan('help')} to see what you can use.`)
    }
  }

  private async ls(args: string[]) {
    const p = parseArgs(args)
    const all = p.has('-a', '-la', '-al')
    const target = this.abs(p.pos[0] ?? '.')
    if (!(await this.exists(target))) fail(`ls: cannot access '${p.pos[0]}': No such file or directory`)
    if (!(await this.isDir(target))) return basename(target) + '\n'
    const names = (await this.pfs.readdir(target)).filter(n => all || !n.startsWith('.')).sort()
    if (all) names.unshift('.', '..')
    const parts = await Promise.all(names.map(async n => (n === '.' || n === '..' || (await this.isDir(target + '/' + n))) ? C.blue(n + '/') : n))
    return parts.length ? parts.join('  ') + '\n' : ''
  }

  private async tree(args: string[]) {
    const root = this.abs(args.find(a => !a.startsWith('-')) ?? '.')
    const showAll = args.includes('-a')
    const lines: string[] = [C.blue(basename(root) || '/')]
    const walk = async (dir: string, pre: string, depth: number) => {
      if (depth > 6) return
      const names = (await this.pfs.readdir(dir)).filter(n => showAll || !n.startsWith('.')).sort()
      for (let i = 0; i < names.length; i++) {
        const last = i === names.length - 1
        const full = dir + '/' + names[i]
        const isD = await this.isDir(full)
        lines.push(pre + (last ? '└── ' : '├── ') + (isD ? C.blue(names[i]) : names[i]))
        if (isD) await walk(full, pre + (last ? '    ' : '│   '), depth + 1)
      }
    }
    await walk(root, '', 0)
    return lines.join('\n') + '\n'
  }

  /* -------------------------------- repo helpers ------------------------- */

  async findRepo(from = this.cwd): Promise<string | null> {
    let d = from
    while (true) {
      if (await this.isDir(d + '/.git')) return d
      if (d === '/') return null
      d = dirname(d)
    }
  }
  private async repo(): Promise<string> {
    return (await this.findRepo()) ?? fail('fatal: not a git repository (or any of the parent directories): .git\n' + C.dim('Tip: run git init first, or cd into your project folder.'))
  }
  private rel(dir: string, p: string) {
    const full = this.abs(p)
    if (full === dir) return '.'
    if (!full.startsWith(dir + '/')) fail(`fatal: '${p}' is outside repository at '${dir}'`)
    return full.slice(dir.length + 1)
  }

  private async state(dir: string): Promise<BossState> {
    try { return { reflog: [], stash: [], conflicts: [], ...JSON.parse(await this.readText(dir + '/.git/bossgit.json')) } }
    catch { return { reflog: [], stash: [], conflicts: [] } }
  }
  private async saveState(dir: string, s: BossState) { await this.writeText(dir + '/.git/bossgit.json', JSON.stringify(s)) }
  private async logHead(dir: string, msg: string) {
    const oid = await this.headOid(dir)
    if (!oid) return
    const s = await this.state(dir)
    s.reflog.unshift({ oid, msg })
    s.reflog = s.reflog.slice(0, 200)
    await this.saveState(dir, s)
  }

  private async globalConfig(): Promise<Record<string, string>> {
    try { return JSON.parse(await this.readText(GLOBAL)) } catch { return {} }
  }
  private async getConfig(dir: string | null, key: string): Promise<string | undefined> {
    if (dir) { const v = await git.getConfig({ fs: this.fs, dir, path: key }).catch(() => undefined); if (v !== undefined && v !== null) return String(v) }
    return (await this.globalConfig())[key]
  }
  private async author(dir: string) {
    const name = await this.getConfig(dir, 'user.name')
    const email = await this.getConfig(dir, 'user.email')
    if (!name || !email) fail(`Author identity unknown\n\n*** Please tell me who you are.\n\nRun\n\n  git config --global user.email "you@example.com"\n  git config --global user.name "Your Name"\n\nto set your account's default identity.`)
    const s = await this.globalConfig()
    // a steady clock: every commit is at least one second after the last one
    const now = Math.floor(Date.now() / 1000)
    const t = Math.max(now, (Number(s.__clock) || 0) + 1)
    s.__clock = String(t)
    await this.writeText(GLOBAL, JSON.stringify(s))
    return { name: name!, email: email!, timestamp: t, timezoneOffset: new Date().getTimezoneOffset() }
  }

  async headOid(dir: string): Promise<string | null> {
    try { return await git.resolveRef({ fs: this.fs, dir, ref: 'HEAD' }) } catch { return null }
  }
  /** git.commit that also moves a detached HEAD */
  private async doCommit(dir: string, o: { message: string; author: any; committer: any; parent?: string[] }) {
    const detached = await this.isDetached(dir)
    const oid = await git.commit({ fs: this.fs, dir, ...o, noUpdateBranch: detached })
    if (detached) await git.writeRef({ fs: this.fs, dir, ref: 'HEAD', value: oid, force: true })
    return oid
  }
  async branch(dir: string): Promise<string | undefined> {
    return (await git.currentBranch({ fs: this.fs, dir, fullname: false }).catch(() => undefined)) || undefined
  }
  private async isDetached(dir: string) {
    const head = await this.readText(dir + '/.git/HEAD').catch(() => '')
    return !head.startsWith('ref:')
  }

  /** resolve HEAD~2, main^, HEAD@{1}, v1.0, abc1234, origin/main … to a commit oid */
  async resolve(dir: string, rev: string): Promise<string> {
    const m = rev.match(/^(.*?)((?:[~^]\d*)*)$/)!
    let base = m[1] || 'HEAD'
    const moves = m[2]
    let oid: string | undefined
    if (base === '@') base = 'HEAD'
    const rl = base.match(/^(?:HEAD)?@\{(\d+)\}$/)
    if (rl) {
      const s = await this.state(dir)
      oid = s.reflog[Number(rl[1])]?.oid ?? fail(`fatal: log for 'HEAD' only has ${s.reflog.length} entries`)
    } else {
      for (const ref of [base, `refs/tags/${base}`, `refs/heads/${base}`, `refs/remotes/${base}`]) {
        try { oid = await git.resolveRef({ fs: this.fs, dir, ref }); break } catch {}
      }
      if (!oid && /^[0-9a-f]{4,40}$/.test(base)) oid = await git.expandOid({ fs: this.fs, dir, oid: base }).catch(() => undefined)
      if (!oid) fail(`fatal: ambiguous argument '${rev}': unknown revision or path not in the working tree.`)
    }
    oid = await this.peel(dir, oid!)
    for (const mv of moves.match(/[~^]\d*/g) ?? []) {
      const n = mv.length > 1 ? Number(mv.slice(1)) : 1
      if (mv[0] === '~') {
        for (let i = 0; i < n; i++) oid = (await this.readCommit(dir, oid)).parent[0] ?? fail(`fatal: '${rev}' goes back further than the first commit`)
      } else if (n > 0) {
        oid = (await this.readCommit(dir, oid)).parent[n - 1] ?? fail(`fatal: '${rev}' has no parent number ${n}`)
      }
    }
    return oid
  }
  private async peel(dir: string, oid: string): Promise<string> {
    const o = await git.readObject({ fs: this.fs, dir, oid })
    if (o.type === 'tag') return this.peel(dir, (await git.readTag({ fs: this.fs, dir, oid })).tag.object)
    return oid
  }
  async readCommit(dir: string, oid: string) {
    return (await git.readCommit({ fs: this.fs, dir, oid })).commit
  }
  /** all files in a commit as path -> text */
  async treeFiles(dir: string, oid: string | null): Promise<Map<string, string>> {
    const out = new Map<string, string>()
    if (!oid) return out
    const files = await git.listFiles({ fs: this.fs, dir, ref: oid })
    for (const f of files) {
      const { blob } = await git.readBlob({ fs: this.fs, dir, oid, filepath: f })
      out.set(f, new TextDecoder().decode(blob))
    }
    return out
  }
  async indexFiles(dir: string): Promise<Map<string, string>> {
    const out = new Map<string, string>()
    await git.walk({
      fs: this.fs, dir, trees: [git.STAGE()],
      map: async (fp, [e]) => {
        if (!e || fp === '.') return true
        if ((await e.type()) === 'blob') {
          const { blob } = await git.readBlob({ fs: this.fs, dir, oid: await e.oid() })
          out.set(fp, new TextDecoder().decode(blob))
        }
        return true
      },
    })
    return out
  }
  async workFiles(dir: string): Promise<Map<string, string>> {
    const out = new Map<string, string>()
    for (const f of await this.walkFiles(dir)) out.set(f, await this.readText(dir + '/' + f))
    return out
  }
  private async matrix(dir: string) {
    return git.statusMatrix({ fs: this.fs, dir })
  }
  private async isAncestor(dir: string, ancestor: string, of: string) {
    if (ancestor === of) return true
    return git.isDescendent({ fs: this.fs, dir, oid: of, ancestor, depth: -1 }).catch(() => false)
  }
  private async moveHead(dir: string, oid: string) {
    const b = await this.branch(dir)
    if (b && !(await this.isDetached(dir))) await git.writeRef({ fs: this.fs, dir, ref: `refs/heads/${b}`, value: oid, force: true })
    else await git.writeRef({ fs: this.fs, dir, ref: 'HEAD', value: oid, force: true })
  }
  /** make index and working folder match a set of files (tracked files only) */
  private async applyTree(dir: string, target: Map<string, string>, updateWork = true) {
    const index = await this.indexFiles(dir)
    for (const f of new Set([...index.keys(), ...target.keys()])) {
      if (target.has(f)) {
        if (updateWork) await this.writeText(dir + '/' + f, target.get(f)!)
        const headOid = await this.headOid(dir)
        if (updateWork) await git.add({ fs: this.fs, dir, filepath: f })
        else if (headOid) await git.resetIndex({ fs: this.fs, dir, filepath: f, ref: headOid }).catch(() => {})
      } else {
        await git.remove({ fs: this.fs, dir, filepath: f })
        if (updateWork) await this.rmrf(dir + '/' + f)
      }
    }
    if (updateWork) await this.pruneEmptyDirs(dir)
  }
  private async pruneEmptyDirs(dir: string) {
    const walk = async (d: string): Promise<boolean> => {
      let names = await this.pfs.readdir(d)
      for (const n of names) if (n !== '.git' && (await this.isDir(d + '/' + n))) if (await walk(d + '/' + n)) await this.pfs.rmdir(d + '/' + n)
      names = await this.pfs.readdir(d)
      return names.length === 0 && d !== dir
    }
    await walk(dir)
  }
  private async hasLocalChanges(dir: string) {
    const rows = await this.matrix(dir)
    return rows.some(([, h, w, s]) => !(h === 0 && s === 0) && !(h === 1 && w === 1 && s === 1))
  }
  private async requireClean(dir: string, what: string) {
    if (await this.hasLocalChanges(dir)) fail(`error: Your local changes would be overwritten by ${what}.\nPlease commit your changes or stash them before you ${what}.`)
  }

  /* -------------------------------- git ---------------------------------- */

  private async git(args: string[]): Promise<string> {
    const [sub, ...rest] = args
    if (!sub || sub === 'help' || sub === '--help') return GIT_HELP
    if (sub === '--version' || sub === 'version') return 'git version 2.47.0 (BossGit, running in your browser)\n'
    if (rest.includes('-h') || rest.includes('--help')) return (GIT_USAGE[sub] ?? `See the BossGit cheat sheet for git ${sub}.`) + '\n'
    const alias = await this.getConfig(await this.findRepo(), `alias.${sub}`)
    if (alias) return this.git([...alias.split(' '), ...rest])
    switch (sub) {
      case 'init': return this.gInit(rest)
      case 'config': return this.gConfig(rest)
      case 'clone': return this.gClone(rest)
    }
    const dir = await this.repo()
    switch (sub) {
      case 'status': return this.gStatus(dir, rest)
      case 'add': return this.gAdd(dir, rest)
      case 'rm': return this.gRm(dir, rest)
      case 'mv': return this.gMv(dir, rest)
      case 'commit': return this.gCommit(dir, rest)
      case 'log': return this.gLog(dir, rest)
      case 'show': return this.gShow(dir, rest)
      case 'diff': return this.gDiff(dir, rest)
      case 'branch': return this.gBranch(dir, rest)
      case 'switch': return this.gSwitch(dir, rest)
      case 'checkout': return this.gCheckout(dir, rest)
      case 'restore': return this.gRestore(dir, rest)
      case 'reset': return this.gReset(dir, rest)
      case 'merge': return this.gMerge(dir, rest)
      case 'rebase': return this.gRebase(dir, rest)
      case 'cherry-pick': return this.gPick(dir, rest, 'cherry-pick')
      case 'revert': return this.gPick(dir, rest, 'revert')
      case 'stash': return this.gStash(dir, rest)
      case 'tag': return this.gTag(dir, rest)
      case 'reflog': return this.gReflog(dir, rest)
      case 'remote': return this.gRemote(dir, rest)
      case 'push': return this.gPush(dir, rest)
      case 'fetch': return this.gFetch(dir, rest)
      case 'pull': return this.gPull(dir, rest)
      case 'blame': return this.gBlame(dir, rest)
      case 'cat-file': return this.gCatFile(dir, rest)
      case 'rev-parse': return (await this.resolve(dir, rest.find(a => !a.startsWith('-')) ?? 'HEAD')) + '\n'
      case 'shortlog': return this.gShortlog(dir)
      default: return fail(`git: '${sub}' is not a git command BossGit knows yet. See 'git help'.`)
    }
  }

  private async gInit(args: string[]) {
    const p = parseArgs(args, ['-b', '--initial-branch'])
    const target = this.abs(p.pos[0] ?? '.')
    await this.mkdirp(target)
    const existed = await this.isDir(target + '/.git')
    const defaultBranch = p.get('-b', '--initial-branch') ?? (await this.getConfig(null, 'init.defaultBranch')) ?? 'main'
    await git.init({ fs: this.fs, dir: target, defaultBranch, bare: p.has('--bare') })
    return `${existed ? 'Reinitialized existing' : 'Initialized empty'} Git repository in ${target}/.git/\n`
  }

  private async gConfig(args: string[]) {
    const p = parseArgs(args)
    const isGlobal = p.has('--global', '--system')
    const dir = isGlobal ? null : await this.findRepo()
    if (p.has('--list', '-l')) {
      const g = await this.globalConfig()
      const lines = Object.entries(g).filter(([k]) => !k.startsWith('__')).map(([k, v]) => `${k}=${v}`)
      if (dir && !isGlobal) {
        const cfg = await this.readText(dir + '/.git/config').catch(() => '')
        let section = ''
        for (const raw of cfg.split('\n')) {
          const l = raw.trim()
          const s = l.match(/^\[(\S+)(?: "(.*)")?\]$/)
          if (s) { section = s[2] ? `${s[1]}.${s[2]}` : s[1]; continue }
          const kv = l.match(/^(\S+)\s*=\s*(.*)$/)
          if (kv) lines.push(`${section}.${kv[1]}=${kv[2]}`)
        }
      }
      return lines.join('\n') + '\n'
    }
    const [key, ...vals] = p.pos
    if (!key) fail('usage: git config [--global] <name> [<value>]')
    if (p.has('--unset')) {
      if (isGlobal || !dir) { const g = await this.globalConfig(); delete g[key]; await this.writeText(GLOBAL, JSON.stringify(g)) }
      else await git.setConfig({ fs: this.fs, dir, path: key, value: undefined })
      return ''
    }
    if (!vals.length) {
      const v = await this.getConfig(dir, key)
      return v === undefined ? '' : v + '\n'
    }
    const value = vals.join(' ')
    if (isGlobal || !dir) {
      if (!isGlobal && !dir) fail('fatal: not in a git directory. Use --global to set it for every repository.')
      const g = await this.globalConfig(); g[key] = value; await this.writeText(GLOBAL, JSON.stringify(g))
    } else await git.setConfig({ fs: this.fs, dir, path: key, value })
    return ''
  }

  private async gStatus(dir: string, args: string[]) {
    const shortFmt = args.includes('-s') || args.includes('--short')
    const rows = await this.matrix(dir)
    const s = await this.state(dir)
    const staged: string[] = [], unstaged: string[] = [], untracked: string[] = []
    const conflicts = new Set(s.conflicts)
    const shortLines: string[] = []
    for (const [f, h, w, st] of rows) {
      if (conflicts.has(f)) { shortLines.push(C.red('UU') + ' ' + f); continue }
      let x = ' ', y = ' '
      if (h === 0 && st === 0 && w === 2) { untracked.push(f); shortLines.push(C.red('??') + ' ' + f); continue }
      if (h === 0 && st !== 0) { staged.push(`new file:   ${f}`); x = 'A' }
      else if (h === 1 && st === 0) { staged.push(`deleted:    ${f}`); x = 'D' }
      else if (h === 1 && (st === 2 || st === 3)) { staged.push(`modified:   ${f}`); x = 'M' }
      if (st !== 0 && w === 0) { unstaged.push(`deleted:    ${f}`); y = 'D' }
      else if ((st === 1 && w === 2) || st === 3) { unstaged.push(`modified:   ${f}`); y = 'M' }
      if (x !== ' ' || y !== ' ') shortLines.push(C.green(x) + C.red(y) + ' ' + f)
    }
    if (shortFmt) return shortLines.length ? shortLines.join('\n') + '\n' : ''
    const out: string[] = []
    const b = await this.branch(dir)
    const head = await this.headOid(dir)
    if (b && !(await this.isDetached(dir))) out.push(`On branch ${b}`)
    else out.push(C.red(`HEAD detached at ${head ? short(head) : '?'}`))
    if (b) {
      const up = await this.upstream(dir, b)
      if (up && head) {
        const remoteOid = await this.resolve(dir, up).catch(() => null)
        if (remoteOid) {
          const [ahead, behind] = await this.aheadBehind(dir, head, remoteOid)
          if (!ahead && !behind) out.push(`Your branch is up to date with '${up}'.`)
          else if (ahead && !behind) out.push(`Your branch is ahead of '${up}' by ${ahead} commit${ahead > 1 ? 's' : ''}.\n  (use "git push" to publish your local commits)`)
          else if (!ahead && behind) out.push(`Your branch is behind '${up}' by ${behind} commit${behind > 1 ? 's' : ''}, and can be fast-forwarded.\n  (use "git pull" to update your local branch)`)
          else out.push(`Your branch and '${up}' have diverged,\nand have ${ahead} and ${behind} different commits each, respectively.`)
        }
      }
    }
    if (s.op) {
      const names = { merge: 'You have unmerged paths.\n  (fix conflicts and run "git commit")\n  (use "git merge --abort" to abort the merge)', 'cherry-pick': 'You are currently cherry-picking.\n  (fix conflicts and run "git cherry-pick --continue")', revert: 'You are currently reverting.\n  (fix conflicts and run "git revert --continue")', rebase: `You are currently rebasing branch '${s.op.branch}'.\n  (fix conflicts and then run "git rebase --continue")\n  (use "git rebase --abort" to check out the original branch)` }
      out.push(names[s.op.kind])
    }
    if (!head) out.push('\nNo commits yet')
    if (conflicts.size) out.push('\nUnmerged paths:\n  (use "git add <file>..." to mark resolution)\n' + [...conflicts].map(f => '\t' + C.red(`both modified:   ${f}`)).join('\n'))
    if (staged.length) out.push('\nChanges to be committed:\n  (use "git restore --staged <file>..." to unstage)\n' + staged.map(l => '\t' + C.green(l)).join('\n'))
    if (unstaged.length) out.push('\nChanges not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n  (use "git restore <file>..." to discard changes in working directory)\n' + unstaged.map(l => '\t' + C.red(l)).join('\n'))
    if (untracked.length) out.push('\nUntracked files:\n  (use "git add <file>..." to include in what will be committed)\n' + untracked.map(l => '\t' + C.red(l)).join('\n'))
    if (!staged.length && !unstaged.length && !untracked.length && !conflicts.size) out.push(head ? '\nnothing to commit, working tree clean' : '\nnothing to commit (create/copy files and use "git add" to track)')
    else if (!staged.length && !conflicts.size) out.push(unstaged.length ? '\nno changes added to commit (use "git add" and/or "git commit -a")' : '\nnothing added to commit but untracked files present (use "git add" to track)')
    return out.join('\n') + '\n'
  }

  private async aheadBehind(dir: string, a: string, b: string) {
    const reach = async (oid: string) => {
      const seen = new Set<string>(); const stack = [oid]
      while (stack.length) { const o = stack.pop()!; if (seen.has(o)) continue; seen.add(o); try { stack.push(...(await this.readCommit(dir, o)).parent) } catch {} }
      return seen
    }
    const A = await reach(a), B = await reach(b)
    return [[...A].filter(x => !B.has(x)).length, [...B].filter(x => !A.has(x)).length]
  }

  private async gAdd(dir: string, args: string[]) {
    const p = parseArgs(args)
    let specs = p.pos
    if (p.has('-A', '--all')) specs = [this.rel(dir, dir) === '.' ? dir : dir]
    if (!specs.length) fail('Nothing specified, nothing added.\n' + C.dim("Maybe you wanted to say 'git add .'?"))
    const rows = await this.matrix(dir)
    const s = await this.state(dir)
    let matched = 0
    for (const spec of specs) {
      const rel = spec === dir ? '.' : this.rel(dir, spec)
      const hits = rows.filter(([f]) => rel === '.' || f === rel || f.startsWith(rel + '/'))
      if (!hits.length) fail(`fatal: pathspec '${spec}' did not match any files`)
      for (const [f, , w] of hits) {
        if (w === 0) await git.remove({ fs: this.fs, dir, filepath: f })
        else await git.add({ fs: this.fs, dir, filepath: f })
        s.conflicts = s.conflicts.filter(c => c !== f)
        matched++
      }
    }
    await this.saveState(dir, s)
    return matched ? '' : ''
  }

  private async gRm(dir: string, args: string[]) {
    const p = parseArgs(args)
    let out = ''
    for (const spec of p.pos) {
      const f = this.rel(dir, spec)
      const tracked = (await git.listFiles({ fs: this.fs, dir })).filter(x => x === f || (p.has('-r') && x.startsWith(f + '/')))
      if (!tracked.length) fail(`fatal: pathspec '${spec}' did not match any files`)
      for (const t of tracked) {
        await git.remove({ fs: this.fs, dir, filepath: t })
        if (!p.has('--cached')) await this.rmrf(dir + '/' + t)
        out += `rm '${t}'\n`
      }
    }
    return out
  }

  private async gMv(dir: string, args: string[]) {
    const [a, b] = args
    if (!a || !b) fail('usage: git mv <source> <destination>')
    const from = this.rel(dir, a), to = this.rel(dir, b)
    await this.exec(['mv', a, b])
    await git.remove({ fs: this.fs, dir, filepath: from })
    await git.add({ fs: this.fs, dir, filepath: to })
    return ''
  }

  private async gCommit(dir: string, args: string[]) {
    const p = parseArgs(args, ['-m', '--message'])
    const s = await this.state(dir)
    if (s.conflicts.length) fail(`error: Committing is not possible because you have unmerged files.\nhint: Fix them up in the work tree, and then use 'git add <file>'\nhint: as appropriate to mark resolution and make a commit.\nfatal: Exiting because of an unresolved conflict.\n` + s.conflicts.map(c => `U\t${c}`).join('\n'))
    if (p.has('-a', '--all')) {
      for (const [f, h, w] of await this.matrix(dir)) {
        if (h === 0) continue
        if (w === 0) await git.remove({ fs: this.fs, dir, filepath: f })
        else await git.add({ fs: this.fs, dir, filepath: f })
      }
    }
    const amend = p.has('--amend')
    const head = await this.headOid(dir)
    let message = p.get('-m', '--message')
    if (!message && amend && head) message = (await this.readCommit(dir, head)).message.trim()
    if (!message && s.op) message = s.op.msg
    if (!message) fail(C.yellow('BossGit has no text editor, so write the message on the command line:') + '\n  git commit -m "Describe what you changed"')
    const rows = await this.matrix(dir)
    const anyStaged = rows.some(([, h, , st]) => (h === 0 && st !== 0) || (h === 1 && st !== 1))
    if (!anyStaged && !amend && !s.op) {
      const st = await this.gStatus(dir, [])
      fail(st.replace(/^.*?\n/, (m) => m))
    }
    if (amend && !head) fail('fatal: You have nothing to amend.')
    let parent: string[] = head ? [head] : []
    if (amend && head) parent = (await this.readCommit(dir, head)).parent
    if (s.op?.kind === 'merge' && s.op.theirs) parent = [head!, s.op.theirs]
    const author = await this.author(dir)
    const oid = await this.doCommit(dir, { message: message!, author, committer: author, parent })
    const b = await this.branch(dir)
    const detached = await this.isDetached(dir)
    const label = detached ? 'detached HEAD' : b
    const kind = s.op?.kind
    if (kind === 'merge' || kind === 'cherry-pick' || kind === 'revert') { s.op = undefined; await this.saveState(dir, s) }
    if (kind === 'rebase') {
      // commit made by hand during a rebase stop: continue later with --continue
      await this.logHead(dir, `commit: ${message!.split('\n')[0]}`)
      return `[${label} ${short(oid)}] ${message!.split('\n')[0]}\n`
    }
    await this.logHead(dir, `commit${amend ? ' (amend)' : kind === 'merge' ? ' (merge)' : !head ? ' (initial)' : ''}: ${message!.split('\n')[0]}`)
    const changed = await this.changedCount(dir, parent[0] ?? null, oid)
    return `[${label}${!head ? ' (root-commit)' : ''} ${short(oid)}] ${message!.split('\n')[0]}\n ${changed}\n`
  }

  private async changedCount(dir: string, a: string | null, b: string) {
    const A = await this.treeFiles(dir, a), B = await this.treeFiles(dir, b)
    let files = 0, ins = 0, del = 0
    for (const f of new Set([...A.keys(), ...B.keys()])) {
      if (A.get(f) === B.get(f)) continue
      files++
      for (const l of unifiedHunks(A.get(f) ?? '', B.get(f) ?? '')) { if (l[0] === '+') ins++; else if (l[0] === '-') del++ }
    }
    return `${files} file${files === 1 ? '' : 's'} changed, ${ins} insertion${ins === 1 ? '' : 's'}(+), ${del} deletion${del === 1 ? '' : 's'}(-)`
  }

  private async decorations(dir: string) {
    const map = new Map<string, string[]>()
    const add = (oid: string, label: string) => { if (!map.has(oid)) map.set(oid, []); map.get(oid)!.push(label) }
    const b = await this.branch(dir)
    const detached = await this.isDetached(dir)
    const head = await this.headOid(dir)
    if (head && detached) add(head, C.cyan('HEAD'))
    for (const br of await git.listBranches({ fs: this.fs, dir })) {
      const oid = await git.resolveRef({ fs: this.fs, dir, ref: `refs/heads/${br}` }).catch(() => null)
      if (!oid) continue
      add(oid, br === b && !detached ? C.cyan('HEAD -> ') + C.green(br) : C.green(br))
    }
    for (const r of await git.listRemotes({ fs: this.fs, dir })) {
      for (const br of await git.listBranches({ fs: this.fs, dir, remote: r.remote })) {
        if (br === 'HEAD') continue
        const oid = await git.resolveRef({ fs: this.fs, dir, ref: `refs/remotes/${r.remote}/${br}` }).catch(() => null)
        if (oid) add(oid, C.red(`${r.remote}/${br}`))
      }
    }
    for (const t of await git.listTags({ fs: this.fs, dir })) {
      const oid = await this.resolve(dir, t).catch(() => null)
      if (oid) add(oid, C.yellow(`tag: ${t}`))
    }
    return map
  }

  /** commits reachable from the given tips, newest first, parents after children */
  async commitsFrom(dir: string, tips: string[], limit = 500) {
    const commits = new Map<string, Awaited<ReturnType<Shell['readCommit']>>>()
    const stack = [...tips]
    while (stack.length && commits.size < limit) {
      const o = stack.pop()!
      if (commits.has(o)) continue
      try { const c = await this.readCommit(dir, o); commits.set(o, c); stack.push(...c.parent) } catch {}
    }
    // topological order: a commit always comes before its parents
    const order: string[] = []
    const seen = new Set<string>()
    const visit = (o: string) => {
      if (seen.has(o) || !commits.has(o)) return
      seen.add(o)
      for (const p of commits.get(o)!.parent) visit(p)
      order.push(o)
    }
    ;[...commits.keys()].sort((a, b) => commits.get(a)!.committer.timestamp - commits.get(b)!.committer.timestamp).forEach(visit)
    return order.reverse().map(oid => ({ oid, commit: commits.get(oid)! }))
  }

  private async gLog(dir: string, args: string[]) {
    const p = parseArgs(args, ['-n', '--author', '--grep'])
    const head = await this.headOid(dir)
    if (!head) fail(`fatal: your current branch '${await this.branch(dir)}' does not have any commits yet`)
    let limit = Number(p.get('-n') ?? (args.find(a => /^-\d+$/.test(a))?.slice(1)) ?? 1000)
    let tips = [head!]
    if (p.has('--all')) {
      tips = []
      for (const br of await git.listBranches({ fs: this.fs, dir })) tips.push(await this.resolve(dir, br))
      for (const r of await git.listRemotes({ fs: this.fs, dir })) for (const br of await git.listBranches({ fs: this.fs, dir, remote: r.remote })) if (br !== 'HEAD') tips.push(await this.resolve(dir, `${r.remote}/${br}`))
      for (const t of await git.listTags({ fs: this.fs, dir })) tips.push(await this.resolve(dir, t))
      tips.push(head!)
    } else if (p.pos.length) {
      const rangeArg = p.pos[0]
      if (rangeArg.includes('..')) {
        const [a, b] = rangeArg.split('..')
        const exclude = new Set((await this.commitsFrom(dir, [await this.resolve(dir, a || 'HEAD')])).map(x => x.oid))
        const list = (await this.commitsFrom(dir, [await this.resolve(dir, b || 'HEAD')])).filter(x => !exclude.has(x.oid))
        return this.formatLog(dir, list.slice(0, limit), p)
      }
      tips = [await this.resolve(dir, rangeArg)]
    }
    let list = await this.commitsFrom(dir, tips)
    const author = p.get('--author'), grep = p.get('--grep')
    if (author) list = list.filter(x => `${x.commit.author.name} ${x.commit.author.email}`.toLowerCase().includes(author.toLowerCase()))
    if (grep) list = list.filter(x => x.commit.message.toLowerCase().includes(grep.toLowerCase()))
    const pathFilter = args.indexOf('--') >= 0 ? args.slice(args.indexOf('--') + 1).map(a => this.rel(dir, a)) : []
    if (pathFilter.length) {
      const keep = []
      for (const x of list) {
        const now = await this.treeFiles(dir, x.oid), before = await this.treeFiles(dir, x.commit.parent[0] ?? null)
        if (pathFilter.some(f => now.get(f) !== before.get(f))) keep.push(x)
      }
      list = keep
    }
    if (p.has('-S')) { /* pickaxe handled below */ }
    limit = Math.max(1, limit)
    return this.formatLog(dir, list.slice(0, limit), p)
  }

  private async formatLog(dir: string, list: { oid: string; commit: any }[], p: ReturnType<typeof parseArgs>) {
    const deco = await this.decorations(dir)
    const oneline = p.has('--oneline')
    const graph = p.has('--graph')
    const out: string[] = []
    for (const { oid, commit } of list) {
      const d = deco.get(oid)
      const ds = d ? ' ' + C.yellow('(') + d.join(C.yellow(', ')) + C.yellow(')') : ''
      const g = graph ? (commit.parent.length > 1 ? '*   ' : '* ') : ''
      if (oneline) { out.push(`${g}${C.yellow(short(oid))}${ds} ${commit.message.split('\n')[0]}`); continue }
      out.push(`${g}${C.yellow('commit ' + oid)}${ds}`)
      if (commit.parent.length > 1) out.push(`Merge: ${commit.parent.map(short).join(' ')}`)
      out.push(`Author: ${commit.author.name} <${commit.author.email}>`)
      out.push(`Date:   ${new Date(commit.author.timestamp * 1000).toString().slice(0, 24)}`)
      out.push('')
      out.push(...commit.message.trimEnd().split('\n').map((l: string) => '    ' + l))
      out.push('')
    }
    return out.join('\n') + '\n'
  }

  private async gShow(dir: string, args: string[]) {
    const rev = args.find(a => !a.startsWith('-')) ?? 'HEAD'
    if (rev.includes(':')) {
      const [r, path] = rev.split(':')
      const files = await this.treeFiles(dir, await this.resolve(dir, r || 'HEAD'))
      return files.get(path) ?? fail(`fatal: path '${path}' does not exist in '${r}'`)
    }
    const oid = await this.resolve(dir, rev)
    const c = await this.readCommit(dir, oid)
    const t = (await this.annotatedTag(dir, rev))?.tag
    const tagHead = t ? `${C.yellow('tag ' + t.tag)}\nTagger: ${t.tagger.name} <${t.tagger.email}>\n\n${t.message.trim()}\n\n` : ''
    const head = await this.formatLog(dir, [{ oid, commit: c }], parseArgs([]))
    return tagHead + head + (await this.treeDiff(dir, c.parent[0] ?? null, oid))
  }

  /** the tag object behind an annotated tag name, or undefined for light tags and other revs */
  private async annotatedTag(dir: string, name: string) {
    const oid = await git.resolveRef({ fs: this.fs, dir, ref: `refs/tags/${name}`, depth: 2 }).catch(() => undefined)
    if (!oid) return undefined
    const o = await git.readObject({ fs: this.fs, dir, oid, format: 'parsed' }).catch(() => undefined)
    return o && o.type === 'tag' ? { oid, tag: o.object as any } : undefined
  }

  private formatFileDiff(path: string, a: string | undefined, b: string | undefined) {
    const out: string[] = [C.bold(`diff --git a/${path} b/${path}`)]
    if (a === undefined) out.push(C.bold('new file'), C.bold('--- /dev/null'), C.bold(`+++ b/${path}`))
    else if (b === undefined) out.push(C.bold('deleted file'), C.bold(`--- a/${path}`), C.bold('+++ /dev/null'))
    else out.push(C.bold(`--- a/${path}`), C.bold(`+++ b/${path}`))
    for (const l of unifiedHunks(a ?? '', b ?? '')) out.push(l.startsWith('@@') ? C.cyan(l) : l[0] === '+' ? C.green(l) : l[0] === '-' ? C.red(l) : l)
    return out.join('\n') + '\n'
  }
  private async mapDiff(A: Map<string, string>, B: Map<string, string>, only?: string[]) {
    let out = ''
    for (const f of [...new Set([...A.keys(), ...B.keys()])].sort()) {
      if (only && only.length && !only.some(o => f === o || f.startsWith(o + '/'))) continue
      if (A.get(f) !== B.get(f)) out += this.formatFileDiff(f, A.get(f), B.get(f))
    }
    return out
  }
  private async treeDiff(dir: string, a: string | null, b: string) {
    return this.mapDiff(await this.treeFiles(dir, a), await this.treeFiles(dir, b))
  }

  private async gDiff(dir: string, args: string[]) {
    const p = parseArgs(args)
    const paths = p.pos.filter(x => !x.includes('..'))
    const revs: string[] = []
    const files: string[] = []
    for (const x of paths) {
      if (await this.resolve(dir, x).then(() => true).catch(() => false)) revs.push(x)
      else files.push(this.rel(dir, x))
    }
    const range = p.pos.find(x => x.includes('..'))
    if (range) {
      const [a, b] = range.split(/\.\.\.?/)
      return this.mapDiff(await this.treeFiles(dir, await this.resolve(dir, a || 'HEAD')), await this.treeFiles(dir, await this.resolve(dir, b || 'HEAD')), files)
    }
    const index = await this.indexFiles(dir)
    if (p.has('--staged', '--cached')) return this.mapDiff(await this.treeFiles(dir, await this.headOid(dir)), index, files)
    if (revs.length === 2) return this.mapDiff(await this.treeFiles(dir, await this.resolve(dir, revs[0])), await this.treeFiles(dir, await this.resolve(dir, revs[1])), files)
    const work = await this.workFiles(dir)
    if (revs.length === 1) {
      const base = await this.treeFiles(dir, await this.resolve(dir, revs[0]))
      const w = new Map([...work].filter(([f]) => index.has(f) || base.has(f)))
      return this.mapDiff(base, w, files)
    }
    // working folder vs staging area, tracked files only
    const w = new Map([...work].filter(([f]) => index.has(f)))
    return this.mapDiff(index, w, files)
  }

  private async gBranch(dir: string, args: string[]) {
    const p = parseArgs(args, [])
    const cur = await this.branch(dir)
    const detached = await this.isDetached(dir)
    if (p.has('-d', '-D', '--delete')) {
      let out = ''
      for (const name of p.pos) {
        if (name === cur && !detached) fail(`error: cannot delete branch '${name}' used by worktree at '${dir}'`)
        const oid = await this.resolve(dir, `refs/heads/${name}`).catch(() => fail(`error: branch '${name}' not found.`))
        const head = await this.headOid(dir)
        if (p.has('-d', '--delete') && !p.has('-D') && head && !(await this.isAncestor(dir, oid, head)))
          fail(`error: the branch '${name}' is not fully merged.\nIf you are sure you want to delete it, run 'git branch -D ${name}'`)
        await git.deleteBranch({ fs: this.fs, dir, ref: name })
        out += `Deleted branch ${name} (was ${short(oid)}).\n`
      }
      return out
    }
    if (p.has('-m', '-M', '--move')) {
      const [a, b] = p.pos.length === 2 ? p.pos : [cur, p.pos[0]]
      if (!a || !b) fail('usage: git branch -m [<old>] <new>')
      await git.renameBranch({ fs: this.fs, dir, oldref: a!, ref: b!, checkout: a === cur })
      return ''
    }
    if (p.pos.length && !p.has('--list')) {
      const [name, start] = p.pos
      if (!(await this.headOid(dir)) && !start) fail(`fatal: not a valid object name: '${cur}'`)
      if (!/^[A-Za-z0-9._\/-]+$/.test(name) || name.endsWith('/') || name.includes('..')) fail(`fatal: '${name}' is not a valid branch name`)
      if (name === cur && !detached && p.has('-f', '--force')) fail(`fatal: cannot force update the current branch.`)
      if (!p.has('-f', '--force') && (await git.listBranches({ fs: this.fs, dir })).includes(name)) fail(`fatal: a branch named '${name}' already exists`)
      const oid = await this.resolve(dir, start ?? 'HEAD')
      await git.writeRef({ fs: this.fs, dir, ref: `refs/heads/${name}`, value: oid, force: true })
      return ''
    }
    const out: string[] = []
    const verbose = p.has('-v', '-vv')
    if (detached) out.push(`* ${C.green(`(HEAD detached at ${short((await this.headOid(dir))!)})`)}`)
    if (!p.has('-r')) {
      for (const br of (await git.listBranches({ fs: this.fs, dir })).sort()) {
        const oid = await this.resolve(dir, `refs/heads/${br}`).catch(() => '')
        const msg = verbose && oid ? ` ${C.yellow(short(oid))} ${(await this.readCommit(dir, oid)).message.split('\n')[0]}` : ''
        out.push(br === cur && !detached ? `* ${C.green(br)}${msg}` : `  ${br}${msg}`)
      }
    }
    if (p.has('-a', '-r')) {
      for (const r of await git.listRemotes({ fs: this.fs, dir }))
        for (const br of await git.listBranches({ fs: this.fs, dir, remote: r.remote })) if (br !== 'HEAD') out.push(`  ${C.red(`remotes/${r.remote}/${br}`)}`)
    }
    if (!cur && !out.length) return ''
    return out.join('\n') + (out.length ? '\n' : '')
  }

  private async checkoutBranch(dir: string, name: string) {
    try {
      await git.checkout({ fs: this.fs, dir, ref: name })
    } catch (e: any) {
      if (e?.code === 'CheckoutConflictError') fail(`error: Your local changes to the following files would be overwritten by checkout:\n${(e.data?.filepaths ?? []).map((f: string) => '\t' + f).join('\n')}\nPlease commit your changes or stash them before you switch branches.\nAborting`)
      throw e
    }
    await this.pruneEmptyDirs(dir)
  }
  private async detach(dir: string, oid: string) {
    await this.requireCleanForSwitch(dir, oid)
    await this.applyTree(dir, await this.treeFiles(dir, oid))
    await git.writeRef({ fs: this.fs, dir, ref: 'HEAD', value: oid, force: true })
  }
  private async requireCleanForSwitch(dir: string, target: string) {
    const rows = await this.matrix(dir)
    const targetFiles = await this.treeFiles(dir, target)
    const headFiles = await this.treeFiles(dir, await this.headOid(dir))
    const blocked = rows.filter(([f, h, w, s]) => !(h === 1 && w === 1 && s === 1) && !(h === 0 && s === 0) && targetFiles.get(f) !== headFiles.get(f)).map(r => r[0])
    if (blocked.length) fail(`error: Your local changes to the following files would be overwritten by checkout:\n${blocked.map(f => '\t' + f).join('\n')}\nPlease commit your changes or stash them before you switch branches.\nAborting`)
  }

  private async switchTo(dir: string, name: string, create: boolean, start?: string, force = false) {
    const exists = await this.exists(`${dir}/.git/refs/heads/${name}`) || (await git.listBranches({ fs: this.fs, dir })).includes(name)
    if (create) {
      if (exists && !force) fail(`fatal: a branch named '${name}' already exists`)
      const head = await this.headOid(dir)
      if (!head && !start) {
        // unborn branch: just point HEAD at the new name
        await this.writeText(`${dir}/.git/HEAD`, `ref: refs/heads/${name}\n`)
        return `Switched to a new branch '${name}'\n`
      }
      const oid = await this.resolve(dir, start ?? 'HEAD')
      await git.writeRef({ fs: this.fs, dir, ref: `refs/heads/${name}`, value: oid, force: true })
      if (start) await this.requireCleanForSwitch(dir, oid)
      await this.checkoutBranch(dir, name)
      await this.logHead(dir, `checkout: moving to ${name}`)
      return `Switched to a new branch '${name}'\n`
    }
    if (!exists) {
      // DWIM: create a local branch that tracks origin/<name>
      for (const r of await git.listRemotes({ fs: this.fs, dir })) {
        const oid = await this.resolve(dir, `${r.remote}/${name}`).catch(() => null)
        if (oid) {
          await git.writeRef({ fs: this.fs, dir, ref: `refs/heads/${name}`, value: oid })
          await git.setConfig({ fs: this.fs, dir, path: `branch.${name}.remote`, value: r.remote })
          await git.setConfig({ fs: this.fs, dir, path: `branch.${name}.merge`, value: `refs/heads/${name}` })
          await this.checkoutBranch(dir, name)
          await this.logHead(dir, `checkout: moving to ${name}`)
          return `branch '${name}' set up to track '${r.remote}/${name}'.\nSwitched to a new branch '${name}'\n`
        }
      }
      fail(`fatal: invalid reference: ${name}`)
    }
    if (name === (await this.branch(dir)) && !(await this.isDetached(dir))) return `Already on '${name}'\n`
    await this.requireCleanForSwitch(dir, await this.resolve(dir, `refs/heads/${name}`))
    await this.checkoutBranch(dir, name)
    await this.logHead(dir, `checkout: moving to ${name}`)
    return `Switched to branch '${name}'\n`
  }

  private async gSwitch(dir: string, args: string[]) {
    const p = parseArgs(args, ['-c', '-C', '--create'])
    const create = p.get('-c', '-C', '--create')
    if (create) return this.switchTo(dir, create, true, p.pos[0], p.has('-C'))
    const name = p.pos[0] ?? fail('fatal: missing branch or commit argument')
    if (p.has('--detach', '-d')) {
      const oid = await this.resolve(dir, name)
      await this.detach(dir, oid)
      await this.logHead(dir, `checkout: moving to ${name}`)
      return `HEAD is now at ${short(oid)} ${(await this.readCommit(dir, oid)).message.split('\n')[0]}\n`
    }
    if (name === '-') {
      const s = await this.state(dir)
      const curName = await this.branch(dir)
      const prev = s.reflog.find(r => r.msg.startsWith('checkout: moving to') && r.msg !== `checkout: moving to ${curName}`)
      if (!prev) fail('fatal: no previous branch')
      return this.switchTo(dir, prev!.msg.replace('checkout: moving to ', ''), false)
    }
    const isBranch = (await git.listBranches({ fs: this.fs, dir })).includes(name)
    if (!isBranch && (await this.resolve(dir, name).then(() => true).catch(() => false)) && !(await this.remoteHas(dir, name)))
      fail(`fatal: a branch is expected, got '${name}'\nhint: If you want to detach HEAD at the commit, try again with the --detach option.`)
    return this.switchTo(dir, name, false)
  }
  private async remoteHas(dir: string, name: string) {
    for (const r of await git.listRemotes({ fs: this.fs, dir })) if ((await git.listBranches({ fs: this.fs, dir, remote: r.remote })).includes(name)) return true
    return false
  }

  private async gCheckout(dir: string, args: string[]) {
    const p = parseArgs(args, ['-b', '-B'])
    const create = p.get('-b', '-B')
    if (create) return this.switchTo(dir, create, true, p.pos[0], p.has('-B'))
    const dd = args.indexOf('--')
    if (dd >= 0) return this.restoreFiles(dir, args.slice(dd + 1), args.slice(0, dd)[0])
    const target = p.pos[0] ?? fail('error: you must name a branch, commit or file')
    const branches = await git.listBranches({ fs: this.fs, dir })
    if (branches.includes(target) || (await this.remoteHas(dir, target))) return this.switchTo(dir, target, false)
    const oid = await this.resolve(dir, target).catch(() => null)
    if (oid && p.pos.length === 1) {
      await this.detach(dir, oid)
      await this.logHead(dir, `checkout: moving to ${target}`)
      return C.yellow(`Note: switching to '${target}'.\n\nYou are in 'detached HEAD' state. You can look around, make experimental\nchanges and commit them, and you can discard any commits you make in this\nstate without impacting any branches by switching back to a branch.\n\nIf you want to create a new branch to retain commits you create, you may\ndo so (now or later) by using -c with the switch command. Example:\n\n  git switch -c <new-branch-name>\n\n`) + `HEAD is now at ${short(oid)} ${(await this.readCommit(dir, oid)).message.split('\n')[0]}\n`
    }
    if (oid && p.pos.length > 1) return this.restoreFiles(dir, p.pos.slice(1), target)
    return this.restoreFiles(dir, p.pos)
  }

  private async restoreFiles(dir: string, specs: string[], source?: string) {
    if (!specs.length) fail('fatal: you must specify path(s) to restore')
    const from = source ? await this.treeFiles(dir, await this.resolve(dir, source)) : await this.indexFiles(dir)
    for (const spec of specs) {
      const rel = this.rel(dir, spec)
      const hits = [...from.keys()].filter(f => rel === '.' || f === rel || f.startsWith(rel + '/'))
      if (!hits.length) fail(`error: pathspec '${spec}' did not match any file(s) known to git`)
      for (const f of hits) await this.writeText(dir + '/' + f, from.get(f)!)
    }
    return ''
  }

  private async gRestore(dir: string, args: string[]) {
    const p = parseArgs(args, ['--source', '-s'])
    const source = p.get('--source', '-s')
    if (p.has('--staged', '-S')) {
      const head = await this.headOid(dir)
      for (const spec of p.pos) {
        const rel = this.rel(dir, spec)
        const index = await this.indexFiles(dir)
        const hits = [...index.keys()].filter(f => rel === '.' || f === rel || f.startsWith(rel + '/'))
        const headFiles = await this.treeFiles(dir, head)
        const all = new Set([...hits, ...[...headFiles.keys()].filter(f => rel === '.' || f === rel || f.startsWith(rel + '/'))])
        if (!all.size) fail(`error: pathspec '${spec}' did not match any file(s) known to git`)
        for (const f of all) {
          if (headFiles.has(f)) await git.resetIndex({ fs: this.fs, dir, filepath: f, ref: source ? await this.resolve(dir, source) : head! })
          else await git.remove({ fs: this.fs, dir, filepath: f })
        }
      }
      if (!p.has('--worktree', '-W')) return ''
    }
    return this.restoreFiles(dir, p.pos, source)
  }

  private async gReset(dir: string, args: string[]) {
    const p = parseArgs(args)
    const mode = p.has('--hard') ? 'hard' : p.has('--soft') ? 'soft' : 'mixed'
    const head = await this.headOid(dir)
    // git reset <file>: unstage
    const first = p.pos[0]
    const firstIsRev = first ? await this.resolve(dir, first).then(() => true).catch(() => false) : false
    if (first && (!firstIsRev || p.pos.length > 1)) {
      const files = firstIsRev ? p.pos.slice(1) : p.pos
      return this.gRestore(dir, ['--staged', ...(firstIsRev ? ['--source', first] : []), ...files])
    }
    if (!head) fail("fatal: ambiguous argument 'HEAD': unknown revision")
    const target = await this.resolve(dir, first ?? 'HEAD')
    const s = await this.state(dir)
    if (s.op || s.conflicts.length) { s.op = undefined; s.conflicts = []; await this.saveState(dir, s) }
    await this.moveHead(dir, target)
    const files = await this.treeFiles(dir, target)
    if (mode === 'hard') await this.applyTree(dir, files, true)
    else if (mode === 'mixed') {
      const index = await this.indexFiles(dir)
      for (const f of new Set([...index.keys(), ...files.keys()])) {
        if (files.has(f)) await git.resetIndex({ fs: this.fs, dir, filepath: f, ref: target })
        else await git.remove({ fs: this.fs, dir, filepath: f })
      }
    }
    await this.logHead(dir, `reset: moving to ${first ?? 'HEAD'}`)
    if (mode === 'hard') return `HEAD is now at ${short(target)} ${(await this.readCommit(dir, target)).message.split('\n')[0]}\n`
    if (mode === 'mixed') {
      const rows = await this.matrix(dir)
      const changed = rows.filter(([, h, w, s]) => h === 1 && (w !== 1 || s !== 1)).map(r => r[0])
      return changed.length ? 'Unstaged changes after reset:\n' + changed.map(f => `M\t${f}`).join('\n') + '\n' : ''
    }
    return ''
  }

  /** three-way merge of whole trees; writes result to index and working folder */
  private async mergeTrees(dir: string, base: string | null, ours: string, theirs: string, oursLabel: string, theirsLabel: string) {
    const B = await this.treeFiles(dir, base), O = await this.treeFiles(dir, ours), T = await this.treeFiles(dir, theirs)
    const conflicts: string[] = []
    const result = new Map<string, string>()
    for (const f of new Set([...B.keys(), ...O.keys(), ...T.keys()])) {
      const b = B.get(f), o = O.get(f), t = T.get(f)
      if (o === t) { if (o !== undefined) result.set(f, o); continue }
      if (b === o) { if (t !== undefined) result.set(f, t); continue }
      if (b === t) { if (o !== undefined) result.set(f, o); continue }
      if (o === undefined || t === undefined) {
        // modified on one side, deleted on the other
        conflicts.push(f)
        result.set(f, (o ?? t)!)
        continue
      }
      const m = merge3(b ?? '', o, t, oursLabel, theirsLabel)
      result.set(f, m.text)
      if (m.conflict) conflicts.push(f)
    }
    const index = await this.indexFiles(dir)
    for (const f of new Set([...index.keys(), ...result.keys()])) {
      if (!result.has(f)) { await git.remove({ fs: this.fs, dir, filepath: f }); await this.rmrf(dir + '/' + f); continue }
      await this.writeText(dir + '/' + f, result.get(f)!)
      if (!conflicts.includes(f)) await git.add({ fs: this.fs, dir, filepath: f })
    }
    await this.pruneEmptyDirs(dir)
    return conflicts
  }

  private conflictText(conflicts: string[], what: string) {
    return conflicts.map(f => `Auto-merging ${f}\n${C.red(`CONFLICT (content): Merge conflict in ${f}`)}`).join('\n') + `\n${what}\n`
  }

  private async gMerge(dir: string, args: string[]) {
    const p = parseArgs(args, ['-m'])
    const s = await this.state(dir)
    if (p.has('--abort')) {
      if (s.op?.kind !== 'merge') fail('fatal: There is no merge to abort (MERGE_HEAD missing).')
      s.op = undefined; s.conflicts = []; await this.saveState(dir, s)
      await this.applyTree(dir, await this.treeFiles(dir, await this.headOid(dir)))
      return ''
    }
    if (p.has('--continue')) return this.gCommit(dir, [])
    if (s.op) fail(`fatal: You have not concluded your ${s.op.kind} (MERGE_HEAD exists).\nPlease, commit your changes before you merge.`)
    const name = p.pos[0] ?? (await this.upstream(dir, (await this.branch(dir))!)) ?? fail('fatal: No remote for the current branch.')
    const theirs = await this.resolve(dir, name!)
    const ours = await this.headOid(dir)
    if (!ours) fail('fatal: your current branch has no commits yet')
    if (await this.isAncestor(dir, theirs, ours!)) return 'Already up to date.\n'
    await this.requireClean(dir, 'merge')
    if (!p.has('--no-ff') && (await this.isAncestor(dir, ours!, theirs))) {
      const before = await this.treeFiles(dir, ours!)
      await this.moveHead(dir, theirs)
      await this.applyTree(dir, await this.treeFiles(dir, theirs))
      await this.logHead(dir, `merge ${name}: Fast-forward`)
      return `Updating ${short(ours!)}..${short(theirs)}\nFast-forward\n ${await this.changedCountMaps(before, await this.treeFiles(dir, theirs))}\n`
    }
    if (p.has('--ff-only')) fail('fatal: Not possible to fast-forward, aborting.')
    const base = await git.findMergeBase({ fs: this.fs, dir, oids: [ours!, theirs] })
    const label = (await this.branch(dir)) ?? 'HEAD'
    const conflicts = await this.mergeTrees(dir, base[0] ?? null, ours!, theirs, 'HEAD', name!)
    const msg = p.get('-m') ?? `Merge branch '${name}'${label !== 'main' && label !== 'master' ? ` into ${label}` : ''}`
    if (conflicts.length) {
      s.op = { kind: 'merge', msg, theirs }
      s.conflicts = conflicts
      await this.saveState(dir, s)
      return this.conflictText(conflicts, 'Automatic merge failed; fix conflicts and then commit the result.')
    }
    s.op = { kind: 'merge', msg, theirs }
    await this.saveState(dir, s)
    const out = await this.gCommit(dir, ['-m', msg])
    return `Merge made by the 'ort' strategy.\n${out.split('\n').slice(1).join('\n')}`
  }
  private async changedCountMaps(A: Map<string, string>, B: Map<string, string>) {
    let files = 0
    for (const f of new Set([...A.keys(), ...B.keys()])) if (A.get(f) !== B.get(f)) files++
    return `${files} file${files === 1 ? '' : 's'} changed`
  }

  /** apply one commit (cherry-pick) or its opposite (revert) on top of HEAD */
  private async applyCommit(dir: string, oid: string, revert: boolean) {
    const c = await this.readCommit(dir, oid)
    const parent = c.parent[0] ?? null
    const head = (await this.headOid(dir))!
    const subject = c.message.split('\n')[0]
    const conflicts = revert
      ? await this.mergeTrees(dir, oid, head, parent ?? oid, 'HEAD', `parent of ${short(oid)} (${subject})`)
      : await this.mergeTrees(dir, parent, head, oid, 'HEAD', `${short(oid)} (${subject})`)
    const msg = revert ? `Revert "${subject}"\n\nThis reverts commit ${oid}.` : c.message.trimEnd()
    return { conflicts, msg, author: c.author }
  }

  private async gPick(dir: string, args: string[], kind: 'cherry-pick' | 'revert') {
    const p = parseArgs(args)
    const s = await this.state(dir)
    if (p.has('--abort')) {
      if (s.op?.kind !== kind) fail(`error: no ${kind} in progress`)
      s.op = undefined; s.conflicts = []; await this.saveState(dir, s)
      await this.applyTree(dir, await this.treeFiles(dir, await this.headOid(dir)))
      return ''
    }
    if (p.has('--continue')) {
      if (s.op?.kind !== kind) fail(`error: no ${kind} in progress`)
      return this.gCommit(dir, [])
    }
    if (!p.pos.length) fail(`usage: git ${kind} <commit>...`)
    await this.requireClean(dir, kind)
    let out = ''
    for (const rev of p.pos) {
      const oid = await this.resolve(dir, rev)
      const { conflicts, msg } = await this.applyCommit(dir, oid, kind === 'revert')
      if (conflicts.length) {
        s.op = { kind, msg }; s.conflicts = conflicts; await this.saveState(dir, s)
        return out + this.conflictText(conflicts, `error: could not ${kind === 'revert' ? 'revert' : 'apply'} ${short(oid)}\nhint: After resolving the conflicts, mark them with "git add <file>"\nhint: and run "git ${kind} --continue".`)
      }
      const rows = await this.matrix(dir)
      if (!rows.some(([, h, , st]) => (h === 0 && st !== 0) || (h === 1 && st !== 1))) { out += `The previous ${kind} is now empty, skipping ${short(oid)}.\n`; continue }
      const author = await this.author(dir)
      const newOid = await this.doCommit(dir, { message: msg, author, committer: author })
      await this.logHead(dir, `${kind}: ${msg.split('\n')[0]}`)
      out += `[${(await this.branch(dir)) ?? 'detached HEAD'} ${short(newOid)}] ${msg.split('\n')[0]}\n`
    }
    return out
  }

  private async gRebase(dir: string, args: string[]) {
    const p = parseArgs(args, ['--onto'])
    const s = await this.state(dir)
    if (p.has('--abort')) {
      if (s.op?.kind !== 'rebase') fail('fatal: No rebase in progress?')
      const { branch, orig } = s.op!
      s.op = undefined; s.conflicts = []; await this.saveState(dir, s)
      await git.writeRef({ fs: this.fs, dir, ref: `refs/heads/${branch}`, value: orig!, force: true })
      await this.writeText(`${dir}/.git/HEAD`, `ref: refs/heads/${branch}\n`)
      await this.applyTree(dir, await this.treeFiles(dir, orig!))
      await this.logHead(dir, `rebase (abort): returning to refs/heads/${branch}`)
      return ''
    }
    if (p.has('--continue') || p.has('--skip')) {
      if (s.op?.kind !== 'rebase') fail('fatal: No rebase in progress?')
      if (s.conflicts.length) fail(`error: you must edit all merge conflicts and then\nmark them as resolved using git add\n` + s.conflicts.map(c => `U\t${c}`).join('\n'))
      if (p.has('--skip')) await this.applyTree(dir, await this.treeFiles(dir, await this.headOid(dir)))
      else {
        const rows = await this.matrix(dir)
        if (rows.some(([, h, , st]) => (h === 0 && st !== 0) || (h === 1 && st !== 1))) {
          const author = await this.author(dir)
          await this.doCommit(dir, { message: s.op!.msg, author, committer: author })
          await this.logHead(dir, `rebase (continue): ${s.op!.msg.split('\n')[0]}`)
        }
      }
      return this.rebaseSteps(dir, s)
    }
    if (p.has('-i', '--interactive')) fail(C.yellow('Interactive rebase opens a text editor, which BossGit does not have yet.') + '\nIn the lesson on interactive rebase you will use the visual rebase planner instead.')
    if (s.op) fail(`fatal: It seems that there is already a ${s.op.kind} in progress.`)
    const branch = await this.branch(dir)
    if (!branch || (await this.isDetached(dir))) fail('fatal: You are not currently on a branch.')
    const upstreamName = p.pos[0] ?? (await this.upstream(dir, branch!)) ?? fail('fatal: There is no tracking information for the current branch.\nPlease specify which branch you want to rebase against.')
    await this.requireClean(dir, 'rebase')
    const head = (await this.headOid(dir))!
    const upstream = await this.resolve(dir, upstreamName!)
    const onto = p.get('--onto') ? await this.resolve(dir, p.get('--onto')!) : upstream
    if (await this.isAncestor(dir, head, onto) && onto === upstream) {
      // fast-forward
      await this.moveHead(dir, onto)
      await this.applyTree(dir, await this.treeFiles(dir, onto))
      await this.logHead(dir, `rebase (finish): refs/heads/${branch} onto ${short(onto)}`)
      return `Successfully rebased and updated refs/heads/${branch}.\n`
    }
    if (await this.isAncestor(dir, upstream, head) && onto === upstream) return `Current branch ${branch} is up to date.\n`
    const exclude = new Set((await this.commitsFrom(dir, [upstream])).map(x => x.oid))
    const todo = (await this.commitsFrom(dir, [head])).filter(x => !exclude.has(x.oid) && x.commit.parent.length < 2).map(x => x.oid).reverse()
    s.op = { kind: 'rebase', msg: '', branch: branch!, orig: head, todo }
    await this.saveState(dir, s)
    await git.writeRef({ fs: this.fs, dir, ref: 'HEAD', value: onto, force: true })
    await this.applyTree(dir, await this.treeFiles(dir, onto))
    await this.logHead(dir, `rebase (start): checkout ${upstreamName}`)
    return this.rebaseSteps(dir, await this.state(dir))
  }

  private async rebaseSteps(dir: string, s: BossState): Promise<string> {
    const op = s.op!
    while (op.todo && op.todo.length) {
      const oid = op.todo.shift()!
      const { conflicts, msg } = await this.applyCommit(dir, oid, false)
      op.msg = msg; op.current = oid
      if (conflicts.length) {
        s.conflicts = conflicts; await this.saveState(dir, s)
        return this.conflictText(conflicts, `error: could not apply ${short(oid)}... ${msg.split('\n')[0]}\nhint: Resolve all conflicts manually, mark them as resolved with\nhint: "git add <conflicted_files>", then run "git rebase --continue".\nhint: To abort and get back to the state before "git rebase", run "git rebase --abort".`)
      }
      const rows = await this.matrix(dir)
      if (rows.some(([, h, , st]) => (h === 0 && st !== 0) || (h === 1 && st !== 1))) {
        const c = await this.readCommit(dir, oid)
        const committer = await this.author(dir)
        await this.doCommit(dir, { message: msg, author: c.author, committer })
        await this.logHead(dir, `rebase (pick): ${msg.split('\n')[0]}`)
      }
      s.reflog = (await this.state(dir)).reflog
      await this.saveState(dir, s)
    }
    const head = (await this.headOid(dir))!
    await git.writeRef({ fs: this.fs, dir, ref: `refs/heads/${op.branch}`, value: head, force: true })
    await this.writeText(`${dir}/.git/HEAD`, `ref: refs/heads/${op.branch}\n`)
    s.op = undefined; s.conflicts = []
    s.reflog = (await this.state(dir)).reflog
    await this.saveState(dir, s)
    await this.logHead(dir, `rebase (finish): returning to refs/heads/${op.branch}`)
    return `Successfully rebased and updated refs/heads/${op.branch}.\n`
  }

  private async gStash(dir: string, args: string[]) {
    const [sub = 'push', ...rest] = args
    const s = await this.state(dir)
    const p = parseArgs(sub.startsWith('-') ? args : rest, ['-m', '--message'])
    const head = await this.headOid(dir)
    if (sub === 'list') return s.stash.map((x, i) => `stash@{${i}}: ${x.msg}`).join('\n') + (s.stash.length ? '\n' : '')
    if (sub === 'clear') { s.stash = []; await this.saveState(dir, s); return '' }
    if (sub === 'pop' || sub === 'apply' || sub === 'drop' || sub === 'show') {
      const n = Number((p.pos[0] ?? '').match(/\{(\d+)\}/)?.[1] ?? p.pos[0] ?? 0) || 0
      const entry = s.stash[n] ?? fail(s.stash.length ? `error: stash@{${n}} is not a valid reference` : 'No stash entries found.')
      if (sub === 'show') return Object.keys(entry!.files).map(f => ` ${f}`).join('\n') + '\n'
      if (sub !== 'drop') {
        for (const [f, text] of Object.entries(entry!.files)) {
          if (text === null) { await this.rmrf(dir + '/' + f); await git.remove({ fs: this.fs, dir, filepath: f }).catch(() => {}) }
          else await this.writeText(dir + '/' + f, text)
        }
      }
      if (sub !== 'apply') { s.stash.splice(n, 1); await this.saveState(dir, s) }
      const status = sub === 'drop' ? '' : await this.gStatus(dir, [])
      return status + (sub === 'apply' ? '' : `Dropped stash@{${n}}\n`)
    }
    if (sub !== 'push' && sub !== 'save' && !sub.startsWith('-')) fail(`error: unknown stash command '${sub}'`)
    if (!head) return fail('You do not have the initial commit yet')
    const rows = await this.matrix(dir)
    const includeUntracked = p.has('-u', '--include-untracked')
    const files: Record<string, string | null> = {}
    for (const [f, h, w, st] of rows) {
      const tracked = h === 1 || st !== 0
      if (!tracked && !includeUntracked) continue
      if (h === 1 && w === 1 && st === 1) continue
      files[f] = w === 0 ? null : await this.readText(dir + '/' + f)
    }
    if (!Object.keys(files).length) return 'No local changes to save\n'
    const b = (await this.branch(dir)) ?? '(no branch)'
    const c = await this.readCommit(dir, head)
    const msg = p.get('-m', '--message') ? `On ${b}: ${p.get('-m', '--message')}` : `WIP on ${b}: ${short(head)} ${c.message.split('\n')[0]}`
    s.stash.unshift({ msg, base: head, files })
    await this.saveState(dir, s)
    await this.applyTree(dir, await this.treeFiles(dir, head))
    if (includeUntracked) for (const [f, h, , st] of rows) if (h === 0 && st === 0) await this.rmrf(dir + '/' + f)
    return `Saved working directory and index state ${msg}\n`
  }

  private async gTag(dir: string, args: string[]) {
    const p = parseArgs(args, ['-m'])
    if (p.has('-d', '--delete')) {
      for (const t of p.pos) { const oid = await this.resolve(dir, t); await git.deleteTag({ fs: this.fs, dir, ref: t }); return `Deleted tag '${t}' (was ${short(oid)})\n` }
    }
    if (!p.pos.length || p.has('-l', '--list')) {
      const tags = (await git.listTags({ fs: this.fs, dir })).sort()
      return tags.length ? tags.join('\n') + '\n' : ''
    }
    const [name, rev] = p.pos
    if ((await git.listTags({ fs: this.fs, dir })).includes(name)) fail(`fatal: tag '${name}' already exists`)
    const oid = await this.resolve(dir, rev ?? 'HEAD')
    if (p.has('-a') || p.get('-m')) {
      const tagger = await this.author(dir)
      await git.annotatedTag({ fs: this.fs, dir, ref: name, object: oid, message: p.get('-m') ?? name, tagger })
    } else await git.tag({ fs: this.fs, dir, ref: name, object: oid })
    return ''
  }

  private async gReflog(dir: string, _args: string[]) {
    const s = await this.state(dir)
    return s.reflog.map((r, i) => `${C.yellow(short(r.oid))} HEAD@{${i}}: ${r.msg}`).join('\n') + '\n'
  }

  private async gBlame(dir: string, args: string[]) {
    const file = this.rel(dir, args.find(a => !a.startsWith('-')) ?? fail('usage: git blame <file>'))
    const head = (await this.headOid(dir))!
    const list = (await this.commitsFrom(dir, [head])).filter(x => x.commit.parent.length < 2)
    const lines = (await this.treeFiles(dir, head)).get(file)?.split('\n') ?? fail(`fatal: no such path '${file}' in HEAD`)
    if (lines![lines!.length - 1] === '') lines!.pop()
    const out: string[] = []
    // a line belongs to the oldest commit in a first-parent walk that still has it unchanged
    for (let i = 0; i < lines!.length; i++) {
      let owner = list[0]
      for (const x of list) {
        const text = (await this.treeFiles(dir, x.oid)).get(file)
        if (text !== undefined && text.split('\n').includes(lines![i])) owner = x
        else break
      }
      const d = new Date(owner.commit.author.timestamp * 1000).toISOString().slice(0, 10)
      out.push(`${C.yellow(short(owner.oid))} (${owner.commit.author.name.padEnd(10).slice(0, 10)} ${d} ${String(i + 1).padStart(3)}) ${lines![i]}`)
    }
    return out.join('\n') + '\n'
  }

  private async gCatFile(dir: string, args: string[]) {
    const p = parseArgs(args)
    const rev = p.pos[0] ?? fail('usage: git cat-file (-t | -p) <object>')
    let oid: string
    try { oid = await this.resolve(dir, rev) } catch { oid = await git.expandOid({ fs: this.fs, dir, oid: rev }).catch(() => fail(`fatal: Not a valid object name ${rev}`)) as string }
    if (/^[0-9a-f]{4,40}$/.test(rev)) oid = await git.expandOid({ fs: this.fs, dir, oid: rev }).catch(() => oid)
    oid = (await this.annotatedTag(dir, rev))?.oid ?? oid
    const o = await git.readObject({ fs: this.fs, dir, oid, format: 'parsed' })
    if (p.has('-t')) return o.type + '\n'
    if (p.has('-s')) return String(((await git.readObject({ fs: this.fs, dir, oid, format: 'content' })).object as Uint8Array).length) + '\n'
    if (o.type === 'blob') return new TextDecoder().decode(o.object as Uint8Array)
    if (o.type === 'tree') return (o.object as any[]).map(e => `${e.mode} ${e.type} ${e.oid}\t${e.path}`).join('\n') + '\n'
    if (o.type === 'commit') {
      const c = o.object as any
      return [`tree ${c.tree}`, ...c.parent.map((x: string) => `parent ${x}`), `author ${c.author.name} <${c.author.email}> ${c.author.timestamp}`, `committer ${c.committer.name} <${c.committer.email}> ${c.committer.timestamp}`, '', c.message].join('\n')
    }
    const t = o.object as any
    return [`object ${t.object}`, `type ${t.type}`, `tag ${t.tag}`, `tagger ${t.tagger.name} <${t.tagger.email}>`, '', t.message].join('\n')
  }

  private async gShortlog(dir: string) {
    const head = await this.headOid(dir)
    if (!head) return ''
    const by = new Map<string, string[]>()
    for (const { commit } of await this.commitsFrom(dir, [head])) {
      const k = commit.author.name
      if (!by.has(k)) by.set(k, [])
      by.get(k)!.push(commit.message.split('\n')[0])
    }
    return [...by].map(([n, msgs]) => `${n} (${msgs.length}):\n${msgs.map(m => '      ' + m).join('\n')}\n`).join('\n')
  }

  /* -------------------------------- remotes ------------------------------ */
  // A "remote" is a bare repository stored in this same browser, at
  // /.bossgit/remotes/<name>. Objects are copied between repositories.

  private remotePath(url: string) {
    const slug = url.replace(/^[a-z]+:\/\//, '').replace(/^git@/, '').replace(/\.git$/, '').replace(/[^A-Za-z0-9._-]+/g, '-')
    return `${REMOTES}/${slug}.git`
  }
  private async remoteUrl(dir: string, name: string) {
    const r = (await git.listRemotes({ fs: this.fs, dir })).find(x => x.remote === name)
    return r?.url
  }
  private async upstream(dir: string, branch: string) {
    const remote = await this.getConfig(dir, `branch.${branch}.remote`)
    const merge = await this.getConfig(dir, `branch.${branch}.merge`)
    if (!remote || !merge) return undefined
    return `${remote}/${merge.replace('refs/heads/', '')}`
  }
  private async ensureRemoteRepo(url: string, create: boolean) {
    const path = this.remotePath(url)
    if (!(await this.isDir(path))) {
      if (!create) fail(`fatal: repository '${url}' not found`)
      await this.mkdirp(path)
      await git.init({ fs: this.fs, dir: path, gitdir: path, bare: true, defaultBranch: 'main' })
    }
    return path
  }

  private async gRemote(dir: string, args: string[]) {
    const [sub, ...rest] = args
    if (!sub || sub === '-v') {
      const list = await git.listRemotes({ fs: this.fs, dir })
      if (sub === '-v') return list.map(r => `${r.remote}\t${r.url} (fetch)\n${r.remote}\t${r.url} (push)`).join('\n') + (list.length ? '\n' : '')
      return list.map(r => r.remote).join('\n') + (list.length ? '\n' : '')
    }
    if (sub === 'add') {
      const [name, url] = rest
      if (!name || !url) fail('usage: git remote add <name> <url>')
      if (await this.remoteUrl(dir, name)) fail(`error: remote ${name} already exists.`)
      await git.addRemote({ fs: this.fs, dir, remote: name, url })
      return ''
    }
    if (sub === 'remove' || sub === 'rm') { await git.deleteRemote({ fs: this.fs, dir, remote: rest[0] }); return '' }
    if (sub === 'rename') {
      const url = (await this.remoteUrl(dir, rest[0])) ?? fail(`error: No such remote: '${rest[0]}'`)
      await git.deleteRemote({ fs: this.fs, dir, remote: rest[0] })
      await git.addRemote({ fs: this.fs, dir, remote: rest[1], url: url! })
      return ''
    }
    if (sub === 'get-url') return ((await this.remoteUrl(dir, rest[0])) ?? fail(`error: No such remote '${rest[0]}'`)) + '\n'
    if (sub === 'set-url') { await git.addRemote({ fs: this.fs, dir, remote: rest[0], url: rest[1], force: true }); return '' }
    return fail(`error: unknown subcommand: ${sub}`)
  }

  private async gPush(dir: string, args: string[]) {
    const p = parseArgs(args)
    const force = p.has('-f', '--force', '--force-with-lease')
    const branch = await this.branch(dir)
    let [remote, refspec] = p.pos
    if (!remote) {
      const up = branch ? await this.getConfig(dir, `branch.${branch}.remote`) : undefined
      if (!up) {
        const remotes = await git.listRemotes({ fs: this.fs, dir })
        if (!remotes.length) fail('fatal: No configured push destination.\nEither specify the URL from the command-line or configure a remote repository using\n\n    git remote add <name> <url>\n\nand then push using the remote name\n\n    git push <name>')
        fail(`fatal: The current branch ${branch} has no upstream branch.\nTo push the current branch and set the remote as upstream, use\n\n    git push --set-upstream origin ${branch}\n`)
      }
      remote = up!
    }
    const url = (await this.remoteUrl(dir, remote)) ?? fail(`fatal: '${remote}' does not appear to be a git repository\nfatal: Could not read from remote repository.`)
    const created = !(await this.isDir(this.remotePath(url!)))
    const rdir = await this.ensureRemoteRepo(url!, true)
    const out: string[] = []
    if (created) out.push(C.dim(`(BossGit made a pretend GitHub repository for ${url})`))
    out.push(`To ${url}`)
    if (p.has('--delete', '-d')) {
      const name = refspec ?? fail('fatal: --delete needs a branch name')
      await git.deleteRef({ fs: this.fs, gitdir: rdir, ref: `refs/heads/${name}` }).catch(() => fail(`error: unable to delete '${name}': remote ref does not exist`))
      await git.deleteRef({ fs: this.fs, dir, ref: `refs/remotes/${remote}/${name}` }).catch(() => {})
      out.push(` - [deleted]         ${name}`)
      return out.join('\n') + '\n'
    }
    let refs: [string, string][] = []
    if (p.has('--tags')) {
      await this.copyTree(dir + '/.git/objects', rdir + '/objects')
      for (const t of await git.listTags({ fs: this.fs, dir })) {
        const oid = await git.resolveRef({ fs: this.fs, dir, ref: `refs/tags/${t}` })
        await git.writeRef({ fs: this.fs, gitdir: rdir, ref: `refs/tags/${t}`, value: oid, force: true })
        out.push(` * [new tag]         ${t} -> ${t}`)
      }
      return out.join('\n') + '\n'
    }
    if (p.has('--all')) refs = (await git.listBranches({ fs: this.fs, dir })).map(b => [b, b])
    else {
      const spec = refspec ?? branch ?? fail('fatal: You are not currently on a branch.')
      const [src, dst] = spec!.includes(':') ? spec!.split(':') : [spec!, spec!]
      refs = [[src, dst]]
    }
    await this.copyTree(dir + '/.git/objects', rdir + '/objects')
    for (const [src, dst] of refs) {
      const local = await this.resolve(dir, src)
      let remoteOid: string | null = null
      try { remoteOid = await git.resolveRef({ fs: this.fs, gitdir: rdir, ref: `refs/heads/${dst}` }) } catch {}
      if (remoteOid === local) { out.push('Everything up-to-date'); continue }
      if (remoteOid && !force) {
        const known = await git.readObject({ fs: this.fs, dir, oid: remoteOid }).then(() => true).catch(() => false)
        if (!known || !(await this.isAncestor(dir, remoteOid, local))) {
          out.push(C.red(` ! [rejected]        ${src} -> ${dst} (${known ? 'non-fast-forward' : 'fetch first'})`))
          out.push(C.red(`error: failed to push some refs to '${url}'`))
          out.push(C.yellow(`hint: Updates were rejected because the remote contains work that you do not\nhint: have locally. This is usually caused by another repository pushing to\nhint: the same ref. Integrate the remote changes (e.g. 'git pull ...')\nhint: before pushing again.`))
          return out.join('\n') + '\n'
        }
      }
      await git.writeRef({ fs: this.fs, gitdir: rdir, ref: `refs/heads/${dst}`, value: local, force: true })
      await git.writeRef({ fs: this.fs, dir, ref: `refs/remotes/${remote}/${dst}`, value: local, force: true })
      if (!remoteOid) out.push(` * [new branch]      ${src} -> ${dst}`)
      else out.push(`   ${short(remoteOid)}${force ? '...' : '..'}${short(local)}  ${src} -> ${dst}${force ? ' (forced update)' : ''}`)
      if (p.has('-u', '--set-upstream')) {
        await git.setConfig({ fs: this.fs, dir, path: `branch.${src}.remote`, value: remote })
        await git.setConfig({ fs: this.fs, dir, path: `branch.${src}.merge`, value: `refs/heads/${dst}` })
        out.push(`branch '${src}' set up to track '${remote}/${dst}'.`)
      }
    }
    return out.join('\n') + '\n'
  }

  private async gFetch(dir: string, args: string[]) {
    const p = parseArgs(args)
    const remotes = p.has('--all') ? (await git.listRemotes({ fs: this.fs, dir })).map(r => r.remote) : [p.pos[0] ?? 'origin']
    const out: string[] = []
    for (const remote of remotes) {
      const url = (await this.remoteUrl(dir, remote)) ?? fail(`fatal: '${remote}' does not appear to be a git repository`)
      const rdir = await this.ensureRemoteRepo(url!, false)
      await this.copyTree(rdir + '/objects', dir + '/.git/objects')
      const lines: string[] = []
      const remoteBranches = await git.listBranches({ fs: this.fs, gitdir: rdir })
      for (const b of remoteBranches) {
        const oid = await git.resolveRef({ fs: this.fs, gitdir: rdir, ref: `refs/heads/${b}` })
        let old: string | null = null
        try { old = await git.resolveRef({ fs: this.fs, dir, ref: `refs/remotes/${remote}/${b}` }) } catch {}
        if (old === oid) continue
        await git.writeRef({ fs: this.fs, dir, ref: `refs/remotes/${remote}/${b}`, value: oid, force: true })
        lines.push(old ? `   ${short(old)}..${short(oid)}  ${b.padEnd(10)} -> ${remote}/${b}` : ` * [new branch]      ${b.padEnd(10)} -> ${remote}/${b}`)
      }
      if (p.has('--prune', '-p')) {
        for (const b of await git.listBranches({ fs: this.fs, dir, remote })) {
          if (b !== 'HEAD' && !remoteBranches.includes(b)) { await git.deleteRef({ fs: this.fs, dir, ref: `refs/remotes/${remote}/${b}` }); lines.push(` - [deleted]         (none)     -> ${remote}/${b}`) }
        }
      }
      for (const t of await git.listTags({ fs: this.fs, gitdir: rdir })) {
        if (!(await git.listTags({ fs: this.fs, dir })).includes(t)) {
          await git.writeRef({ fs: this.fs, dir, ref: `refs/tags/${t}`, value: await git.resolveRef({ fs: this.fs, gitdir: rdir, ref: `refs/tags/${t}` }) })
          lines.push(` * [new tag]         ${t.padEnd(10)} -> ${t}`)
        }
      }
      if (lines.length) out.push(`From ${url}`, ...lines)
    }
    return out.length ? out.join('\n') + '\n' : ''
  }

  private async gPull(dir: string, args: string[]) {
    const p = parseArgs(args)
    const branch = (await this.branch(dir)) ?? fail('fatal: You are not currently on a branch.')
    const remote = p.pos[0] ?? (await this.getConfig(dir, `branch.${branch}.remote`)) ?? fail(`There is no tracking information for the current branch.\nPlease specify which branch you want to merge with.\n\n    git pull <remote> <branch>\n\nIf you wish to set tracking information for this branch you can do so with:\n\n    git branch --set-upstream-to=origin/${branch} ${branch}\n`)
    const remoteBranch = p.pos[1] ?? (await this.getConfig(dir, `branch.${branch}.merge`))?.replace('refs/heads/', '') ?? branch
    let out = await this.gFetch(dir, [remote!])
    const target = `${remote}/${remoteBranch}`
    if (p.has('--rebase', '-r')) out += await this.gRebase(dir, [target])
    else out += await this.gMerge(dir, p.has('--ff-only') ? [target, '--ff-only'] : [target])
    return out
  }

  private async gClone(args: string[]) {
    const p = parseArgs(args)
    const url = p.pos[0] ?? fail('fatal: You must specify a repository to clone.')
    const name = p.pos[1] ?? basename(url!).replace(/\.git$/, '')
    const target = this.abs(name)
    if (await this.exists(target) && (await this.pfs.readdir(target)).length) fail(`fatal: destination path '${name}' already exists and is not an empty directory.`)
    const rdir = await this.ensureRemoteRepo(url!, false)
    await this.mkdirp(target)
    await git.init({ fs: this.fs, dir: target, defaultBranch: 'main' })
    await this.copyTree(rdir + '/objects', target + '/.git/objects')
    await git.addRemote({ fs: this.fs, dir: target, remote: 'origin', url: url! })
    const branches = await git.listBranches({ fs: this.fs, gitdir: rdir })
    for (const b of branches) await git.writeRef({ fs: this.fs, dir: target, ref: `refs/remotes/origin/${b}`, value: await git.resolveRef({ fs: this.fs, gitdir: rdir, ref: `refs/heads/${b}` }) })
    for (const t of await git.listTags({ fs: this.fs, gitdir: rdir })) await git.writeRef({ fs: this.fs, dir: target, ref: `refs/tags/${t}`, value: await git.resolveRef({ fs: this.fs, gitdir: rdir, ref: `refs/tags/${t}` }) })
    const def = branches.includes('main') ? 'main' : branches[0]
    let out = `Cloning into '${name}'...\n`
    if (def) {
      const oid = await git.resolveRef({ fs: this.fs, dir: target, ref: `refs/remotes/origin/${def}` })
      await git.writeRef({ fs: this.fs, dir: target, ref: `refs/heads/${def}`, value: oid })
      await this.writeText(`${target}/.git/HEAD`, `ref: refs/heads/${def}\n`)
      await git.setConfig({ fs: this.fs, dir: target, path: `branch.${def}.remote`, value: 'origin' })
      await git.setConfig({ fs: this.fs, dir: target, path: `branch.${def}.merge`, value: `refs/heads/${def}` })
      await git.checkout({ fs: this.fs, dir: target, ref: def, force: true })
      const prev = this.cwd
      this.cwd = target
      await this.logHead(target, `clone: from ${url}`)
      this.cwd = prev
    } else out += 'warning: You appear to have cloned an empty repository.\n'
    return out + 'done.\n'
  }

  /* -------------------------------- lesson helpers ----------------------- */
  // `bossgit ...` commands are used by lesson and mission setups to stage
  // a scene, for example a teammate pushing a commit to GitHub.

  private async bossgit(args: string[]): Promise<string> {
    const [sub, ...rest] = args
    if (sub === 'identity') {
      const g = await this.globalConfig()
      if (rest[0] === 'off') { delete g['user.name']; delete g['user.email'] }
      else { g['user.name'] = rest[0] ?? 'Learner'; g['user.email'] = rest[1] ?? 'learner@bossgit.dev' }
      await this.writeText(GLOBAL, JSON.stringify(g))
      return ''
    }
    if (sub === 'github') {
      // bossgit github <url>: create an empty pretend GitHub repository
      await this.ensureRemoteRepo(rest[0], true)
      return C.dim(`Created an empty repository at ${rest[0]}`) + '\n'
    }
    if (sub === 'teammate') {
      // bossgit teammate <url> <file> <text...> : someone else pushes a commit
      const [url, file, ...words] = rest
      const rdir = await this.ensureRemoteRepo(url, false)
      const tmp = '/.bossgit/teammate'
      await this.rmrf(tmp)
      const mate = new Shell(this.fs)
      await mate.mkdirp('/.bossgit')
      mate.cwd = '/.bossgit'
      await mate.run(`git clone ${url} teammate`)
      mate.cwd = tmp
      if (!(await this.headOid(tmp))) await mate.run('git switch -c main')
      const branch = words[0]?.startsWith('--branch=') ? words.shift()!.slice(9) : 'main'
      if (branch !== 'main') await mate.run(`git switch ${branch}`)
      const prev = await mate.readText(tmp + '/' + file).catch(() => '')
      await mate.writeText(tmp + '/' + file, prev + words.join(' ') + '\n')
      await git.add({ fs: this.fs, dir: tmp, filepath: file })
      const author = { name: 'Sam', email: 'sam@team.dev', timestamp: Math.floor(Date.now() / 1000) + 2, timezoneOffset: 0 }
      const oid = await git.commit({ fs: this.fs, dir: tmp, message: `Update ${file}`, author, committer: author })
      await this.copyTree(tmp + '/.git/objects', rdir + '/objects')
      await git.writeRef({ fs: this.fs, gitdir: rdir, ref: `refs/heads/${branch}`, value: oid, force: true })
      await this.rmrf(tmp)
      return C.dim(`Sam pushed a commit to ${branch} on ${url}`) + '\n'
    }
    return fail('bossgit: lesson helper. Try: bossgit identity <name> <email>')
  }

  /* -------------------------------- snapshot ----------------------------- */

  async snapshot(): Promise<Snapshot> {
    const empty: Snapshot = { repo: false, commits: [], branches: {}, remotes: {}, tags: {}, head: {}, staged: [], modified: [], untracked: [], conflicts: [], stash: 0 }
    const dir = await this.findRepo()
    if (!dir) return empty
    const snap = { ...empty, repo: true }
    const tips: string[] = []
    for (const br of await git.listBranches({ fs: this.fs, dir })) {
      const oid = await git.resolveRef({ fs: this.fs, dir, ref: `refs/heads/${br}` }).catch(() => null)
      if (oid) { snap.branches[br] = oid; tips.push(oid) }
    }
    for (const r of await git.listRemotes({ fs: this.fs, dir }).catch(() => [])) {
      for (const br of await git.listBranches({ fs: this.fs, dir, remote: r.remote })) {
        if (br === 'HEAD') continue
        const oid = await git.resolveRef({ fs: this.fs, dir, ref: `refs/remotes/${r.remote}/${br}` }).catch(() => null)
        if (oid) { snap.remotes[`${r.remote}/${br}`] = oid; tips.push(oid) }
      }
    }
    for (const t of await git.listTags({ fs: this.fs, dir })) {
      const oid = await this.resolve(dir, t).catch(() => null)
      if (oid) { snap.tags[t] = oid; tips.push(oid) }
    }
    const head = await this.headOid(dir)
    const detached = await this.isDetached(dir)
    snap.head = detached ? { oid: head ?? undefined } : { branch: await this.branch(dir), oid: head ?? undefined }
    if (head) tips.push(head)
    snap.commits = (await this.commitsFrom(dir, tips, 300)).map(({ oid, commit }) => ({ oid, parents: commit.parent, message: commit.message.split('\n')[0], time: commit.committer.timestamp, author: commit.author.name }))
    const s = await this.state(dir)
    snap.op = s.op?.kind
    snap.conflicts = s.conflicts
    snap.stash = s.stash.length
    for (const [f, h, w, st] of await this.matrix(dir)) {
      if (h === 0 && st === 0) { if (w) snap.untracked.push(f); continue }
      if ((h === 0 && st !== 0) || (h === 1 && st !== 1)) snap.staged.push(f)
      if ((st === 1 && w === 2) || st === 3 || (st !== 0 && w === 0)) snap.modified.push(f)
    }
    return snap
  }

  /** path completion candidates for Tab */
  async complete(partial: string): Promise<string[]> {
    const slash = partial.lastIndexOf('/')
    const base = slash >= 0 ? partial.slice(0, slash + 1) : ''
    const dir = this.abs(base || '.')
    const names = await this.pfs.readdir(dir).catch(() => [] as string[])
    const pre = partial.slice(slash + 1)
    const out: string[] = []
    for (const n of names) if (n.startsWith(pre) && (pre.startsWith('.') || !n.startsWith('.'))) out.push(base + n + ((await this.isDir(dir + '/' + n)) ? '/' : ''))
    return out
  }

  async prompt(): Promise<string> {
    const home = this.cwd === HOME ? '~' : this.cwd.startsWith(HOME + '/') ? '~' + this.cwd.slice(HOME.length) : this.cwd
    const dir = await this.findRepo()
    let br = ''
    if (dir) {
      const s = await this.state(dir)
      const b = await this.branch(dir)
      const head = await this.headOid(dir)
      const name = (await this.isDetached(dir)) ? (head ? short(head) : '?') : b ?? 'main'
      br = ' ' + C.cyan(`(${name}${s.op ? '|' + s.op.kind.toUpperCase() : ''})`)
    }
    return `${C.green(home)}${br} ${C.dim('$')} `
  }
}

const HELP = `${C.bold('BossGit terminal')}
Files:   pwd  ls [-a]  cd <dir>  mkdir <dir>  touch <file>  cat <file>
         echo "text" > file   echo "more" >> file   rm [-r]  mv  cp  tree [-a]
Git:     type ${C.cyan('git help')} for every Git command BossGit understands.
Keys:    ↑ ↓ history,  Tab completes names,  Ctrl+L clears,  Ctrl+C cancels the line.
`

const GIT_HELP = `usage: git <command> [<args>]

${C.bold('start a working area')}
   init       Create an empty Git repository
   clone      Copy a repository into a new folder
${C.bold('work on the current change')}
   add        Add file contents to the staging area
   mv  rm     Move or remove files and tell Git
   restore    Restore files in the working folder or staging area
${C.bold('examine the history and state')}
   status     Show the working tree status
   log        Show commit logs (--oneline, --graph, --all, -n)
   show       Show a commit, or a file at a commit (git show HEAD:file)
   diff       Show changes (--staged for staged changes)
   blame      Show who last changed each line
   reflog     Show every place HEAD has been
${C.bold('grow, mark and tweak your history')}
   commit     Record changes (-m, -a, --amend)
   branch     List, create, rename (-m) or delete (-d) branches
   switch     Switch branches (-c to create)
   checkout   Switch branches or restore files (older command)
   merge      Join two histories together (--abort, --no-ff)
   rebase     Replay commits on top of another base (--continue, --abort)
   reset      Move HEAD (--soft, --mixed, --hard)
   revert     Make a new commit that undoes an old one
   cherry-pick  Copy a commit onto the current branch
   stash      Put changes aside (push, list, pop, apply, drop)
   tag        Create, list or delete tags (-a -m for annotated)
${C.bold('collaborate')}
   remote     Manage remotes (add, -v, remove, rename)
   fetch      Download commits from a remote
   pull       Fetch and merge (--rebase to rebase)
   push       Upload commits (-u, --force-with-lease, --tags, --delete)
${C.bold('look inside')}
   cat-file   Show a raw Git object (-t type, -p print)
   rev-parse  Turn a name like HEAD~2 into a commit id
   config     Get and set options (--global, --list)
`

const GIT_USAGE: Record<string, string> = {
  commit: 'usage: git commit -m "message"  [-a] [--amend]',
  log: 'usage: git log [--oneline] [--graph] [--all] [-n <number>] [<rev>] [-- <file>]',
  reset: 'usage: git reset [--soft | --mixed | --hard] [<commit>]',
  switch: 'usage: git switch <branch>   |   git switch -c <new-branch> [<start>]',
  merge: 'usage: git merge <branch> [--no-ff] | --abort | --continue',
  rebase: 'usage: git rebase <upstream> | --continue | --abort | --skip',
  stash: 'usage: git stash [push [-m <message>] [-u]] | list | pop | apply | drop | show',
}

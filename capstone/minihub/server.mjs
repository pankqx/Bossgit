#!/usr/bin/env node
// MiniHub: a tiny GitHub, for the BossGit capstone. No dependencies, only Node and git (2.38+).
// - Hosts bare repositories in ./repos and speaks Git's smart HTTP protocol, so clone, fetch and push work.
// - Web pages: repo list, files, commits, branches, and "pull requests": compare two branches and merge on the server.
// Run: node server.mjs   then open http://localhost:3000
import http from 'node:http'
import { spawn, execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const PORT = Number(process.env.PORT ?? 3000)
const ROOT = path.resolve(process.env.REPOS ?? 'repos')
fs.mkdirSync(ROOT, { recursive: true })

const git = (repo, ...args) => execFileSync('git', ['--git-dir', path.join(ROOT, repo), ...args], { encoding: 'utf8', maxBuffer: 50e6 })
const tryGit = (repo, ...args) => { try { return git(repo, ...args) } catch { return null } }
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const validName = n => /^[a-z0-9][a-z0-9._-]*$/i.test(n) && !n.includes('..')
const repos = () => fs.readdirSync(ROOT).filter(d => d.endsWith('.git')).map(d => d.slice(0, -4)).sort()
const branches = repo => (tryGit(repo, 'for-each-ref', '--format=%(refname:short)', 'refs/heads') ?? '').split('\n').filter(Boolean)
const defaultBranch = repo => (tryGit(repo, 'symbolic-ref', '--short', 'HEAD') ?? 'main').trim()

function page(title, body) {
  return `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>${esc(title)} · MiniHub</title>
<style>body{font:15px/1.5 system-ui,sans-serif;max-width:960px;margin:0 auto;padding:16px;color:#1f2328}a{color:#0969da;text-decoration:none}
header{display:flex;gap:12px;align-items:center;border-bottom:1px solid #d0d7de;padding-bottom:10px;margin-bottom:16px}header b{font-size:20px}
table{width:100%;border-collapse:collapse}td{border-bottom:1px solid #eaeef2;padding:6px 4px}pre{background:#f6f8fa;padding:12px;overflow:auto;border-radius:6px}
.add{color:#1a7f37}.del{color:#cf222e}.btn{background:#1f883d;color:#fff;border:0;padding:6px 14px;border-radius:6px;font-weight:600;cursor:pointer}
code{background:#f6f8fa;padding:2px 5px;border-radius:4px}.muted{color:#656d76}</style>
<header><b><a href="/">⎇ MiniHub</a></b><span class=muted>${esc(title)}</span></header>${body}`
}

function diffHtml(text) {
  return '<pre>' + esc(text).split('\n').map(l => l.startsWith('+') && !l.startsWith('+++') ? `<span class=add>${l}</span>` : l.startsWith('-') && !l.startsWith('---') ? `<span class=del>${l}</span>` : l).join('\n') + '</pre>'
}

/* ---------- Git smart HTTP: hand the request to `git http-backend` (a CGI program) ---------- */

function gitHttp(req, res, url) {
  const child = spawn('git', ['http-backend'], {
    env: { ...process.env, GIT_PROJECT_ROOT: ROOT, GIT_HTTP_EXPORT_ALL: '1', PATH_INFO: decodeURIComponent(url.pathname),
      REQUEST_METHOD: req.method, QUERY_STRING: url.search.slice(1), CONTENT_TYPE: req.headers['content-type'] ?? '',
      REMOTE_USER: 'minihub', REMOTE_ADDR: req.socket.remoteAddress ?? '', GIT_HTTP_MAX_REQUEST_BUFFER: '100M' },
  })
  req.pipe(child.stdin)
  let head = Buffer.alloc(0), started = false
  child.stdout.on('data', chunk => {
    if (started) return res.write(chunk)
    head = Buffer.concat([head, chunk])
    const end = head.indexOf('\r\n\r\n')
    if (end < 0) return
    let status = 200
    for (const line of head.subarray(0, end).toString().split('\r\n')) {
      const [k, ...v] = line.split(': ')
      if (k.toLowerCase() === 'status') status = parseInt(v.join(': '))
      else res.setHeader(k, v.join(': '))
    }
    res.writeHead(status); started = true
    res.write(head.subarray(end + 4))
  })
  child.stdout.on('end', () => res.end())
  child.stderr.on('data', d => console.error(String(d)))
}

/* ---------- a pull request is a comparison of two branches, merged on the server ---------- */

function merge(repo, base, head) {
  const baseId = git(repo, 'rev-parse', `refs/heads/${base}`).trim()
  const headId = git(repo, 'rev-parse', `refs/heads/${head}`).trim()
  if (tryGit(repo, 'merge-base', '--is-ancestor', headId, baseId) !== null) return { ok: false, msg: 'Nothing to merge: already up to date.' }
  // git merge-tree --write-tree does a real three-way merge without a working folder (Git 2.38+). GitHub merges the same way.
  let tree
  try { tree = git(repo, 'merge-tree', '--write-tree', baseId, headId).split('\n')[0].trim() }
  catch (e) { return { ok: false, msg: 'This branch has conflicts that must be resolved:\n' + String(e.stdout ?? e) } }
  const commit = execFileSync('git', ['--git-dir', path.join(ROOT, repo), 'commit-tree', tree, '-p', baseId, '-p', headId, '-m', `Merge branch '${head}' into ${base}`],
    { encoding: 'utf8', env: { ...process.env, GIT_AUTHOR_NAME: 'MiniHub', GIT_AUTHOR_EMAIL: 'bot@minihub.local', GIT_COMMITTER_NAME: 'MiniHub', GIT_COMMITTER_EMAIL: 'bot@minihub.local' } }).trim()
  git(repo, 'update-ref', `refs/heads/${base}`, commit, baseId)    // only moves if base did not change meanwhile
  return { ok: true, msg: `Merged ${head} into ${base} as ${commit.slice(0, 7)}` }
}

/* ---------- web pages ---------- */

const routes = [
  [/^\/$/, () => page('Repositories', `<form method=post action="/new"><input name=name placeholder="new-repo" required pattern="[A-Za-z0-9._-]+"> <button class=btn>New repository</button></form>
    <table>${repos().map(r => `<tr><td><a href="/${r}">${esc(r)}</a></td><td class=muted>${esc(tryGit(r + '.git', 'log', '-1', '--format=%s · %ar', '--all') ?? 'empty')}</td></tr>`).join('')}</table>`)],
  [/^\/([^/]+)$/, (r) => {
    const repo = r + '.git', br = defaultBranch(repo)
    if (!branches(repo).length) return page(r, `<p>This repository is empty. Push to it:</p><pre>git remote add hub http://localhost:${PORT}/${r}.git\ngit push -u hub main</pre>`)
    const files = git(repo, 'ls-tree', '--name-only', br).split('\n').filter(Boolean)
    const readme = files.find(f => /^readme/i.test(f))
    return page(r, `<p>Branches: ${branches(repo).map(b => `<a href="/${r}/commits/${b}">${esc(b)}</a>`).join(' · ')} · <a href="/${r}/pulls">Pull requests</a></p>
      <p class=muted>Clone: <code>git clone http://localhost:${PORT}/${r}.git</code></p>
      <table>${files.map(f => `<tr><td><a href="/${r}/blob/${br}/${f}">${esc(f)}</a></td></tr>`).join('')}</table>
      ${readme ? `<h3>${esc(readme)}</h3><pre>${esc(git(repo, 'show', `${br}:${readme}`))}</pre>` : ''}`)
  }],
  [/^\/([^/]+)\/blob\/([^/]+)\/(.+)$/, (r, rev, file) => page(`${r} / ${file}`, `<pre>${esc(tryGit(r + '.git', 'show', `${rev}:${file}`) ?? 'Not found')}</pre>`)],
  [/^\/([^/]+)\/commits\/([^/]+)$/, (r, rev) => page(`${r} commits on ${rev}`, `<table>${git(r + '.git', 'log', '--format=%H%x09%s%x09%an%x09%ar', '-50', rev).split('\n').filter(Boolean).map(l => { const [id, s, a, t] = l.split('\t'); return `<tr><td><a href="/${r}/commit/${id}"><code>${id.slice(0, 7)}</code></a></td><td>${esc(s)}</td><td class=muted>${esc(a)}, ${esc(t)}</td></tr>` }).join('')}</table>`)],
  [/^\/([^/]+)\/commit\/([0-9a-f]{7,40})$/, (r, id) => page(`${r} ${id.slice(0, 7)}`, diffHtml(git(r + '.git', 'show', '--format=%H%n%an <%ae>%n%ad%n%n%B', id)))],
  [/^\/([^/]+)\/pulls$/, (r) => {
    const repo = r + '.git', base = defaultBranch(repo)
    const open = branches(repo).filter(b => b !== base && Number(git(repo, 'rev-list', '--count', `${base}..${b}`)) > 0)
    return page(`${r} pull requests`, open.length ? `<table>${open.map(b => `<tr><td><a href="/${r}/compare/${base}...${b}">${esc(b)} → ${esc(base)}</a></td><td class=muted>${git(repo, 'rev-list', '--count', `${base}..${b}`).trim()} commits</td></tr>`).join('')}</table>` : '<p>No open pull requests. Push a branch with new commits.</p>')
  }],
  [/^\/([^/]+)\/compare\/([^/.]+)\.\.\.([^/]+)$/, (r, base, head) => {
    const repo = r + '.git'
    const commits = git(repo, 'log', '--format=%h %s', `${base}..${head}`)
    return page(`${r}: ${head} → ${base}`, `<h3>${esc(commits.split('\n').filter(Boolean).length)} commits</h3><pre>${esc(commits)}</pre>
      <form method=post action="/${r}/merge"><input type=hidden name=base value="${esc(base)}"><input type=hidden name=head value="${esc(head)}"><button class=btn>Merge pull request</button></form>
      <h3>Files changed</h3>${diffHtml(git(repo, 'diff', `${base}...${head}`))}`)
  }],
]

async function body(req) { let s = ''; for await (const c of req) s += c; return new URLSearchParams(s) }

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x')
  try {
    if (/\.git(\/|$)/.test(url.pathname)) return gitHttp(req, res, url)
    if (req.method === 'POST' && url.pathname === '/new') {
      const name = (await body(req)).get('name')
      if (!validName(name)) throw new Error('Bad repository name')
      execFileSync('git', ['init', '--bare', '-q', '-b', 'main', path.join(ROOT, name + '.git')])
      git(name + '.git', 'config', 'http.receivepack', 'true')   // allow push over HTTP
      res.writeHead(303, { location: '/' + name }); return res.end()
    }
    const m = url.pathname.match(/^\/([^/]+)\/merge$/)
    if (req.method === 'POST' && m) {
      const f = await body(req), out = merge(m[1] + '.git', f.get('base'), f.get('head'))
      res.writeHead(200, { 'content-type': 'text/html' }); return res.end(page('Merge', `<pre>${esc(out.msg)}</pre><a href="/${m[1]}">Back to ${esc(m[1])}</a>`))
    }
    for (const [re, fn] of routes) {
      const hit = decodeURIComponent(url.pathname).match(re)
      if (hit && (hit[1] === undefined || repos().includes(hit[1]) || re.source === '^\\/$')) {
        res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); return res.end(fn(...hit.slice(1)))
      }
    }
    res.writeHead(404); res.end(page('Not found', '<p>Nothing here.</p>'))
  } catch (e) {
    res.writeHead(500, { 'content-type': 'text/html' }); res.end(page('Error', `<pre>${esc(e.message)}</pre>`))
  }
}).listen(PORT, () => console.log(`MiniHub on http://localhost:${PORT} (repos in ${ROOT})`))

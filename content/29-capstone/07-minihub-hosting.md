---
title: "Part 6: MiniHub, a server that hosts repositories"
minutes: 35
---

Now the other half: **GitHub**. At its heart, a Git host is three things: a folder of **bare repositories**, a way for Git clients to **push and fetch**, and **web pages** on top.

## Bare repositories

A bare repo is just the `.git` folder, with no working files. Servers use them because nobody edits files there.

```bash
git init --bare repos/shop.git
git --git-dir repos/shop.git config http.receivepack true    # allow pushes over HTTP
```

## Speaking Git over HTTP

You do not have to implement Git's network protocol yourself. Git ships a program for servers: **`git http-backend`**. It is a CGI program: you give it the request through environment variables and standard input, and it writes the response (headers, blank line, body) to standard output.

```js
import { spawn } from 'node:child_process'

function gitHttp(req, res, url) {
  const child = spawn('git', ['http-backend'], {
    env: {
      ...process.env,
      GIT_PROJECT_ROOT: ROOT,               // the folder with repos/*.git
      GIT_HTTP_EXPORT_ALL: '1',
      PATH_INFO: decodeURIComponent(url.pathname),   // /shop.git/info/refs
      REQUEST_METHOD: req.method,
      QUERY_STRING: url.search.slice(1),    // service=git-upload-pack
      CONTENT_TYPE: req.headers['content-type'] ?? '',
      REMOTE_USER: 'minihub',
    },
  })
  req.pipe(child.stdin)
  // parse "Status: 200 OK" and other CGI headers until \r\n\r\n, then stream the body to res
}
```

The full version, with header parsing, is in `capstone/minihub/server.mjs`. With about 30 lines, real Git can clone from and push to **your** server:

```bash
node server.mjs                                       # MiniHub on http://localhost:3000
git remote add hub http://localhost:3000/shop.git
git push -u hub main
git clone http://localhost:3000/shop.git copy
```

## The conversation you are hosting

1. `GET /shop.git/info/refs?service=git-upload-pack`: "which refs do you have?"
2. `POST /shop.git/git-upload-pack`: wants and haves, then the server sends a pack (fetch and clone).
3. `POST /shop.git/git-receive-pack`: the client sends a pack and ref updates (push).

That is the protocol from module 25, now running on a server you wrote.

## Web pages: let Git do the reading

For the pages, call Git's plumbing with `execFileSync` (never build a shell string from user input):

```js
const git = (repo, ...args) => execFileSync('git', ['--git-dir', path.join(ROOT, repo), ...args], { encoding: 'utf8' })

git('shop.git', 'for-each-ref', '--format=%(refname:short)', 'refs/heads')   // branches
git('shop.git', 'ls-tree', '--name-only', 'main')                             // files
git('shop.git', 'show', 'main:README.md')                                     // a file's content
git('shop.git', 'log', '--format=%H%x09%s%x09%an%x09%ar', '-50', 'main')       // commits
```

```warn
Security matters even in a toy. Validate repository names (`/^[a-z0-9._-]+$/i`, no `..`), escape every value you put into HTML, and use `execFileSync` with an argument array so nobody can inject shell commands. Real GitHub spends enormous effort on exactly these problems.
```

```quiz
q: Why do Git servers use bare repositories?
- They are encrypted
- [x] Nobody works in them, so they need no working files
why: A bare repo is only the object database and refs.

q: Which Git program lets a web server handle clone, fetch and push over HTTP?
- git daemon
- [x] git http-backend
why: http-backend implements the smart HTTP protocol as a CGI program.
```

---
title: "Part 5: prove it works with real Git"
minutes: 20
---

Professional software is **tested**. For minigit, the best test oracle in the world is free: real Git.

## An automated compatibility test

```js
// test/compat.test.mjs  (run with: node --test)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const MINI = path.resolve('minigit.mjs')
const run = (dir, cmd, ...args) => execFileSync(cmd, args, { cwd: dir, encoding: 'utf8' }).trim()

test('blob ids match real git', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mg-'))
  fs.writeFileSync(path.join(dir, 'a.txt'), 'héllo wörld\n')         // non-ASCII on purpose
  run(dir, 'node', MINI, 'init')
  assert.equal(run(dir, 'node', MINI, 'hash-object', 'a.txt'), run(dir, 'git', 'hash-object', 'a.txt'))
})

test('a minigit repository passes git fsck and git log', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mg-'))
  run(dir, 'node', MINI, 'init')
  fs.mkdirSync(path.join(dir, 'src'))
  fs.writeFileSync(path.join(dir, 'src/app.js'), 'run()\n')
  fs.writeFileSync(path.join(dir, 'README.md'), '# hi\n')
  run(dir, 'node', MINI, 'add', '.')
  run(dir, 'node', MINI, 'commit', '-m', 'First')
  run(dir, 'git', 'fsck', '--full', '--strict')                        // throws if invalid
  assert.match(run(dir, 'git', 'log', '--oneline'), /First/)
})
```

## Add CI

```yaml
# .github/workflows/test.yml
name: test
on: [push, pull_request]
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: node --test
```

Windows will probably fail first: paths use `\`, and Git paths always use `/`. Fixing that is a real cross-platform bug, and a great story for interviews.

## Edge cases worth a test each

- An empty file. A file with no trailing newline. A binary file (an image).
- A file and a folder with similar names (`lib`, `lib.txt`): the sort rule.
- Deeply nested folders. A file deleted between commits.
- Commit messages with Unicode and several lines.

```quiz
q: What is the best test oracle for minigit?
- Manual checking
- [x] Real Git, through git hash-object, git write-tree, git fsck and git log
why: If real Git agrees with your output, minigit is correct.

q: Why add Windows to the CI matrix?
- It is required by GitHub
- [x] Path separators and line endings expose real cross-platform bugs
why: Git always uses /, Windows uses \. Tests catch the mismatch.
```

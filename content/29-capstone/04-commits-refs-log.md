---
title: "Part 3: commits, refs and log"
minutes: 30
---

A commit object is plain text:

```
tree 8b624018b5cd516479c87c15ad6004aa8380ca78
parent c8e8a8bbaccd7d1012266fe823387c3055b99349
author K S Pankaj <pank@example.com> 1794560499 +0530
committer K S Pankaj <pank@example.com> 1794560499 +0530

Add the cart page
```

The first commit has no `parent` line. A merge has two. The timestamp is **seconds since 1970** and the time zone is `+HHMM`.

## commit

```js
function commit(message) {
  const index = readIndex()
  const tree = writeTree(index)
  const parent = resolve('HEAD')                               // null for the first commit
  const me = `${name} <${email}> ${Math.floor(Date.now() / 1000)} ${timezone()}`
  const body = `tree ${tree}\n${parent ? `parent ${parent}\n` : ''}author ${me}\ncommitter ${me}\n\n${message}\n`
  const id = hashObject('commit', Buffer.from(body), true)
  updateRef(headRef(), id)                                     // move the current branch
  return id
}
```

## Refs

- `.git/HEAD` contains `ref: refs/heads/main`.
- `.git/refs/heads/main` contains a commit id and a newline. It does not exist until the first commit.

```js
const headRef = () => {
  const h = fs.readFileSync(path.join(GIT, 'HEAD'), 'utf8').trim()
  return h.startsWith('ref: ') ? h.slice(5) : null             // null = detached HEAD
}
function resolve(ref) {                                         // name → commit id
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
```

## log: walk the parents

```js
function log(start = 'HEAD') {
  for (let id = resolve(start); id;) {
    const c = parseCommit(readObject(id).body)
    console.log(`commit ${id}\nAuthor: ${c.author.replace(/ \d+ [+-]\d{4}$/, '')}\n\n    ${c.message.trim()}\n`)
    id = c.parents[0]                                           // first parent only, like --first-parent
  }
}
```

## The big test

```bash
node minigit.mjs add .
node minigit.mjs commit -m "First commit"
echo more >> hello.txt
node minigit.mjs add hello.txt
node minigit.mjs commit -m "Second commit"

git log --oneline        # REAL Git shows your two commits
git fsck --full          # no errors: your repository is valid
git show HEAD            # real Git computes a diff between your trees
```

When `git fsck` is silent and `git log` shows your commits, tag it: `git tag -a v0.2.0 -m "minigit can commit"`.

```tip
Read the author name and email from `.git/config` and `~/.gitconfig` like real Git does. It is a nice little INI parser exercise, and your commits will show your real name.
```

```quiz
q: How does minigit know the parent of a new commit?
- It asks the user
- [x] It resolves HEAD to the current commit id
why: The commit HEAD points to (through the branch) becomes the parent.

q: What does committing actually change in .git/refs?
- Nothing
- [x] The current branch's file now holds the new commit id
why: Moving the branch is the last step of every commit.
```

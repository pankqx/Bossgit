---
title: "Part 4: branches, switch and status"
minutes: 30
---

## branch: write one file

A branch is a file containing a commit id. That is it:

```js
function branch(name) {
  updateRef(`refs/heads/${name}`, resolve('HEAD'))
}
```

## switch: make the folder match another commit

1. Read the target commit's tree into a flat map `path → blob id`.
2. Delete files that are tracked now but not in the target.
3. Write every file of the target.
4. Replace the index with the target's files.
5. Point HEAD at the branch.

```js
function treeFiles(treeId, prefix = '', out = new Map()) {
  for (const e of parseTree(readObject(treeId).body)) {
    if (e.mode === '40000') treeFiles(e.id, prefix + e.name + '/', out)
    else out.set(prefix + e.name, e.id)
  }
  return out
}

function switchTo(name) {
  const id = resolve(`refs/heads/${name}`)
  const target = treeFiles(parseCommit(readObject(id).body).tree)
  for (const f of headFiles().keys()) if (!target.has(f)) fs.rmSync(f, { force: true })
  for (const [f, blob] of target) {
    fs.mkdirSync(path.dirname(f), { recursive: true })
    fs.writeFileSync(f, readObject(blob).body)
  }
  writeIndex(target)
  fs.writeFileSync(path.join(GIT, 'HEAD'), `ref: refs/heads/${name}\n`)
}
```

```warn
Real Git refuses to switch if it would overwrite uncommitted changes. The reference minigit does not check. Add that safety check yourself: compare each file on disk with the index before overwriting it.
```

## status: compare three things

| Compare | Shows |
|---|---|
| index vs HEAD's tree | **Changes to be committed** |
| working folder vs index | **Changes not staged** |
| files on disk not in the index | **Untracked** |

```js
const staged    = [...index].filter(([f, id]) => headTree.get(f) !== id)
const modified  = [...index.keys()].filter(f => fs.existsSync(f) && hashObject('blob', fs.readFileSync(f)) !== index.get(f))
const untracked = allFilesOnDisk.filter(f => !index.has(f))
```

This is exactly what `git status` does, plus caching file timestamps so it does not re-hash every file every time. That cache is a big part of what lives in the real `.git/index`.

## Test

```bash
node minigit.mjs branch feature
echo "on main" > main-only.txt && node minigit.mjs add main-only.txt && node minigit.mjs commit -m "Main only"
node minigit.mjs switch feature
ls                                   # main-only.txt is gone
git log --oneline --all              # real Git sees both branches
```

```quiz
q: What does minigit branch feature write?
- A copy of all files
- [x] One file, refs/heads/feature, with the current commit id
why: Branches are just names for commits.

q: Which comparison finds "Changes to be committed"?
- Working folder vs index
- [x] Index vs HEAD's tree
why: Staged changes are the difference between what will be committed and what was last committed.
```

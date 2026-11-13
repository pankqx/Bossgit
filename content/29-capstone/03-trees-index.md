---
title: "Part 2: the staging area and trees"
minutes: 30
---

A **tree** is a folder listing. Its body is a series of entries, each:

```
<mode> <name>\0<20 raw bytes of the id>
```

Modes: `100644` normal file, `100755` executable, `40000` folder (tree), `120000` symlink. The id is **raw binary**, not hex: 20 bytes, not 40 characters.

## The staging area

Real Git stores the index in a binary file, `.git/index`. To keep minigit small, store it as JSON: a map from path to blob id. (Stretch goal at the end: write the real binary format.)

```js
const INDEX = () => path.join(GIT, 'minigit-index.json')
const readIndex = () => new Map(fs.existsSync(INDEX()) ? Object.entries(JSON.parse(fs.readFileSync(INDEX(), 'utf8'))) : [])
const writeIndex = m => fs.writeFileSync(INDEX(), JSON.stringify(Object.fromEntries([...m].sort())))

function add(files) {
  const index = readIndex()
  for (const f of files) {
    if (fs.existsSync(f)) index.set(f, hashObject('blob', fs.readFileSync(f), true))
    else index.delete(f)                         // "git add" of a deleted file stages the deletion
  }
  writeIndex(index)
}
```

## write-tree: from a flat list to nested trees

`{ "README.md": id1, "src/app.js": id2 }` must become a root tree with `README.md` and a `src` tree.

```js
const sortKey = e => e.mode === '40000' ? e.name + '/' : e.name   // Git's sort rule for folders

function writeTree(files) {
  const here = new Map(), subdirs = new Map()
  for (const [p, id] of files) {
    const [first, ...rest] = p.split('/')
    if (rest.length) {
      if (!subdirs.has(first)) subdirs.set(first, new Map())
      subdirs.get(first).set(rest.join('/'), id)
    } else here.set(first, id)
  }
  const entries = [
    ...[...here].map(([name, id]) => ({ mode: '100644', name, id })),
    ...[...subdirs].map(([name, m]) => ({ mode: '40000', name, id: writeTree(m) })),   // recursion
  ]
  entries.sort((a, b) => (sortKey(a) < sortKey(b) ? -1 : 1))
  const body = Buffer.concat(entries.map(e =>
    Buffer.concat([Buffer.from(`${e.mode} ${e.name}\0`), Buffer.from(e.id, 'hex')])))
  return hashObject('tree', body, true)
}
```

## The sneaky sort rule

Git sorts entries by name **as if folder names ended in `/`**. So a file `app.js` and a folder `app` sort as `app.js` < `app/`. Get this wrong and your tree id differs from Git's only in repos with such names, which is a nasty bug to find.

## Test it

```bash
mkdir src && echo "run()" > src/app.js
node minigit.mjs add hello.txt src/app.js
node minigit.mjs write-tree           # prints a tree id

git add hello.txt src/app.js          # in the same folder, real Git...
git write-tree                        # ...must print the SAME id
git cat-file -p <tree-id>             # 100644 blob ...  hello.txt / 040000 tree ...  src
```

```quiz
q: How is the id stored inside a tree entry?
- As 40 hex characters
- [x] As 20 raw bytes
why: Trees store binary ids to save space.

q: A folder named lib and a file named lib.txt. In which order do they appear in the tree?
- lib, then lib.txt
- [x] lib.txt, then lib (because lib sorts as lib/)
why: Git compares folder names with a trailing slash, and "." comes before "/".
```

---
title: "Part 1: blobs, hashing and the object store"
minutes: 25
---

Every Git object is stored the same way:

```
"<type> <size>\0<content>"   →   SHA-1 hash = the id   →   zlib-compress   →   .git/objects/ab/cdef...
```

## Step 1: `minigit init`

Create exactly the folders real Git expects:

```js
import fs from 'node:fs'
import path from 'node:path'

function init() {
  const g = path.join(process.cwd(), '.git')
  for (const d of ['objects', 'refs/heads', 'refs/tags']) fs.mkdirSync(path.join(g, d), { recursive: true })
  fs.writeFileSync(path.join(g, 'HEAD'), 'ref: refs/heads/main\n')
  fs.writeFileSync(path.join(g, 'config'), '[core]\n\trepositoryformatversion = 0\n\tbare = false\n')
}
```

## Step 2: hash and store an object

```js
import { createHash } from 'node:crypto'
import { deflateSync, inflateSync } from 'node:zlib'

export function hashObject(type, body, write = false) {
  const data = Buffer.concat([Buffer.from(`${type} ${body.length}\0`), body])
  const id = createHash('sha1').update(data).digest('hex')
  if (write) {
    const file = path.join(GIT, 'objects', id.slice(0, 2), id.slice(2))
    if (!fs.existsSync(file)) {                      // same content = same id = stored once
      fs.mkdirSync(path.dirname(file), { recursive: true })
      fs.writeFileSync(file, deflateSync(data))
    }
  }
  return id
}
```

Note `body.length` is the length in **bytes**, which is why `body` is a Buffer, not a string. "é" is 2 bytes.

## Step 3: read it back

```js
export function readObject(id) {
  const data = inflateSync(fs.readFileSync(path.join(GIT, 'objects', id.slice(0, 2), id.slice(2))))
  const nul = data.indexOf(0)
  const [type] = data.subarray(0, nul).toString().split(' ')
  return { type, body: data.subarray(nul + 1) }
}
```

## Test it against real Git

```bash
echo hello > hello.txt
node minigit.mjs hash-object -w hello.txt     # ce013625030ba8dba906f756967f9e9ca394464a
git hash-object hello.txt                     # must print the SAME id
git cat-file -p ce01362                       # real Git reads YOUR object: "hello"
node minigit.mjs cat-file -p ce01362
```

If the ids match, you have just written the core of Git. Commit: `feat: blob objects with hash-object and cat-file`.

```warn
The most common bug: forgetting the `\0` after the size, or using the string length instead of the byte length. The id will be different from Git's.
```

```quiz
q: What exactly is hashed to make a blob's id?
- Only the file content
- [x] The header "blob <size>\0" followed by the content
why: The type and size header is part of the hashed data.

q: Where is the object with id ce013625... stored?
- .git/objects/ce013625...
- [x] .git/objects/ce/013625...
why: The first two hex characters become a folder name.
```

---
title: Blobs, trees, commits and tags
minutes: 11
setup: mkdir app && cd app && git init -q && echo "hello" > a.txt && mkdir src && echo "run()" > src/main.js && git add . && git commit -q -m "First" && git tag -a v1 -m "Version 1"
---

Git stores everything as **four kinds of object**. Once you see them, every Git command makes sense.

```flow
flowchart TD
  T[tag v1] --> C[commit]
  C --> TR[tree: root folder]
  TR --> B1[blob: a.txt]
  TR --> TR2[tree: src/]
  TR2 --> B2[blob: main.js]
  C -.parent.-> P[previous commit]
```

| Object | Is | Holds |
|---|---|---|
| **blob** | a file's content | just the bytes, no name |
| **tree** | a folder | a list of names, each pointing to a blob or another tree |
| **commit** | a snapshot | one root tree, parent commit(s), author, committer, message |
| **tag** (annotated) | a label | a pointer to a commit, tagger, message |

## Walk down from a commit

```try
git cat-file -t HEAD
git cat-file -p HEAD
```

The commit points at a **tree**. Copy that tree id, or use `ls-tree`:

```try
git ls-tree HEAD
```

Each line is `mode type id name`. `a.txt` is a blob. `src` is a tree. Read the blob:

```try
git show HEAD:a.txt
git cat-file -t v1
git cat-file -p v1
```

## The big idea: snapshots, not diffs

A commit does **not** store "what changed". It stores the **whole project** as a tree. Unchanged files point to the **same** blob as before, so nothing is duplicated. Diffs are calculated when you ask for them.

```fact
Because a blob has no name, renaming a file without changing it costs nothing. The new tree points at the same blob. Git detects renames afterwards by comparing content.
```

```quiz
q: Where is a file's name stored?
- In the blob
- [x] In the tree that contains it
why: Blobs are pure content. Trees map names to blobs.

q: You commit without changing README.md. Is README.md stored again?
- Yes, every commit copies every file
- [x] No, the new tree points at the same blob
why: Identical content has the same id, so it is stored once.
```

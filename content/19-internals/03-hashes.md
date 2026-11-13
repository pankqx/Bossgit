---
title: Hashes and why they matter
minutes: 8
setup: mkdir app && cd app && git init -q && echo "hello" > a.txt && echo "hello" > b.txt && echo "Hello" > c.txt
---

Every object's id is a **hash** of its content: a 40-character fingerprint made with SHA-1. Same content, same id, on every computer in the world.

```try
git hash-object a.txt
git hash-object b.txt
git hash-object c.txt
```

`a.txt` and `b.txt` have the same content, so the same id. `c.txt` differs by one capital letter, and the id is completely different. That is how a good hash behaves.

## What Git really hashes

For a blob, Git hashes a small header plus the content: `blob <size>\0<content>`. That is why the id of "hello" is always `ce01362...`, in every repository on Earth.

## Why this design is brilliant

- **Integrity.** If one bit of a file or commit changes (disk error, tampering), its id changes, and so does every commit after it. `git fsck` notices instantly.
- **History cannot be quietly rewritten.** A commit's id covers its tree **and its parent**. Changing an old commit changes every id after it. That is why rebased commits get new ids.
- **No duplicates.** Same content is stored once.
- **Fast comparisons.** Two folders have the same id? They are identical. Git does not need to look inside.

```bash
git rev-parse HEAD          # full id
git rev-parse --short HEAD  # short id, unique in this repo (usually 7+ characters)
```

```fact
SHA-1 was shown to be breakable in 2017 (the "SHAttered" attack). Git added collision detection right away, and since Git 2.29 supports SHA-256 repositories. Module 25 covers the transition.
```

```quiz
q: Two different repositories each have a file containing exactly "hello\n". Do the blobs have the same id?
- [x] Yes
- No
why: The id depends only on content, so it is the same everywhere.

q: Why does changing an old commit change the ids of all later commits?
- Git renumbers them
- [x] Each commit's content includes its parent's id
why: A new parent id means new content, so a new hash, all the way up the chain.
```

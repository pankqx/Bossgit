---
title: A tour of the .git folder
minutes: 8
setup: mkdir app && cd app && git init -q && echo "hello" > a.txt && git add . && git commit -q -m "First" && git branch feature && git tag v1
---

Your whole repository, every commit ever made, lives in one hidden folder: `.git`. Delete it and the project is just files again. Copy it and you have copied the entire history.

```try
ls -a
ls .git
cat .git/HEAD
```

## What is inside

| Path | What it holds |
|---|---|
| `HEAD` | Where you are: usually `ref: refs/heads/main` |
| `config` | This repository's settings (the "local" level) |
| `objects/` | **Every** file version, folder listing, commit and tag, compressed |
| `refs/heads/` | One tiny file per **branch**, holding a commit id |
| `refs/tags/` | One file per **tag** |
| `refs/remotes/` | Your memory of the remote's branches (`origin/main`) |
| `index` | The **staging area**, as a binary file |
| `logs/` | The **reflog** |
| `hooks/` | Scripts Git can run on events (module 24) |
| `packed-refs` | Many refs packed into one file, for speed |
| `ORIG_HEAD`, `FETCH_HEAD`, `MERGE_HEAD` | Temporary markers used by reset, fetch and merge |

```try
ls .git/refs/heads
cat .git/refs/heads/main
git rev-parse main
```

A branch really is just a 41-byte text file with a commit id inside. That is why creating one is instant.

```fact
In a real repo, `git count-objects -vH` shows how many objects there are and how much disk they use.
```

```warn
Do not edit files inside `.git` by hand in a real project. Use Git commands. Looking is safe; changing can corrupt the repository.
```

```quiz
q: What is inside .git/refs/heads/main?
- The files of the main branch
- [x] The id of the commit main points at
why: A branch is a pointer, stored as a tiny file with one commit id.

q: What does .git/HEAD usually contain?
- A commit message
- [x] ref: refs/heads/<current branch>
why: HEAD normally points at a branch name, not a commit.
```

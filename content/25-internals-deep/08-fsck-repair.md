---
title: Repairing a corrupted repository with fsck
minutes: 9
setup: mkdir app && cd app && git init -q && echo "v1" > app.txt && git add . && git commit -q -m "v1" && echo "v2" > app.txt && git commit -q -am "v2" && echo "v3" > app.txt && git commit -q -am "v3" && git update-ref refs/heads/main HEAD~2
---

Corruption is rare, but it happens: a laptop dies mid-write, a disk fails, a sync tool like Dropbox or OneDrive copies half of `.git`, or a script writes a bad ref. **Never keep a Git repo inside a sync folder.**

## Step 1: diagnose

```bash
git fsck --full
```

| Message | Meaning |
|---|---|
| `dangling commit abc123` | Not a problem: an unreachable commit (old amend, deleted branch) |
| `missing blob abc123` | An object a tree needs is gone: **real damage** |
| `error: object file ... is empty` | A truncated loose object |
| `bad ref` / `refs/heads/x: invalid sha1 pointer` | A ref points at nothing |

## Step 2: repair, from easiest to hardest

1. **Re-fetch from a remote.** GitHub or a teammate has the objects:
   ```bash
   git fetch origin
   ```
2. **Copy the missing object** from another clone: `git cat-file -p <id>` there, or copy the pack.
3. **Remove empty loose objects** shown by fsck, then fetch again.
4. **Fix a bad ref** with the reflog: `git reflog show main`, then `git update-ref refs/heads/main <good-id>`.
5. **Last resort:** clone fresh and copy your uncommitted files over.

```tip
Before any repair, copy the whole folder: `cp -r app app-backup`. Then experiment on the copy.
```

## Try it: a ref was clobbered

A broken script moved `main` two commits back. `git log` "lost" v2 and v3.

```try
git log --oneline
git reflog
```

```quiz
q: fsck reports "dangling commit". Is the repository damaged?
- [x] No, it is just an unreachable commit
- Yes, re-clone now
why: Dangling objects are normal leftovers of amends and rebases.

q: fsck reports "missing blob". What is the easiest fix?
- Delete .git
- [x] Fetch from a remote or copy the object from another clone
why: Any complete copy of the repo has the object.
```

```mission
title: The Corrupted Repository
boss: true
goal: A broken script moved `main` back to `v1`, and your files show `v1`. Repair the repository so `main` points at the `v3` commit again and the files match it. (Hint: the reflog still knows.)
setup: mkdir app && cd app && git init -q && echo "v1" > app.txt && git add . && git commit -q -m "v1" && echo "v2" > app.txt && git commit -q -am "v2" && echo "v3" > app.txt && git commit -q -am "v3" && git reset -q --hard HEAD~2
check: head main
check: exactcommits 3
check: message v3
check: contains app.txt v3
check: clean
hint: git reflog lists the v3 commit.
hint: git reset --hard HEAD@{1}
solve: git reset --hard HEAD@{1}
```

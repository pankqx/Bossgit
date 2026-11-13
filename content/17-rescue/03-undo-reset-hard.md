---
title: Undoing a bad reset --hard
minutes: 6
setup: mkdir notes && cd notes && git init -q && echo "a" > n.txt && git add . && git commit -q -m "A" && echo "b" >> n.txt && git commit -q -am "B" && echo "c" >> n.txt && git commit -q -am "C"
---

`git reset --hard` is scary because it changes three things at once: the branch, the staging area and your files. But for **committed** work, it is fully reversible.

```try
git reset --hard HEAD~2
git log --oneline
git reflog -3
git reset --hard ORIG_HEAD
git log --oneline
```

## ORIG_HEAD

Before "dangerous" moves (`reset`, `merge`, `rebase`), Git saves where HEAD was in a special name: **ORIG_HEAD**. So right after a bad reset or merge, `git reset --hard ORIG_HEAD` undoes it. After that, use the reflog, because ORIG_HEAD is overwritten by the next such command.

## What is really lost

| Before the reset | After `reset --hard` | Recoverable? |
|---|---|---|
| Committed | Branch moved back | **Yes**: reflog or ORIG_HEAD |
| Staged, not committed | Gone from your folder | **Usually**: `git fsck --lost-found` finds the blobs (file contents without names) |
| Never staged | Gone | **No** |

```bash
git fsck --lost-found       # writes dangling blobs into .git/lost-found/other/
```

```tip
Commit early, commit often, even "wip" commits on a branch. A commit is a safety net. You can always squash later.
```

```quiz
q: Right after a bad merge, what is the fastest undo?
- git revert HEAD
- [x] git reset --hard ORIG_HEAD
why: ORIG_HEAD holds where HEAD was before the merge. (If it was already pushed, revert instead.)

q: You staged a file but never committed, then ran reset --hard. Is it gone forever?
- Yes, always
- [x] Not always: git fsck --lost-found may find its contents
why: git add stores the file content as a blob, which stays until garbage collection.
```

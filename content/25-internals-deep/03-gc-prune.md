---
title: git gc, prune and unreachable objects
minutes: 7
---

An object is **reachable** if you can get to it from a ref (a branch, tag, remote branch, stash) or from the **reflog**. Everything else is **unreachable**: the old commits after an amend, a rebase or a deleted branch.

```flow
flowchart LR
  M((main)) --> C3 --> C2 --> C1
  R[reflog entry] --> X["old commit (amended away)"]
  U["dangling commit: nothing points here"]
```

## What gc does

`git gc` (garbage collection):

1. Packs loose objects.
2. Packs refs into `packed-refs`.
3. Expires old **reflog** entries (90 days, or 30 for unreachable commits).
4. **Prunes** unreachable objects older than 2 weeks (`gc.pruneExpire`).

So a commit you lost is safe for at least 2 weeks, and usually 30 to 90 days, **if** it is in the reflog.

```bash
git fsck --unreachable --no-reflogs   # list objects nothing points to
git fsck --lost-found                 # copy dangling commits/blobs into .git/lost-found
git reflog expire --expire=now --all  # DANGER: forget the reflog
git gc --prune=now                    # DANGER: delete unreachable objects now
```

```warn
The two "DANGER" lines together make a lost commit **truly gone**. People run them after removing secrets with filter-repo, to make sure the old objects are deleted locally. Never run them while you still need to recover something.
```

```fact
On GitHub, unreachable objects can stay on the server for a long time, and old PR refs (`refs/pull/42/head`) keep commits alive. That is why a leaked secret needs rotating, and sometimes GitHub Support, not just a force push.
```

```quiz
q: You amended a commit an hour ago. Is the old version still recoverable?
- No
- [x] Yes, it is in the reflog, and gc will not prune it for weeks
why: Reflog entries keep it reachable until they expire.

q: Which objects does git gc prune?
- All old commits
- [x] Unreachable objects older than the prune expiry (2 weeks by default)
why: Reachable history is never deleted by gc.
```

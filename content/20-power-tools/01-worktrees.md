---
title: Worktrees
minutes: 8
---

You are deep in a feature with 20 changed files. A teammate asks you to review their PR, and you need to **run** it. Stash, switch, install, test, switch back, unstash... or use a **worktree**.

A worktree is **a second working folder attached to the same repository**. Each folder has its own branch checked out, but they share one `.git` with all the history.

```bash
git worktree add ../shop-review feat/riya-search    # new folder, on that branch
cd ../shop-review && npm ci && npm test
cd ../shop
git worktree list
git worktree remove ../shop-review
```

```flow
flowchart LR
  G[(one .git: all commits)] --- A["shop/ on feat/my-work"]
  G --- B["shop-review/ on feat/riya-search"]
  G --- C["shop-hotfix/ on hotfix/login"]
```

## Why seniors love it

- **No stashing.** Your half-done work stays exactly where it is.
- **Run two versions side by side**: the old and new build, for comparing performance.
- **Long builds** in one folder while you keep coding in another.
- **AI coding agents** and parallel tasks: each one gets its own worktree, so they do not step on each other.

## Rules

- A branch can be checked out in **only one** worktree at a time. Git refuses a second one, to keep you safe.
- `git worktree add -b hotfix/x ../shop-hotfix main` creates a new branch at the same time.
- Deleted the folder by hand? Run `git worktree prune`.

```tip
A tidy layout: keep the main clone in `~/code/shop/main` and add worktrees next to it: `~/code/shop/review`, `~/code/shop/hotfix`.
```

```quiz
q: How many copies of the history do two worktrees of one repo have?
- Two
- [x] One, shared
why: Worktrees share the same object database. Only the working folders are separate.

q: Can the same branch be checked out in two worktrees?
- Yes
- [x] No, Git refuses by default
why: Two folders moving one branch would overwrite each other's work.
```

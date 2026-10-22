---
title: Rename master to main
difficulty: Easy
tags: branches
---

An old project still uses a branch called `master`. Your team now names the main branch `main`.

```mission
goal: Rename the branch `master` to `main`. Stay on it.
setup: git init -q && echo "# Shop" > README.md && git add . && git commit -q -m "Start the shop" && git branch -m main master
check: branch main
check: nobranch master
check: head main
hint: You do not need a new branch. You need to **move** (rename) the old one.
hint: `git branch -m OLD NEW` renames a branch.
```

```solution
git branch -m master main
```

---
title: Clean up a merged branch
difficulty: Easy
tags: branches, merge
---

The `search` feature is finished and already merged into `main`. The old branch is just clutter now.

```mission
goal: Delete the branch `search` and stay on `main`.
setup: git init -q && echo "# Shop" > README.md && git add . && git commit -q -m "Start the shop" && git switch -q -c search && echo "find()" > search.js && git add . && git commit -q -m "Add search" && git switch -q main && git merge -q search
check: nobranch search
check: head main
check: tracked search.js
hint: You cannot delete the branch you are standing on, but you are on `main`, so that is fine.
hint: `git branch -d NAME` deletes a branch that is already merged.
```

```solution
git branch -d search
```

---
title: Abort! Abort!
difficulty: Medium
tags: merge, conflicts, undo
---

You started a merge, got a scary conflict, and realised you merged the wrong branch.

```mission
goal: Cancel the merge completely. Everything should be exactly like before you started it.
setup: mkdir cafe && cd cafe && git init -q && echo "Pizza" > menu.txt && git add . && git commit -q -m "Menu"
setup: git switch -q -c experiment && echo "Pizza with pineapple" > menu.txt && git commit -q -a -m "Bold idea"
setup: git switch -q main && echo "Pizza margherita" > menu.txt && git commit -q -a -m "Classic"
setup: git merge experiment
check: nooperation
check: clean
check: exactcommits 2
check: contains menu.txt margherita
check: lacks menu.txt <<<<<<<
hint: Git always offers a way out of a half-done merge.
hint: `git merge --abort`.
```

```solution
git merge --abort
```

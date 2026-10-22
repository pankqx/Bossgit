---
title: Drop everything, hotfix!
difficulty: Medium
tags: stash, branches
---

You are halfway through a big change in `notes.txt`. The boss runs in: the site is down. You need a clean `main` right now.

```mission
goal: Park your work, make a branch `hotfix` from `main`, commit `fix.txt` on it, go back to `main`, and get your unfinished work back. The stash should be empty at the end.
setup: git init -q && echo "# Shop" > README.md && git add . && git commit -q -m "Start the shop" && echo "plan" > notes.txt && git add . && git commit -q -m "Notes" && echo "half written idea" >> notes.txt
check: branchhas hotfix fix.txt
check: branchlacks main fix.txt
check: head main
check: modified notes.txt
check: contains notes.txt half written
check: stash 0
hint: `git stash` puts unfinished changes on a shelf.
hint: After the hotfix commit, `git switch main` and `git stash pop` to take them back.
```

```solution
git stash
git switch -c hotfix
echo fixed > fix.txt
git add fix.txt
git commit -m "Hotfix"
git switch main
git stash pop
```

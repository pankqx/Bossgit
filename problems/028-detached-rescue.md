---
title: Save work from a detached HEAD
difficulty: Medium
tags: detached head, branches
---

You checked out an old commit to look around, then made two good commits there. You are not on any branch. If you switch away now, they will be hard to find.

```mission
goal: Keep both commits safe on a new branch called `rescue`, and end up on a branch (not detached).
setup: git init -q && echo "# Shop" > README.md && git add . && git commit -q -m "Start the shop"
setup: echo "v1" > lab.txt && git add . && git commit -q -m "Lab v1"
setup: echo "v2" > lab.txt && git commit -q -a -m "Lab v2"
setup: git checkout -q HEAD~1
setup: echo "test A" > test.txt && git add . && git commit -q -m "Test A"
setup: echo "test B" >> test.txt && git commit -q -a -m "Test B"
check: branch rescue
check: branchhas rescue test.txt
check: attached
check: run git log --oneline rescue => Test B
hint: `git status` tells you HEAD is detached.
hint: A branch is just a name for a commit. Create one right here.
hint: `git switch -c rescue`.
```

```solution
git switch -c rescue
```

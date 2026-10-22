---
title: Undo a bad amend
difficulty: Medium
tags: reflog, amend, rescue
---

You ran `git commit --amend` and accidentally changed your good `Add pricing` commit into something called `oops`.

```mission
goal: Get back the original `Add pricing` commit exactly as it was.
setup: git init -q && echo "# Shop" > README.md && git add . && git commit -q -m "Start the shop" && echo "tea 3" > prices.txt && git add . && git commit -q -m "Add pricing" && echo "junk" >> prices.txt && git commit -q -a --amend -m "oops"
check: message Add pricing
check: exactcommits 2
check: lacks prices.txt junk
check: clean
hint: An amend makes a **new** commit. The old one is still in `git reflog`.
hint: `git reset --hard HEAD@{1}`.
```

```solution
git reflog
git reset --hard HEAD@{1}
```

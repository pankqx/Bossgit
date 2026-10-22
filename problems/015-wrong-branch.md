---
title: Oops, wrong branch
difficulty: Medium
tags: branches, reset, cherry-pick
---

You meant to commit the search feature on the `feature` branch. You committed it on `main` instead. Nothing is pushed.

```mission
goal: Move the `Add search` commit to `feature`. `main` must go back to how it was before, and you should end on `main`.
setup: git init -q && echo "# Shop" > README.md && git add . && git commit -q -m "Start the shop" && git branch feature && echo "find()" > search.js && git add . && git commit -q -m "Add search"
check: branchhas feature search.js
check: branchlacks main search.js
check: head main
check: clean
check: nooperation
hint: Two steps: put the commit on `feature`, then take it off `main`.
hint: `git branch -f feature` moves `feature` to where you are now. `git cherry-pick` also works.
hint: To drop the commit from `main`: `git reset --hard HEAD~1`.
```

```solution
git branch -f feature
git reset --hard HEAD~1
```

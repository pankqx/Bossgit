---
title: Make history a straight line
difficulty: Medium
tags: rebase
---

Your team hates merge bubbles. `feature` and `main` have each moved on since `feature` was made.

```mission
goal: Replay `feature` on top of `main`, then bring `main` forward so both point at the same commit. No merge commits.
setup: git init -q && echo "# Shop" > README.md && git add . && git commit -q -m "Start the shop"
setup: git switch -q -c feature && echo "cart()" > cart.js && git add . && git commit -q -m "Add cart"
setup: git switch -q main && echo "MIT" > LICENSE && git add . && git commit -q -m "Add license"
check: head main
check: same main feature
check: tracked cart.js
check: tracked LICENSE
check: linear
hint: First `git switch feature`, then `git rebase main`.
hint: Back on `main`, `git merge feature` will now be a fast-forward.
```

```solution
git switch feature
git rebase main
git switch main
git merge feature
```

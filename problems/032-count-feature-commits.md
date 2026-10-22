---
title: How far ahead is the branch?
difficulty: Medium
tags: log, ranges, detective
---

Your manager asks: "How many commits are on `feature` that are not on `main` yet?"

```mission
goal: Write the number into a file called `count.txt`.
setup: git init -q && echo "# Shop" > README.md && git add . && git commit -q -m "Start the shop"
setup: echo 1 > a.txt && git add . && git commit -q -m "One"
setup: git switch -q -c feature && echo 2 > b.txt && git add . && git commit -q -m "Two"
setup: echo 3 > c.txt && git add . && git commit -q -m "Three"
setup: echo 4 > d.txt && git add . && git commit -q -m "Four"
setup: git switch -q main && echo 5 > e.txt && git add . && git commit -q -m "Five"
check: run cat count.txt => 3
hint: `A..B` means "commits in B that are not in A".
hint: `git log --oneline main..feature`, then count the lines.
```

```solution
git log --oneline main..feature
echo 3 > count.txt
```

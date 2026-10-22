---
title: Bring back a deleted branch
difficulty: Medium
tags: reflog, rescue
---

You deleted `experiment` with `-D`. It had two commits that were never merged. Panic? No. Git remembers.

```mission
goal: Recreate the branch `experiment` with both of its commits.
setup: git init -q && echo "# Shop" > README.md && git add . && git commit -q -m "Start the shop"
setup: git switch -q -c experiment && echo "idea 1" > idea.txt && git add . && git commit -q -m "Idea one"
setup: echo "idea 2" >> idea.txt && git commit -q -a -m "Idea two"
setup: git switch -q main && git branch -D experiment
check: branch experiment
check: branchhas experiment idea.txt
check: run git log --oneline experiment => Idea two
hint: `git reflog` lists everywhere HEAD has been, even on deleted branches.
hint: Find the line for `Idea two`. Use its short hash, or `HEAD@{1}`.
hint: `git branch experiment HASH`.
```

```solution
git reflog
git branch experiment HEAD@{1}
```

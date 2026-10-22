---
title: Unstack a stacked branch
difficulty: Hard
tags: rebase, branches
---

`feature-b` was started on top of `feature-a`. Now the team rejected `feature-a`, but `feature-b` must ship alone.

```mission
goal: Move `feature-b` so it contains **only its own commit**, sitting directly on top of `main`.
setup: git init -q && echo "# Shop" > README.md && git add . && git commit -q -m "Start the shop"
setup: git switch -q -c feature-a && echo "a" > a.txt && git add . && git commit -q -m "Feature A"
setup: git switch -q -c feature-b && echo "b" > b.txt && git add . && git commit -q -m "Feature B"
check: branchhas feature-b b.txt
check: branchlacks feature-b a.txt
check: same feature-b~1 main
check: nooperation
hint: A plain `git rebase main` would bring `Feature A` along too.
hint: `git rebase --onto NEWBASE OLDBASE` replays only the commits after OLDBASE.
hint: On `feature-b`: `git rebase --onto main feature-a`.
```

```solution
git rebase --onto main feature-a
```

---
title: Keep the feature visible
difficulty: Medium
tags: merge
---

Your team wants every feature to show up as a merge commit, even when a fast-forward is possible.

```mission
goal: Merge `about` into `main` with a real merge commit (two parents).
setup: git init -q && echo "# Shop" > README.md && git add . && git commit -q -m "Start the shop" && git switch -q -c about && echo "<p>Us</p>" > about.html && git add . && git commit -q -m "Add about page" && git switch -q main
check: head main
check: merged about
check: parents 2
check: tracked about.html
hint: A normal merge here would fast-forward and leave no merge commit.
hint: `git merge --no-ff about` forces a merge commit.
```

```solution
git merge --no-ff about -m "Merge about page"
```

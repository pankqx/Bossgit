---
title: Commit only the bug fix
difficulty: Easy
tags: staging, commit
---

You fixed a bug in `login.txt`. You also started changing `styles.css`, but that work is not ready.

```mission
goal: Make exactly one new commit that contains the `login.txt` fix. `styles.css` must still be changed but **not** committed.
setup: git init -q && echo "# Shop" > README.md && git add . && git commit -q -m "Start the shop" && echo "check password" > login.txt && echo "color: red" > styles.css && git add . && git commit -q -m "Add login and styles" && echo "check password safely" > login.txt && echo "color: blue" > styles.css
check: exactcommits 3
check: modified styles.css
check: run git diff HEAD~1 HEAD => login.txt
check: run git diff HEAD~1 HEAD => safely
hint: `git add .` would grab both files. Name the file you want.
hint: `git add login.txt` stages one file only.
hint: Then `git commit -m "Fix login check"`.
```

```solution
git add login.txt
git commit -m "Fix login check"
```

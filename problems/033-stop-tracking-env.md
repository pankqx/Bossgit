---
title: Stop tracking a committed secret file
difficulty: Medium
tags: security, gitignore, rm
---

`.env` was committed weeks ago. The app still needs it on your computer, but it must stop being tracked by Git.

```mission
goal: Stop tracking `.env` (keep the file on disk), add it to `.gitignore`, and commit.
setup: git init -q && echo "# Shop" > README.md && git add . && git commit -q -m "Start the shop" && echo "KEY=abc" > .env && echo "run()" > app.js && git add . && git commit -q -m "Add app"
check: nottracked .env
check: file .env
check: contains .gitignore .env
check: tracked .gitignore
check: clean
hint: `git rm --cached FILE` removes it from Git but leaves it on disk.
hint: Then `echo .env > .gitignore`, add, commit.
hint: Real life note: the old commits still have the key. Change the key too!
```

```solution
git rm --cached .env
echo .env > .gitignore
git add .gitignore
git commit -m "Stop tracking .env"
```

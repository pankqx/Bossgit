---
title: Unstage the secret
difficulty: Easy
tags: staging, undo, security
---

You ran `git add .` too fast. Now `.env`, a file full of passwords, is staged next to `app.js`.

```mission
goal: Take `.env` out of the staging area. Keep `app.js` staged, and do **not** delete `.env` from the disk.
setup: git init -q && echo "# Shop" > README.md && git add . && git commit -q -m "Start the shop" && echo "start()" > app.js && echo "PASSWORD=hunter2" > .env && git add .
check: staged app.js
check: notstaged .env
check: untracked .env
check: file .env
hint: `git status` even tells you the command to unstage a file.
hint: `git restore --staged FILE` moves a file out of the staging area and leaves your disk alone.
```

```solution
git restore --staged .env
```

---
title: Ignore the log files
difficulty: Easy
tags: gitignore
---

Your app writes `.log` files all day. They keep showing up in `git status` and someone will commit them by accident.

```mission
goal: Make Git ignore **every** `.log` file. Commit `app.js` and your `.gitignore`. The log files must stay on disk but never be committed.
setup: git init -q && echo "# Shop" > README.md && git add . && git commit -q -m "Start the shop" && echo "run()" > app.js && echo "boot ok" > debug.log && echo "boom" > error.log
check: clean
check: tracked app.js
check: tracked .gitignore
check: nottracked debug.log
check: nottracked error.log
check: file error.log
hint: A file called `.gitignore` holds patterns of files to ignore.
hint: The pattern `*.log` matches every file ending in `.log`.
hint: `echo "*.log" > .gitignore`, then add and commit.
```

```solution
echo "*.log" > .gitignore
git add .
git commit -m "Add app and ignore logs"
```

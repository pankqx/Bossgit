---
title: Push rejected
difficulty: Medium
tags: remotes, pull, push
---

You try to push and GitHub says *rejected*. A teammate pushed while you were working.

```mission
goal: Get your commit onto GitHub **and** keep your teammate's work.
setup: bossgit github https://github.com/you/shop
setup: git init -q && echo "# Shop" > README.md && git add . && git commit -q -m "Start the shop"
setup: git remote add origin https://github.com/you/shop && git push -q -u origin main
setup: bossgit teammate https://github.com/you/shop team.txt Hello from Ana
setup: echo "mine" > mine.txt && git add . && git commit -q -m "My work"
check: pushed main
check: branchhas main team.txt
check: branchhas main mine.txt
check: nooperation
hint: Try `git push` first and read the message.
hint: You need the teammate's commit first: `git pull` (or `git pull --rebase` for a straight line).
hint: Then `git push`.
```

```solution
git push
git pull --rebase
git push
```

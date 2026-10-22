---
title: Back up to a second remote
difficulty: Hard
tags: remotes, push
---

Your company wants a backup of every branch on a second server called `backup`, at `https://github.com/you/shop-backup`.

```mission
goal: Add the remote `backup` and push **all** your branches to it.
setup: bossgit github https://github.com/you/shop && bossgit github https://github.com/you/shop-backup
setup: git init -q && echo "# Shop" > README.md && git add . && git commit -q -m "Start the shop"
setup: git remote add origin https://github.com/you/shop && git push -q -u origin main
setup: git switch -q -c docs && echo "help" > help.md && git add . && git commit -q -m "Docs" && git switch -q main
check: remote backup
check: same backup/main main
check: same backup/docs docs
hint: `git remote add NAME URL` adds a remote.
hint: `git push --all backup` pushes every branch.
```

```solution
git remote add backup https://github.com/you/shop-backup
git push --all backup
```

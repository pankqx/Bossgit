---
title: Type less with an alias
difficulty: Easy
tags: config
---

You type `git status` 200 times a day. Real pros make a short alias.

```mission
goal: Make `git st` work as a short name for `git status`.
setup: git init -q && echo "# Shop" > README.md && git add . && git commit -q -m "Start the shop"
check: config alias.st status
check: run git st => On branch
hint: Aliases live in Git config under `alias.NAME`.
hint: `git config --global alias.st status`.
```

```solution
git config --global alias.st status
git st
```

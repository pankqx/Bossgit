---
title: Undo a commit, keep the work
difficulty: Easy
tags: undo, reset
---

You committed half-finished work with the message `WIP`. You want the commit gone, but you do not want to lose the code.

```mission
goal: Remove the last commit. Its changes must stay **staged**, ready for a proper commit later.
setup: git init -q && echo "# Shop" > README.md && git add . && git commit -q -m "Start the shop" && echo "half" > checkout.js && git add . && git commit -q -m "WIP"
check: exactcommits 1
check: staged checkout.js
check: file checkout.js
hint: `git reset` moves your branch back. The flag decides what happens to the changes.
hint: `--soft` keeps everything staged. `HEAD~1` means one commit back.
```

```solution
git reset --soft HEAD~1
```

---
title: Fix a typo in a commit message
difficulty: Easy
tags: commit, amend
---

You just committed with the message `Fix tpyo in header`. Ironic. Nothing has been pushed yet.

```mission
goal: Change the last commit message to `Fix typo in header`. Do not add a new commit.
setup: git init -q && echo "# Shop" > README.md && git add . && git commit -q -m "Start the shop" && echo "<h1>Welcome</h1>" > header.html && git add . && git commit -q -m "Fix tpyo in header"
check: exactcommits 2
check: message Fix typo in header
check: clean
hint: You can rewrite the last commit while it is still only on your computer.
hint: `git commit --amend -m "NEW MESSAGE"`.
```

```solution
git commit --amend -m "Fix typo in header"
```

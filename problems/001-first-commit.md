---
title: Your first commit
difficulty: Easy
tags: basics, commit
---

Mina keeps a to-do list in a folder called `notes`. It is not a Git repository yet, so none of her changes are saved.

```mission
goal: Turn `notes` into a Git repository and save `todo.txt` in a commit. Leave nothing uncommitted.
setup: mkdir notes && cd notes && echo "Buy milk" > todo.txt
check: repo
check: exactcommits 1
check: tracked todo.txt
check: clean
hint: Every repository starts with one command: `git init`.
hint: A file must be staged before you can commit it.
hint: `git add todo.txt`, then `git commit -m "Add to-do list"`.
```

```solution
git init
git add todo.txt
git commit -m "Add to-do list"
```

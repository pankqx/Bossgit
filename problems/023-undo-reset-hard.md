---
title: Undo a reset --hard
difficulty: Medium
tags: reflog, reset, rescue
---

You typed `git reset --hard HEAD~2` and two chapters of your book disappeared. They were committed, so they are not really gone.

```mission
goal: Get both lost commits back on `main`.
setup: mkdir book && cd book && git init -q && echo "ch1" > chapter1.txt && git add . && git commit -q -m "Chapter 1"
setup: echo "ch2" > chapter2.txt && git add . && git commit -q -m "Chapter 2"
setup: echo "ch3" > chapter3.txt && git add . && git commit -q -m "Chapter 3"
setup: git reset -q --hard HEAD~2
check: exactcommits 3
check: file chapter3.txt
check: head main
check: clean
hint: `git reflog` shows where `main` was before the reset.
hint: `git reset --hard HEAD@{1}` jumps back to the place before the last move.
```

```solution
git reflog
git reset --hard HEAD@{1}
```

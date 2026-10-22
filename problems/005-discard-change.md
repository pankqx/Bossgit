---
title: Throw away a bad edit
difficulty: Easy
tags: undo, restore
---

Your cat walked over the keyboard and typed rubbish into `poem.txt`. The last commit has the good version.

```mission
goal: Get `poem.txt` back to how it is in the last commit. Make no new commits.
setup: mkdir poems && cd poems && git init -q && echo "Roses are red" > poem.txt && git add . && git commit -q -m "Add poem" && echo "asdfghjkl garbage" >> poem.txt
check: clean
check: lacks poem.txt garbage
check: contains poem.txt Roses are red
check: exactcommits 1
hint: You want to *restore* the file from the last commit.
hint: `git restore poem.txt` throws the change away for good.
```

```solution
git restore poem.txt
```

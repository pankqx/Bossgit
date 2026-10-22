---
title: Finish the rebase, then push
difficulty: Hard
tags: rebase, conflicts, push, force
---

You were rebasing your already-pushed `feature` branch onto `main` and got stuck on a conflict. Then you went to lunch. Now finish the job.

```mission
goal: Finish the rebase (the title should be `Big Sale`), then update `origin/feature`. Use the **safe** kind of force push.
setup: bossgit github https://github.com/you/shop
setup: mkdir shop && cd shop && git init -q && echo "Sale" > title.txt && git add . && git commit -q -m "Title"
setup: git remote add origin https://github.com/you/shop && git push -q -u origin main
setup: git switch -q -c feature && echo "Big Sale" > title.txt && git commit -q -a -m "Bigger title" && git push -q -u origin feature
setup: git switch -q main && echo "Summer Sale" > title.txt && git commit -q -a -m "Summer"
setup: git switch -q feature
setup: git rebase main
check: nooperation
check: head feature
check: merged main
check: contains title.txt Big Sale
check: lacks title.txt <<<<<<<
check: pushed feature
hint: `git status` tells you a rebase is in progress.
hint: Fix the file, `git add` it, then `git rebase --continue`.
hint: A normal push is rejected because you rewrote history. `git push --force-with-lease` refuses if someone else pushed in between.
```

```solution
echo "Big Sale" > title.txt
git add title.txt
git rebase --continue
git push --force-with-lease
```

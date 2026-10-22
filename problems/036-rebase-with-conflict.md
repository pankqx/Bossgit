---
title: Rebase through a conflict
difficulty: Hard
tags: rebase, conflicts
---

On `main`, someone changed the port to 8080. On your `feature` branch, you changed the same line to add a timeout. Rebase time.

```mission
goal: Rebase `feature` onto `main`. The final `config.txt` on `feature` must say `port=8080 timeout=30`, and the rebase must be finished.
setup: mkdir api && cd api && git init -q && echo "port=3000" > config.txt && git add . && git commit -q -m "Config"
setup: git switch -q -c feature && echo "port=3000 timeout=30" > config.txt && git commit -q -a -m "Add timeout"
setup: git switch -q main && echo "port=8080" > config.txt && git commit -q -a -m "Use port 8080"
setup: git switch -q feature
check: head feature
check: merged main
check: linear
check: contains config.txt port=8080 timeout=30
check: lacks config.txt <<<<<<<
check: nooperation
check: clean
hint: `git rebase main` will stop on a conflict.
hint: Write the combined line: `echo "port=8080 timeout=30" > config.txt`.
hint: `git add config.txt`, then `git rebase --continue`.
```

```solution
git rebase main
echo "port=8080 timeout=30" > config.txt
git add config.txt
git rebase --continue
```

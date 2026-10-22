---
title: Tag an older commit
difficulty: Easy
tags: tags, history
---

Version 1.0.0 was the commit **before** the latest one. Nobody tagged it at the time.

```mission
goal: Create a tag called `v1.0.0` that points at the second-newest commit (one before HEAD).
setup: git init -q && echo "# Shop" > README.md && git add . && git commit -q -m "Start the shop"
setup: echo "1.0" > version.txt && git add . && git commit -q -m "Release 1.0"
setup: echo "1.1-beta" > version.txt && git commit -q -a -m "Start 1.1"
check: tag v1.0.0
check: same v1.0.0 HEAD~1
hint: `git log --oneline` shows the commits. The one under the top is your target.
hint: `git tag NAME COMMIT` tags any commit. `HEAD~1` means "one before HEAD".
```

```solution
git tag v1.0.0 HEAD~1
```

---
title: Sync your fork
difficulty: Hard
tags: remotes, forks, open source
---

You forked an open source tool. The original project (`upstream`) got a new bug fix. Your fork (`origin`) is now behind.

```mission
goal: Bring the upstream fix into your `main`, and push it to your fork. `main`, `upstream/main` and `origin/main` must all match.
setup: bossgit github https://github.com/maker/tool && bossgit github https://github.com/you/tool
setup: mkdir tool && cd tool && git init -q && echo "v1" > tool.txt && git add . && git commit -q -m "v1"
setup: git remote add upstream https://github.com/maker/tool && git push -q upstream main
setup: git remote add origin https://github.com/you/tool && git push -q -u origin main
setup: bossgit teammate https://github.com/maker/tool fix.txt bug fixed
check: remote upstream
check: same main upstream/main
check: pushed main
check: tracked fix.txt
hint: `git remote -v` shows both remotes.
hint: `git fetch upstream` downloads the new commit.
hint: `git merge upstream/main`, then `git push`.
```

```solution
git fetch upstream
git merge upstream/main
git push
```

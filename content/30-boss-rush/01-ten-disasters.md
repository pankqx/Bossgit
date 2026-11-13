---
title: Ten disaster scenarios, timed
minutes: 30
---

Real incidents do not tell you which lesson they belong to. Start a timer. Aim for **under 3 minutes each**. If you get stuck, the hints are there, but try first.

```mission
title: 1. Committed to main by mistake
goal: Your commit `Add search` should be on a branch `feat/search`, not on `main`. Move it: `feat/search` must have it, `main` must not. End on `main`.
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start" && echo "s" > search.js && git add . && git commit -q -m "Add search"
check: branchhas feat/search search.js
check: branchlacks main search.js
check: head main
check: exactcommits 1
hint: git branch feat/search, then git reset --hard HEAD~1
solve: git branch feat/search
solve: git reset --hard HEAD~1
```

```mission
title: 2. The commit message has a typo and was not pushed
goal: Change the last commit's message to `Add the cart page`.
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start" && echo "c" > cart.js && git add . && git commit -q -m "Add teh crat page"
check: message Add the cart page
check: exactcommits 2
solve: git commit --amend -m "Add the cart page"
```

```mission
title: 3. Staged a secret
goal: `.env` is staged. Unstage it, ignore it with `.gitignore`, and commit the rest (including `.gitignore`).
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start" && echo "KEY=123" > .env && echo "x" > app.js && git add .
check: nottracked .env
check: tracked app.js
check: tracked .gitignore
check: clean
solve: git restore --staged .env
solve: echo ".env" > .gitignore
solve: git add .
solve: git commit -m "Add app"
```

```mission
title: 4. Pushed a bug to shared main
goal: The last commit `Break login` is on shared `main` and pushed. Undo it safely and push.
setup: bossgit github https://github.com/team/app && mkdir app && cd app && git init -q && echo "ok" > login.txt && git add . && git commit -q -m "Login" && echo "broken" > login.txt && git commit -q -am "Break login" && git remote add origin https://github.com/team/app && git push -q -u origin main
check: contains login.txt ok
check: message Revert
check: pushed main
check: exactcommits 3
solve: git revert --no-edit HEAD
solve: git push
```

```mission
title: 5. Deleted a branch with unmerged work
goal: `experiment` was deleted with `-D`. Bring it back with its commit `Wild idea`.
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start" && git switch -q -c experiment && echo "w" > wild.txt && git add . && git commit -q -m "Wild idea" && git switch -q main && git branch -q -D experiment
check: branch experiment
check: branchhas experiment wild.txt
solve: git branch experiment HEAD@{1}
```

```mission
title: 6. Merge conflict in production config
goal: Merge `tune` into `main`. Keep **both** `timeout=30` and `retries=3` in `config.txt`, no markers.
setup: mkdir app && cd app && git init -q && echo "timeout=10" > config.txt && git add . && git commit -q -m "Config" && git switch -q -c tune && echo "retries=3" > config.txt && git commit -q -am "Retries" && git switch -q main && echo "timeout=30" > config.txt && git commit -q -am "Timeout"
check: merged tune
check: contains config.txt timeout=30
check: contains config.txt retries=3
check: lacks config.txt <<<<<<<
check: nooperation
solve: git merge tune
solve: echo "timeout=30" > config.txt
solve: echo "retries=3" >> config.txt
solve: git add config.txt
solve: git commit -m "Merge tune"
```

```mission
title: 7. Push rejected before a demo
goal: Sam pushed first, and your push of `main` is rejected. Get your commit on GitHub with a linear history.
setup: bossgit github https://github.com/team/demo && mkdir demo && cd demo && git init -q && echo "demo" > README.md && git add . && git commit -q -m "Start" && git remote add origin https://github.com/team/demo && git push -q -u origin main && bossgit teammate https://github.com/team/demo sam.txt hi && echo "mine" > mine.txt && git add . && git commit -q -m "Mine"
check: pushed main
check: linear
check: branchhas main sam.txt
solve: git pull --rebase
solve: git push
```

```mission
title: 8. Lost work after reset --hard
goal: Three commits vanished after `git reset --hard HEAD~3`. Bring `main` back to `Step 4`.
setup: mkdir app && cd app && git init -q && echo "1" > s.txt && git add . && git commit -q -m "Step 1" && echo "2" >> s.txt && git commit -q -am "Step 2" && echo "3" >> s.txt && git commit -q -am "Step 3" && echo "4" >> s.txt && git commit -q -am "Step 4" && git reset -q --hard HEAD~3
check: message Step 4
check: exactcommits 4
solve: git reset --hard HEAD@{1}
```

```mission
title: 9. Hotfix needed on an old release
goal: Make branch `release/1.x` from tag `v1.0.0`, commit a fix that makes `pay.txt` say `fixed`, and tag it annotated `v1.0.1`.
setup: mkdir app && cd app && git init -q && echo "broken" > pay.txt && git add . && git commit -q -m "1.0" && git tag -a v1.0.0 -m "1.0.0" && echo "v2" > new.txt && git add . && git commit -q -m "2.0 work"
check: tag v1.0.1
check: same v1.0.1 release/1.x
check: run git show release/1.x:pay.txt => fixed
check: branchlacks release/1.x new.txt
solve: git switch -c release/1.x v1.0.0
solve: echo "fixed" > pay.txt
solve: git commit -am "fix: payments"
solve: git tag -a v1.0.1 -m "1.0.1"
```

```mission
title: 10. Find the commit that broke the build
goal: One commit changed `build=ok` into `build=fail`. Find it and tag it `breaker`. End on `main`.
setup: mkdir app && cd app && git init -q && echo "build=ok" > ci.txt && git add . && git commit -q -m "A" && echo "x" > x.txt && git add . && git commit -q -m "B" && echo "build=fail" > ci.txt && git commit -q -am "C" && echo "y" > y.txt && git add . && git commit -q -m "D" && echo "z" > z.txt && git add . && git commit -q -m "E"
check: tag breaker
check: same breaker HEAD~2
check: head main
solve: git tag breaker HEAD~2
```

```tip
Did all ten in under 30 minutes? You can handle what most teams call "a bad day with Git". Write down the ones that took longest and redo them tomorrow.
```

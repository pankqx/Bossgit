---
title: The Final Boss
minutes: 25
setup: bossgit github https://github.com/acme/store && mkdir store && cd store && git init -q && echo "price=10" > price.txt && echo "store" > README.md && git add . && git commit -q -m "v1.0.0" && git tag -a v1.0.0 -m "1.0.0" && git remote add origin https://github.com/acme/store && git push -q -u origin main && git push -q origin v1.0.0
---

Friday, 6 p.m. Everything goes wrong at once. Use every skill.

```mission
title: The Final Boss
boss: true
goal: You are on `feat/reviews` with **unfinished** changes. Meanwhile a teammate pushed to `main`, and production has a bug: `price.txt` must say `price=12`. Do it all: 1) save your unfinished work, 2) update `main` from GitHub, 3) fix the bug on `hotfix/price`, merge it into `main` with `--no-ff`, tag `v1.0.1` (annotated) and push `main`, 4) rebase `feat/reviews` onto the new `main`, 5) bring your unfinished work back. End on `feat/reviews`.
setup: bossgit github https://github.com/acme/store && mkdir store && cd store && git init -q && echo "price=10" > price.txt && echo "store" > README.md && git add . && git commit -q -m "v1.0.0" && git tag -a v1.0.0 -m "1.0.0" && git remote add origin https://github.com/acme/store && git push -q -u origin main && git switch -q -c feat/reviews && echo "reviews" > reviews.js && git add . && git commit -q -m "feat: reviews" && echo "half done" >> reviews.js && bossgit teammate https://github.com/acme/store docs.md Shipping docs
check: head feat/reviews
check: contains reviews.js half done
check: stash 0
check: branchhas main docs.md
check: run git show main:price.txt => price=12
check: tag v1.0.1
check: same v1.0.1 main
check: pushed main
check: branchhas feat/reviews price.txt
check: same feat/reviews~1 main
hint: git stash, git switch main, git pull
hint: git switch -c hotfix/price, fix and commit, git switch main, git merge --no-ff hotfix/price
hint: git tag -a v1.0.1 -m "1.0.1", git push, git switch feat/reviews, git rebase main, git stash pop
solve: git stash
solve: git switch main
solve: git pull
solve: git switch -c hotfix/price
solve: echo "price=12" > price.txt
solve: git commit -am "fix: price"
solve: git switch main
solve: git merge --no-ff hotfix/price -m "Merge hotfix/price"
solve: git tag -a v1.0.1 -m "1.0.1"
solve: git push
solve: git switch feat/reviews
solve: git rebase main
solve: git stash pop
```

```fact
If you beat this without hints, you just did a stash, a pull, a hotfix branch, a no-ff merge, an annotated tag, a push, a rebase and a stash pop, in the right order, under pressure. That is the daily reality of a senior engineer on release day.
```

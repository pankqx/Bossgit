---
title: "Scenario: the Friday hotfix"
minutes: 10
setup: mkdir shop && cd shop && git init -q && echo "price=10" > price.txt && git add . && git commit -q -m "v1.0.0" && git tag -a v1.0.0 -m "Release 1.0.0" && git switch -q -c feature/coupons && echo "coupons" > coupons.txt && git add . && git commit -q -m "Start coupons" && echo "WIP" >> coupons.txt
---

It is 5 p.m. on Friday. You are halfway through the coupons feature. Support calls: **checkout shows the wrong price.** It is a one-line fix and it must ship tonight.

This lesson strings together everything from this module, in the order a real engineer would do it.

## 1. Save your work

```try
git status
git stash -u -m "coupons wip"
```

## 2. Branch from the release, not from your feature

```try
git switch main
git switch -c hotfix/price
echo "price=12" > price.txt
git commit -am "fix: show the right price at checkout"
```

## 3. Ship it

```try
git switch main
git merge hotfix/price
git tag -a v1.0.1 -m "Hotfix: checkout price"
git log --oneline --graph --all
```

A **PATCH** bump: 1.0.0 to 1.0.1. In real life you would push `main` and the tag, and the pipeline would deploy.

## 4. Get the fix into your feature, then carry on

```try
git switch feature/coupons
git rebase main
git stash pop
git status
```

Your feature now sits on top of the fix, and your unfinished work is back. Go home.

```tip
In a team, step 3 is a pull request from `hotfix/price` with one reviewer. Hotfix PRs are small, so review takes two minutes.
```

```quiz
q: Why branch the hotfix from main and not from your feature branch?
- It is faster
- [x] The feature branch has unfinished work that must not ship
why: Hotfixes start from what is live, so only the fix goes out.

q: The fix is a bug fix with nothing new. 1.0.0 becomes?
- [x] 1.0.1
- 1.1.0
- 2.0.0
why: Bug fix only: PATCH.
```

```mission
title: The Friday Hotfix
boss: true
goal: You are on `feature/search` with unfinished work. Without losing it: 1) fix the bug on a branch `hotfix/login` from `main` by making `login.txt` say `login=ok`, 2) merge it into `main`, 3) tag `main` with an annotated tag `v1.0.1`, 4) go back to `feature/search` with your unfinished work restored.
setup: mkdir app && cd app && git init -q && echo "login=broken" > login.txt && git add . && git commit -q -m "v1.0.0" && git switch -q -c feature/search && echo "search v0" > search.txt && git add . && git commit -q -m "Start search" && echo "half done" >> search.txt
check: branch hotfix/login
check: branchhas main login.txt
check: run git show main:login.txt => login=ok
check: tag v1.0.1
check: same v1.0.1 main
check: head feature/search
check: contains search.txt half done
check: stash 0
hint: git stash, then git switch main, then git switch -c hotfix/login
hint: echo "login=ok" > login.txt and commit. Then switch to main and merge.
hint: git tag -a v1.0.1 -m "Hotfix", then switch back and git stash pop
solve: git stash
solve: git switch main
solve: git switch -c hotfix/login
solve: echo "login=ok" > login.txt
solve: git commit -am "fix: login"
solve: git switch main
solve: git merge hotfix/login
solve: git tag -a v1.0.1 -m "Hotfix"
solve: git switch feature/search
solve: git stash pop
```

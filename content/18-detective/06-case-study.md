---
title: "Case study: hunting a real bug"
minutes: 12
setup: mkdir shop && cd shop && git init -q && echo "discount=10" > price.txt && git add . && git commit -q -m "v1.0" && git tag v1.0 && echo "shipping=free" > ship.txt && git add . && git commit -q -m "Free shipping" && echo "discount=100" > price.txt && git commit -q -am "Clean up pricing" && echo "banner=sale" > banner.txt && git add . && git commit -q -m "Sale banner" && echo "footer" > footer.txt && git add . && git commit -q -m "Footer"
---

**Monday, 9:12 a.m.** Support: "Everything in the shop costs zero rupees." Version `v1.0` was fine. Here is how a senior engineer works it out, calmly, with Git.

## 1. Define the bug precisely

Not "prices are broken". It is: **`discount` should be 10, and now it is 100** (100% off). A precise bug gives you a precise test.

## 2. Measure the search space

```try
git log --oneline v1.0..HEAD
```

Four suspects.

## 3. Try the quick search first

```try
git log --oneline -S "discount=100"
```

When you know the text, the pickaxe finds it in one command. When you do not (a crash, a slowdown), use bisect:

```try
git bisect start HEAD v1.0
cat price.txt
```

Answer `good` or `bad` after each `cat price.txt`, until Git names the first bad commit. Then `git bisect reset`.

## 4. Understand before you fix

```try
git show HEAD~2
```

The commit is called "Clean up pricing", but it changed the discount. Read the PR. Was it a typo? A test value? Never "fix" a line you do not understand.

## 5. Fix it the safe way

`main` is shared and deployed, so **revert**, do not reset:

```try
git revert --no-edit HEAD~2
cat price.txt
```

## 6. Make it never happen again

- Add a **test**: "discount must be between 0 and 90".
- Write a short, blameless **post-mortem**: what happened, how it was found, what changes.

```quiz
q: Which comes first when hunting a bug?
- Reverting random commits
- [x] Describing the bug precisely, so you can test for it
why: A precise test makes both git log -S and bisect possible.

q: The bad commit is on the deployed main branch. How do you undo it?
- git reset --hard and force-push
- [x] git revert
why: Shared history: add an undo commit.
```

```mission
title: The Silent Bug
boss: true
goal: Somewhere after tag `v1.0`, a commit changed `limit=5` into `limit=0` in `api.txt`, so the API rejects everyone. Find it (bisect or log -S) and **undo it with a revert**, keeping the later commits. End on `main`.
setup: mkdir api && cd api && git init -q && echo "limit=5" > api.txt && git add . && git commit -q -m "v1.0" && git tag v1.0 && echo "auth" > auth.txt && git add . && git commit -q -m "Add auth" && echo "limit=0" > api.txt && git commit -q -am "Tune settings" && echo "logs" > logs.txt && git add . && git commit -q -m "Add logs" && echo "docs" > docs.txt && git add . && git commit -q -m "Add docs"
check: head main
check: contains api.txt limit=5
check: file logs.txt
check: file docs.txt
check: message Revert
check: nooperation
hint: git log --oneline -S "limit=0"
hint: git revert with that commit's id (it is HEAD~2)
solve: git revert --no-edit HEAD~2
```

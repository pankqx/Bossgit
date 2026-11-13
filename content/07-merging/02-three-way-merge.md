---
title: Three-way merges and merge commits
minutes: 9
setup: mkdir shop && cd shop && git init -q && echo "shop" > README.md && git add . && git commit -q -m "Start" && git switch -q -c cart && echo "cart" > cart.txt && git add . && git commit -q -m "Add cart" && git switch -q main && echo "about us" > about.txt && git add . && git commit -q -m "Add about page"
---

A fast-forward only works when `main` has not moved. Usually it has: your teammates kept committing while you built your feature. Now the two branches have **split**.

```try
git log --oneline --graph --all
```

## Merge them

```try
git merge cart -m "Merge cart into main"
git log --oneline --graph --all
```

Git made a **merge commit**. It is a normal commit with one special thing: **two parents**, the tip of `main` and the tip of `cart`.

```flow
flowchart LR
  A[Start] --> B[Add about page] --> M[Merge cart into main]
  A --> C[Add cart] --> M
```

## Why "three-way"?

Git compares **three** commits:

1. The **base**: the last commit both branches share (`Start`).
2. **Ours**: the tip of the branch you are on (`main`).
3. **Theirs**: the tip of the branch you are merging in (`cart`).

For each file, if only one side changed it compared to the base, Git takes that side. If both sides changed **different lines**, Git takes both. Only if both changed the **same lines** does Git stop and ask you. That is a conflict, and it is the next lesson.

```bash
git merge-base main cart      # print the base commit
git merge --no-ff feature     # force a merge commit even when a fast-forward is possible
git merge --ff-only feature   # refuse unless it can fast-forward
```

```fact
Some teams always use `--no-ff`, so every feature shows up as one "bump" in the graph and can be reverted in one step with `git revert -m 1`.
```

```quiz
q: How many parents does a normal merge commit have?
- 0
- 1
- [x] 2
why: One parent from each branch that was joined.

q: Both branches changed different files. What happens on merge?
- A conflict
- [x] Git combines both automatically
- Git keeps only main's version
why: Conflicts only happen when both sides change the same part of the same file.
```

```mission
title: Join the work
goal: `main` and `menu` have both moved on. Merge `menu` into `main` with a **merge commit**.
setup: mkdir cafe && cd cafe && git init -q && echo "cafe" > README.md && git add . && git commit -q -m "Start" && git switch -q -c menu && echo "tea" > menu.txt && git add . && git commit -q -m "Add menu" && git switch -q main && echo "9 to 5" > hours.txt && git add . && git commit -q -m "Add hours"
check: head main
check: merged menu
check: parents 2
check: file menu.txt
check: file hours.txt
hint: Make sure you are on main.
hint: git merge menu
solve: git merge menu -m "Merge menu"
```

---
title: Merge or rebase? A flowchart
minutes: 7
setup: mkdir shop && cd shop && git init -q && echo "shop" > README.md && git add . && git commit -q -m "Start" && git switch -q -c search && echo "s1" > search.txt && git add . && git commit -q -m "Search box" && git switch -q main && echo "hot" > hotfix.txt && git add . && git commit -q -m "Hotfix" && git switch -q -c shared-cart && echo "cart" > cart.txt && git add . && git commit -q -m "Cart" && git switch -q main
---

Both are good tools. Experienced developers pick per situation.

```flow
flowchart TD
  Q1{Is the branch shared with others?} -->|Yes| M[Merge]
  Q1 -->|No, only mine| Q2{What do I want?}
  Q2 -->|Update my branch with main| R[Rebase onto main]
  Q2 -->|Clean up my commits before review| RI[Interactive rebase]
  Q2 -->|Finish a feature into main| Q3{Team rule?}
  Q3 -->|Keep feature history| MN["Merge (--no-ff)"]
  Q3 -->|One commit per feature| SQ[Squash merge]
  Q3 -->|Linear history| RB[Rebase and merge]
```

## The most common team setup

1. **Update** your feature branch with `git rebase origin/main` (it is yours, so it is safe).
2. **Clean** it with `git rebase -i` before asking for review.
3. **Finish** it on GitHub with the button the team chose: Merge, Squash, or Rebase (module 11).
4. **Never** rebase `main`.

```tip
If you are unsure, merge. A merge never destroys anything. A wrong rebase can.
```

```quiz
q: You want your private feature branch to include today's main. Which is cleanest?
- git merge main
- [x] git rebase main
- git reset main
why: It is private, so rebase is safe and keeps history straight.

q: Two developers push to the same branch. One wants main's changes. What should they use?
- [x] git merge main
- git rebase main and force-push
why: The branch is shared. Rewriting it would break the other developer.
```

```mission
title: The Tangled Timeline
boss: true
goal: Two branches. `search` is yours alone: bring it up to date with `main` using a **rebase**. `shared-cart` is shared with a teammate: bring `main` into it using a **merge**, not a rebase. End on `main`.
setup: mkdir shop && cd shop && git init -q && echo "shop" > README.md && git add . && git commit -q -m "Start" && git switch -q -c search && echo "s1" > search.txt && git add . && git commit -q -m "Search box" && git switch -q main && git switch -q -c shared-cart && echo "cart" > cart.txt && git add . && git commit -q -m "Cart" && git switch -q main && echo "hot" > hotfix.txt && git add . && git commit -q -m "Hotfix"
check: same search~1 main
check: branchhas search hotfix.txt
check: branchhas shared-cart hotfix.txt
check: branchhas shared-cart cart.txt
check: run git log --oneline shared-cart => Cart
check: head main
hint: git switch search, git rebase main
hint: git switch shared-cart, git merge main
hint: git switch main
solve: git switch search
solve: git rebase main
solve: git switch shared-cart
solve: git merge main -m "Merge main into shared-cart"
solve: git switch main
```

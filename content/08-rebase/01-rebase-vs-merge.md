---
title: Rebase vs merge, side by side
minutes: 8
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start" && git switch -q -c feature && echo "a" > a.txt && git add . && git commit -q -m "Feature part 1" && echo "b" > b.txt && git add . && git commit -q -m "Feature part 2" && git switch -q main && echo "fix" > fix.txt && git add . && git commit -q -m "Hotfix on main" && git switch -q feature
---

You are on `feature`. Meanwhile `main` got a hotfix. You want your branch to include it. There are two ways.

```try
git log --oneline --graph --all
```

## Option 1: merge main into your branch

```flow
flowchart LR
  A[Start] --> H[Hotfix on main]
  A --> F1[Feature part 1] --> F2[Feature part 2] --> M[Merge main into feature]
  H --> M
```

History is **true**: it shows exactly what happened. But every sync adds a merge commit, and the graph becomes a plate of spaghetti.

## Option 2: rebase your branch onto main

```flow
flowchart LR
  A[Start] --> H[Hotfix on main] --> F1["Feature part 1 (new copy)"] --> F2["Feature part 2 (new copy)"]
```

Rebase **replays** your commits on top of the new `main`, as if you had started your work today. History is a **straight line**, easy to read and easy to bisect.

```try
git rebase main
git log --oneline --graph --all
```

Look at the ids of your two feature commits. They **changed**. Rebase does not move commits; it makes new copies with new parents, and the old ones are dropped.

## The trade-off

| | Merge | Rebase |
|---|---|---|
| History | True, with merge commits | Clean and linear |
| Commit ids | Never change | Your commits get new ids |
| Safe on shared branches | Yes | **No** (see the golden rule) |
| Conflicts | Fixed once | May be fixed once per commit |

```quiz
q: After git rebase main, what happens to your feature commits' ids?
- They stay the same
- [x] They change, because new copies are made
why: A commit's id depends on its parent. New parent, new id.

q: Which gives a straight-line history?
- git merge
- [x] git rebase
why: Rebase replays commits on top, so there are no merge commits.
```

```mission
title: Catch up with main
goal: `main` has a new commit. Bring `feature` up to date with a **rebase**, so history is a straight line and `feature` sits on top of `main`.
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start" && git switch -q -c feature && echo "a" > a.txt && git add . && git commit -q -m "Feature work" && git switch -q main && echo "fix" > fix.txt && git add . && git commit -q -m "Hotfix" && git switch -q feature
check: head feature
check: linear
check: same feature~1 main
check: file fix.txt
hint: You are already on feature.
solve: git rebase main
```

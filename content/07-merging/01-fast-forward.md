---
title: The simplest merge, fast-forward
minutes: 6
setup: mkdir blog && cd blog && git init -q && echo "My blog" > index.md && git add . && git commit -q -m "Start the blog" && git switch -q -c first-post && echo "Hello world" > post1.md && git add . && git commit -q -m "Write the first post" && echo "(edited)" >> post1.md && git commit -q -am "Polish the first post" && git switch -q main
---

You built something on a branch. It works. Now you want it on `main`. That is what **merging** does: it brings the work from one branch into another.

The lab has a `first-post` branch with two commits that `main` does not have yet. Look at the graph: `main` is behind.

```try
git log --oneline --all
```

To merge, **go to the branch that should receive the work**, then merge the other one into it:

```try
git switch main
git merge first-post
```

`Fast-forward`. Look at the graph: no new commit appeared. Git simply slid the `main` sticky note forward to where `first-post` was.

## Why fast-forward?

`main` had no new commits of its own since the branch started. So there was nothing to combine. Git just moved the label forward along the line. It's like catching up on a TV series: you were behind, now you're up to date.

```flow
flowchart LR
  A((A)) --> B((B)) --> C((C))
  M1["main (before)"] -.-> A
  M2["main (after)"] -.-> C
```

## Clean up

The branch did its job. Delete the label (the commits stay, because `main` now points at them):

```try
git branch -d first-post
git log --oneline
```

```quiz
q: When does Git do a fast-forward merge?
- When both branches have new commits
- [x] When the branch you are on has no new commits since the other branch started
- Never by default
why: If your branch is simply behind, Git can just move its label forward. No merge commit is needed.

q: To bring `feature` into `main`, which branch do you need to be on?
- feature
- [x] main
why: You stand on the branch that receives the work, then run git merge with the other branch's name.
```

```mission
title: Ship the feature
goal: Merge the `search` branch into `main`, then delete the `search` branch.
setup: mkdir app && cd app && git init -q && echo "app" > app.txt && git add . && git commit -q -m "Start" && git switch -q -c search && echo "search box" > search.txt && git add . && git commit -q -m "Add search" && git switch -q main
check: head main
check: tracked search.txt
check: nobranch search
hint: Make sure you are on main
hint: git merge search
hint: git branch -d search
```

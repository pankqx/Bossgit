---
title: Detached HEAD, and how to get out
minutes: 9
setup: mkdir game && cd game && git init -q && echo "level 1" > game.txt && git add . && git commit -q -m "Level 1" && echo "level 2" >> game.txt && git commit -q -am "Level 2" && echo "level 3" >> game.txt && git commit -q -am "Level 3"
---

Normally HEAD points at a **branch**, and the branch points at a commit. If you switch to a commit directly, HEAD points at the commit with no branch in between. That is a **detached HEAD**.

```try
git switch --detach HEAD~2
git status
cat game.txt
```

Git says `HEAD detached at ...`. You are looking at the past. This is perfectly fine for **looking around**: running old code, finding when a bug started.

```flow
flowchart LR
  A[Level 1] --> B[Level 2] --> C[Level 3]
  H((HEAD)) -.-> A
  M((main)) -.-> C
```

## The danger

If you make commits here, no branch points at them. When you switch away, they are only reachable through the reflog, and Git will eventually clean them up.

```try
echo "secret level" >> game.txt
git commit -qam "Secret level"
git switch main
```

Git warns you that you are leaving a commit behind and prints its id.

## The way out

You have two choices:

```bash
git switch main                 # just leave; nothing was committed, nothing is lost
git switch -c secret-level      # keep your commits: make a branch right here, BEFORE leaving
```

If you already left, it is still not too late:

```bash
git reflog                      # find "Secret level" and its id
git branch secret-level <id>
```

```fact
`git checkout <commit>` also detaches HEAD. Older tutorials do this a lot. `git switch` makes you type `--detach` on purpose, so you cannot do it by accident.
```

```quiz
q: What does "detached HEAD" mean?
- The repository is broken
- [x] HEAD points straight at a commit instead of a branch
- HEAD was deleted
why: Nothing is broken. You are just not on any branch.

q: You made two commits in detached HEAD and want to keep them. What do you run before leaving?
- git switch main
- [x] git switch -c NAME
- git reset --hard
why: Creating a branch gives those commits a name, so they are safe.
```

```mission
title: The Detached Head Ghost
boss: true
goal: You went back in time and made a good commit, `Fix the jump`, while HEAD was detached. Save it on a new branch called `jump-fix`, then go back to `main`.
setup: mkdir game && cd game && git init -q && echo "v1" > game.txt && git add . && git commit -q -m "v1" && echo "v2" >> game.txt && git commit -q -am "v2" && git switch -q --detach HEAD~1 && echo "jump fixed" > jump.txt && git add . && git commit -q -m "Fix the jump"
check: branch jump-fix
check: branchhas jump-fix jump.txt
check: head main
hint: While still detached: git switch -c jump-fix
hint: Then git switch main
solve: git switch -c jump-fix
solve: git switch main
```

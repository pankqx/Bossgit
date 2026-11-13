---
title: Conflicts during a rebase
minutes: 9
setup: mkdir menu && cd menu && git init -q && echo "Pizza 10" > menu.txt && git add . && git commit -q -m "Menu" && git switch -q -c prices && echo "Pizza 12" > menu.txt && git commit -q -am "Raise pizza price" && git switch -q main && echo "Pizza 11" > menu.txt && git commit -q -am "Small price rise" && git switch -q prices
---

Rebase replays commits one at a time. If one of them changes lines that `main` also changed, it stops **at that commit** and asks you.

```try
git rebase main
git status
cat menu.txt
```

## The loop

It is almost the same as a merge conflict, but the last step is different:

1. Fix the file and remove the markers.
2. `git add` the file.
3. `git rebase --continue` (**not** `git commit`).

```try
echo "Pizza 12" > menu.txt
git add menu.txt
git rebase --continue
git log --oneline
```

If more commits are left, Git keeps going and may stop again. Repeat until it says it is done.

## Your three exits

| Command | What it does |
|---|---|
| `git rebase --continue` | "I fixed this commit, go on." |
| `git rebase --skip` | "Drop this commit entirely, go on." Use when `main` already has the same change. |
| `git rebase --abort` | "Forget it." Back to exactly how things were before. |

```warn
During a rebase, **ours and theirs are swapped**. "Ours" is the branch you are rebasing onto (`main`), and "theirs" is your own commit being replayed. It confuses everyone. Read the file, not the labels.
```

```tip
Turn on `git config --global rerere.enabled true`. Git then remembers how you fixed a conflict and applies the same fix next time (module 20).
```

```quiz
q: You fixed a conflict during a rebase and ran git add. What next?
- git commit
- [x] git rebase --continue
- git merge --continue
why: The rebase is paused, and --continue resumes it and makes the commit for you.

q: During a rebase, which side is "ours"?
- [x] The branch you are rebasing onto
- Your commit being replayed
- The merge base
why: Rebase checks out the new base and replays your commits onto it, so "ours" is the base.
```

```mission
title: Stuck halfway
goal: Rebase `prices` onto `main`. It conflicts in `menu.txt`. The right price is `Pizza 12`. Finish the rebase so history is linear and nothing is in progress.
setup: mkdir menu && cd menu && git init -q && echo "Pizza 10" > menu.txt && git add . && git commit -q -m "Menu" && git switch -q -c prices && echo "Pizza 12" > menu.txt && git commit -q -am "Raise pizza price" && git switch -q main && echo "Pizza 11" > menu.txt && git commit -q -am "Small price rise" && git switch -q prices
check: head prices
check: linear
check: nooperation
check: contains menu.txt Pizza 12
check: lacks menu.txt <<<<<<<
check: same prices~1 main
hint: git rebase main stops on the conflict.
hint: echo "Pizza 12" > menu.txt, git add menu.txt, git rebase --continue
solve: git rebase main
solve: echo "Pizza 12" > menu.txt
solve: git add menu.txt
solve: git rebase --continue
```

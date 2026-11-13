---
title: Listing, renaming and deleting branches
minutes: 8
setup: mkdir shop && cd shop && git init -q && echo "shop" > README.md && git add . && git commit -q -m "Start" && git branch login && git branch old-idea && git switch -q -c search && echo "search" > search.txt && git add . && git commit -q -m "Add search" && git switch -q main && git merge -q search
---

Branches pile up fast. Keeping them tidy is part of the job.

## List

```try
git branch
git branch -v
git branch --merged
```

- `git branch` lists local branches. The `*` marks where you are.
- `-v` adds each branch's last commit.
- `--merged` lists branches whose work is already in your current branch. Those are safe to delete. `--no-merged` shows the opposite.

```bash
git branch -a            # also show remote branches like origin/main
git branch -r            # only remote branches
git branch --sort=-committerdate   # most recently used first
```

## Rename

```try
git branch -m login sign-in
git branch
```

`-m` means move. With one name, `git branch -m new-name` renames the branch you are on. This is exactly how people renamed `master` to `main`.

## Delete

```try
git branch -d search
git branch -d old-idea
```

`-d` is the safe delete: it refuses if the branch has work that is not merged anywhere. `old-idea` has no commits of its own, so it goes too.

```try
git branch -D sign-in
```

`-D` (capital) forces it. Use it when you really want to throw the work away.

```warn
Deleting a branch locally does not delete it on GitHub. That is `git push origin --delete NAME`. On GitHub you can also tick "Automatically delete head branches" in the repository settings.
```

```tip
A deleted branch's commits are not gone yet. `git reflog` shows the id, and `git branch NAME ID` brings the branch back. Problem 22 practises this.
```

```quiz
q: Which branches does git branch --merged list?
- Branches that have merge commits
- [x] Branches whose commits are all already in the current branch
- Branches on GitHub
why: Merged branches have nothing new, so deleting them loses nothing.

q: git branch -d feature refuses. What does that tell you?
- The branch does not exist
- [x] It has commits that are not merged yet
- You are on main
why: -d protects unmerged work. Use -D only if you want to drop that work.
```

```mission
title: Spring cleaning
goal: Rename the branch `fix` to `fix-login`. Delete the branch `done`, whose work is already merged. Keep everything else.
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start" && git branch fix && git switch -q -c done && echo "x" > x.txt && git add . && git commit -q -m "Finish x" && git switch -q main && git merge -q done
check: branch fix-login
check: nobranch fix
check: nobranch done
check: head main
check: file x.txt
hint: git branch -m fix fix-login
hint: git branch -d done
solve: git branch -m fix fix-login
solve: git branch -d done
```

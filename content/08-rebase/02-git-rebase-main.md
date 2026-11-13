---
title: git rebase main
minutes: 8
setup: mkdir blog && cd blog && git init -q && echo "blog" > README.md && git add . && git commit -q -m "Start" && git switch -q -c post && echo "draft" > post.md && git add . && git commit -q -m "Write the post" && echo "images" > img.txt && git add . && git commit -q -m "Add images" && git switch -q main && echo "nav" > nav.html && git add . && git commit -q -m "Add navigation" && echo "footer" > footer.html && git add . && git commit -q -m "Add footer" && git switch -q post
---

This is the daily routine in most teams before opening or updating a pull request.

```try
git log --oneline --graph --all
git rebase main
git log --oneline --graph --all
```

## What Git did, step by step

1. Found the commits on `post` that are not on `main`: "Write the post" and "Add images".
2. Moved `post` to the tip of `main`.
3. Replayed each commit, one by one, on top.

## With a real remote

In a real project, `main` lives on GitHub. The full routine is:

```bash
git switch my-feature
git fetch origin                 # get the newest main from GitHub
git rebase origin/main           # replay my work on top of it
git push --force-with-lease      # update my PR branch (the ids changed, so a normal push is rejected)
```

Or, if you just want your local `main` up to date with no merge commits:

```bash
git pull --rebase
git config --global pull.rebase true   # make it the default
```

```tip
`--force-with-lease` is the safe force push. It refuses if someone else pushed to your branch since you last fetched, so you never wipe out a teammate's commit by accident.
```

## Useful flags

```bash
git rebase --onto main old-base feature   # move only part of a branch (problem 38)
git rebase -i main                        # rewrite commits while rebasing (lesson 4)
git rebase --autostash main               # stash uncommitted changes first, re-apply after
git rebase --update-refs main             # also move stacked branches on top (Git 2.38+)
```

```quiz
q: Why is git push --force-with-lease needed after rebasing a branch you already pushed?
- Rebase deletes the remote branch
- [x] The commits got new ids, so the remote branch is no longer an ancestor of yours
- GitHub requires it for every push
why: A normal push only works if it adds on top. Rebased history replaces commits.

q: Which command gets your local main up to date without a merge commit?
- git pull --no-ff
- [x] git pull --rebase
- git fetch --all
why: --rebase replays your local commits on top of the fetched ones.
```

```mission
title: Fresh base
goal: Rebase `post` onto `main`. When you are done, `post` must contain `nav.html` and `footer.html`, and history must be linear.
setup: mkdir blog && cd blog && git init -q && echo "blog" > README.md && git add . && git commit -q -m "Start" && git switch -q -c post && echo "draft" > post.md && git add . && git commit -q -m "Write the post" && git switch -q main && echo "nav" > nav.html && git add . && git commit -q -m "Add navigation" && echo "footer" > footer.html && git add . && git commit -q -m "Add footer"
check: head post
check: linear
check: branchhas post nav.html
check: branchhas post footer.html
check: same post~1 main
hint: First switch to post.
hint: git switch post, then git rebase main
solve: git switch post
solve: git rebase main
```

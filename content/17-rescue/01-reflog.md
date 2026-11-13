---
title: "git reflog: Git's black box"
minutes: 9
setup: mkdir app && cd app && git init -q && echo "1" > a.txt && git add . && git commit -q -m "One" && echo "2" >> a.txt && git commit -q -am "Two" && echo "3" >> a.txt && git commit -q -am "Three" && git reset -q --hard HEAD~2
---

Something terrible happened: two commits are gone after a `reset --hard`. `git log` does not show them.

```try
git log --oneline
git reflog
```

The **reflog** is a diary of **every place HEAD has been** on your machine: every commit, checkout, reset, rebase, merge, amend. Commits that no branch points at are still in the object database, and the reflog remembers their ids.

```
a1b2c3d HEAD@{0}: reset: moving to HEAD~2
f00ba44 HEAD@{1}: commit: Three
e5e5e5e HEAD@{2}: commit: Two
```

## Go back in time

```try
git reset --hard HEAD@{1}
git log --oneline
```

`HEAD@{1}` means "where HEAD was one move ago". Your commits are back.

## Rules of the black box

- It is **local only**. It is never pushed or cloned. Your teammate's reflog is different from yours.
- Entries expire: by default after **90 days**, or **30 days** for commits no branch can reach.
- Each branch has its own reflog too: `git reflog show feature`.
- It does **not** save uncommitted work. If it was never committed (or at least staged), it is truly gone.

```bash
git reflog --date=relative      # "HEAD@{2 hours ago}"
git log -g --oneline            # the reflog, shown like a log
git switch -c rescue HEAD@{3}   # rescue onto a new branch instead of resetting
```

```tip
Before any scary command (a big rebase, a filter, a force push), make a backup branch: `git branch backup-before-rebase`. It costs nothing and turns panic into one command.
```

```quiz
q: Is the reflog shared when you push?
- Yes
- [x] No, it only exists in your local repository
why: It records your HEAD movements, on your machine only.

q: Can the reflog bring back changes that were never committed?
- Yes
- [x] No
why: It only remembers commits. Uncommitted edits are not in it.
```

```mission
title: Undo the undo
goal: Someone ran `git reset --hard` and lost the commits `Add login` and `Add logout`. Bring `main` back to the commit `Add logout`.
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start" && echo "in" > login.js && git add . && git commit -q -m "Add login" && echo "out" > logout.js && git add . && git commit -q -m "Add logout" && git reset -q --hard HEAD~2
check: head main
check: exactcommits 3
check: message Add logout
check: file login.js
hint: git reflog lists every place HEAD has been.
hint: git reset --hard HEAD@{1}
solve: git reset --hard HEAD@{1}
```

---
title: Unstage a file
minutes: 6
setup: mkdir app && cd app && git init -q && echo "v1" > app.js && git add . && git commit -q -m "Start"
---

You ran `git add .` and staged too much. Maybe a password file, maybe a file you are not done with. You want it **out of the staging area**, but you want to keep your edits.

```try
echo "v2" > app.js
echo "PASSWORD=hunter2" > secrets.txt
git add .
git status
git restore --staged secrets.txt
git status
```

`git restore --staged FILE` moves the file back out of the box. Your file is untouched. It is just not going into the next commit.

```tip
Read the hints in `git status`. Under "Changes to be committed" it literally says: `(use "git restore --staged <file>..." to unstage)`.
```

## Older ways you will see online

```bash
git reset HEAD secrets.txt     # the classic way, same result
git reset secrets.txt          # shorter, HEAD is the default
git rm --cached secrets.txt    # different! for a tracked file, it stages a DELETE
```

```warn
`git rm --cached` is for "stop tracking this file forever" (keep it on disk, remove it from the repo). For "oops, I staged this by accident", use `git restore --staged`.
```

```quiz
q: Does git restore --staged change the file on your disk?
- Yes, it reverts the file
- [x] No, it only takes it out of the staging area
why: --staged only touches the staging area. Without --staged, restore touches your working folder.

q: You staged 10 files and want to unstage all of them. Which command?
- git restore .
- [x] git restore --staged .
- git rm -r .
why: --staged . unstages everything and keeps your edits. git restore . would throw the edits away.
```

```mission
title: Not that one
goal: Everything got staged. Unstage `secrets.txt` (keep the file on disk), then commit the rest.
setup: mkdir app && cd app && git init -q && echo "v1" > app.js && git add . && git commit -q -m "Start" && echo "v2" > app.js && echo "PASSWORD=hunter2" > secrets.txt && git add .
check: untracked secrets.txt
check: file secrets.txt
check: nottracked secrets.txt
check: contains app.js v2
check: commits 2
hint: git restore --staged secrets.txt
hint: Then git commit -m "Update app"
solve: git restore --staged secrets.txt
solve: git commit -m "Update app"
```

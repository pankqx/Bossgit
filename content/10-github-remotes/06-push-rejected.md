---
title: When a push is rejected
minutes: 9
setup: bossgit github https://github.com/team/app && mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start" && git remote add origin https://github.com/team/app && git push -q -u origin main && bossgit teammate https://github.com/team/app team.txt Sam was here && echo "mine" > mine.txt && git add . && git commit -q -m "My work"
---

This is the most common Git error in the world:

```try
git push
```

```
! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'https://github.com/team/app'
hint: Updates were rejected because the remote contains work that you do not have locally.
```

## Why it happens

GitHub's `main` has Sam's commit. Your `main` has yours. Neither contains the other. If GitHub accepted your push, Sam's commit would vanish. Git refuses to lose work.

```flow
flowchart LR
  S[Start] --> T["Sam's commit (on GitHub)"]
  S --> Y["Your commit (on your laptop)"]
```

## The fix: integrate, then push

```try
git pull --rebase
git log --oneline --graph
git push
```

`pull --rebase` put your commit on top of Sam's. Now your branch **contains** GitHub's, and the push is a simple fast-forward.

## What NOT to do

```bash
git push --force      # overwrites GitHub with your version: Sam's commit is deleted
```

```warn
`--force` is how teams lose work. If you truly need to overwrite your **own** branch after a rebase, use `git push --force-with-lease`, which refuses if anyone else pushed in the meantime.
```

## Other rejections you will meet

| Message | Meaning | Fix |
|---|---|---|
| `non-fast-forward` / `fetch first` | Remote has new commits | `git pull --rebase`, then push |
| `protected branch hook declined` | Branch protection on GitHub | Push a branch and open a pull request |
| `Permission denied (publickey)` | SSH key not set up | Module lesson 2, `ssh -T git@github.com` |
| `GH013: Repository rule violations` / push protection | A secret was found in your commit | Remove the secret from the commit (module 21) |
| `file exceeds GitHub's file size limit of 100 MB` | Big file | Remove it from history, use Git LFS |

```quiz
q: Your push is rejected with "fetch first". What is the safe fix?
- git push --force
- [x] git pull --rebase, then git push
- Delete the repository
why: Integrate the remote work first. Then your push only adds commits.

q: When is --force-with-lease better than --force?
- Never
- [x] It refuses to overwrite commits you have not seen yet
why: It checks the remote is still where you last fetched it.
```

```mission
title: The Rejected Push
boss: true
goal: Your push to `main` is rejected because Sam pushed first. Get your commit onto GitHub **without** losing Sam's, with a straight-line history.
setup: bossgit github https://github.com/team/shop && mkdir shop && cd shop && git init -q && echo "shop" > README.md && git add . && git commit -q -m "Start" && git remote add origin https://github.com/team/shop && git push -q -u origin main && bossgit teammate https://github.com/team/shop sam.txt Sam was here && echo "mine" > mine.txt && git add . && git commit -q -m "My work"
check: pushed main
check: branchhas main sam.txt
check: branchhas main mine.txt
check: linear
check: nooperation
hint: git pull --rebase
hint: then git push
solve: git pull --rebase
solve: git push
```

---
title: git push and upstream
minutes: 8
setup: bossgit github https://github.com/you/portfolio && mkdir portfolio && cd portfolio && git init -q && echo "Hi, I am Pankaj" > index.html && git add . && git commit -q -m "First page"
---

You made a repository on your laptop. Now you want it on GitHub. On github.com you create an **empty** repository (no README), then connect and push:

```try
git remote add origin https://github.com/you/portfolio
git push -u origin main
```

`-u` (or `--set-upstream`) links your local `main` to `origin/main`. After that, a plain `git push` and `git pull` know where to go.

```try
echo "Projects" >> index.html
git commit -qam "Add projects section"
git status
git push
```

`git status` said "Your branch is ahead of 'origin/main' by 1 commit". That line only appears once an upstream is set.

## Pushing a new branch

```try
git switch -c contact
echo "email me" > contact.html
git add . && git commit -m "Add contact page"
git push -u origin contact
```

```tip
Tired of typing `-u origin branch-name` for every new branch? Run `git config --global push.autoSetupRemote true` once (Git 2.37+). Then `git push` on a new branch just works.
```

```bash
git push origin --delete contact   # delete a branch on GitHub
git push --tags                    # send tags
git branch -vv                     # see which upstream each branch tracks
```

```quiz
q: What does -u do in git push -u origin main?
- Undoes the last push
- [x] Remembers origin/main as the upstream, so later git push needs no arguments
why: -u sets the tracking link.

q: git status says "ahead of origin/main by 2 commits". What does that mean?
- GitHub has 2 commits you do not have
- [x] You have 2 commits that are not on GitHub yet
why: Ahead means you have more. Behind means the remote has more.
```

```mission
title: Go public
goal: Connect this repo to `https://github.com/you/blog` as `origin` and push `main`, with upstream set.
setup: bossgit github https://github.com/you/blog && mkdir blog && cd blog && git init -q && echo "My blog" > index.md && git add . && git commit -q -m "First post"
check: remote origin
check: pushed main
check: run git status => origin/main
hint: git remote add origin https://github.com/you/blog
hint: git push -u origin main
solve: git remote add origin https://github.com/you/blog
solve: git push -u origin main
```

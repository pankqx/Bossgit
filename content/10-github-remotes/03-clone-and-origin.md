---
title: git clone and origin
minutes: 8
setup: bossgit github https://github.com/team/notes && mkdir seed && cd seed && git init -q && echo "# Notes" > README.md && git add . && git commit -q -m "Start notes" && git remote add origin https://github.com/team/notes && git push -q -u origin main && cd ~ && rm -r seed
---

`git clone` downloads a whole repository, **with all its history**, and sets it up so you can push back.

```try
git clone https://github.com/team/notes
cd notes
git log --oneline
git remote -v
```

## What clone did

1. Made a folder called `notes`.
2. Downloaded every commit, branch and tag.
3. Added a **remote** called `origin` that points at the URL.
4. Made a local `main` that **tracks** `origin/main`.

```flow
flowchart LR
  G[(github.com/team/notes)] -- clone --> L[(your notes folder)]
  L -- "origin = the URL" --> G
```

`origin` is only a nickname. It is the default name for "where I cloned from". You can have more remotes, like `upstream` for the original project when you work on a fork.

## Remote-tracking branches

```try
git branch -a
```

`remotes/origin/main` is your laptop's **memory** of where `main` was on GitHub the last time you talked to it. It only updates when you `fetch`, `pull` or `push`.

## Useful clone options

```bash
git clone URL my-folder          # choose the folder name
git clone --depth 1 URL          # only the latest commit (fast, for CI)
git clone --branch v2.0 URL      # start on a branch or tag
git clone --filter=blob:none URL # partial clone: history now, file contents when needed (module 25)
```

```quiz
q: What is origin?
- A special branch
- [x] A nickname for the URL you cloned from
- The first commit
why: It is just the default remote name. You could rename it.

q: Does origin/main update by itself when a teammate pushes?
- Yes, instantly
- [x] No, only when you fetch, pull or push
why: It is a local record of the remote, refreshed when you talk to the server.
```

```mission
title: Get the code
goal: Clone `https://github.com/team/api` and go into the folder, so you are inside a repository that has a remote called `origin`.
setup: bossgit github https://github.com/team/api && mkdir seed && cd seed && git init -q && echo "api" > README.md && git add . && git commit -q -m "Start api" && git remote add origin https://github.com/team/api && git push -q -u origin main && cd ~ && rm -r seed
check: cwd api
check: repo
check: remote origin
check: same main origin/main
hint: git clone https://github.com/team/api
hint: cd api
solve: git clone https://github.com/team/api
solve: cd api
```

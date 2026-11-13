---
title: The brief
minutes: 10
---

Most developers use Git for years without knowing how it works. You are about to build it.

## What you will build

| Part | What it is | You will learn |
|---|---|---|
| **minigit** | A command-line Git in about 250 lines of Node.js, no libraries | objects, hashing, trees, commits, refs, the index, checkout |
| **MiniHub** | A web server that hosts repos, speaks Git's HTTP protocol, shows files and commits, and merges pull requests | bare repos, smart HTTP, server-side merges, how GitHub works |
| **The project** | Both, shipped on GitHub with issues, PRs, CI, releases and docs | everything from modules 10 to 28, for real |

The reference code is in the BossGit repository under [`capstone/`](https://github.com/pankqx/Bossgit/tree/main/capstone). **Do not copy it.** Write your own, then compare. Typing it yourself is where the learning happens.

## The one rule that makes this impressive

**minigit must be compatible with real Git.** A repository made by minigit must pass `git fsck`, and `git log` must show its commits. That is your test suite: the real Git checks your work.

## Setup

```bash
node --version            # 20 or newer
git --version             # 2.38 or newer (MiniHub needs git merge-tree --write-tree)
mkdir minigit && cd minigit
git init                  # yes: use real Git to version your own Git
gh repo create minigit --public --source=. --push
```

## How to work: like a team of one

1. Create a **GitHub Project** board with one issue per lesson in this module.
2. For each lesson: branch (`feat/objects`), commit in small steps, open a **PR**, let CI run, merge with **squash**.
3. Tag a release at the end of each milestone: `v0.1.0` objects, `v0.2.0` commits, `v0.3.0` branches, `v1.0.0` MiniHub.

```tip
Keep a `NOTES.md` as you go: what surprised you, what broke, how you fixed it. It becomes your blog post and your interview story.
```

```quiz
q: How will you know minigit is correct?
- It prints nice output
- [x] Real Git can read its repositories: git fsck passes and git log shows the commits
why: Byte-for-byte compatibility with real Git is the test.

q: How should you use the reference code in capstone/?
- Copy it all on day one
- [x] Write your own first, then compare
why: Building it yourself is the point. The reference is for checking.
```

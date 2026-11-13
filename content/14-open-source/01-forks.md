---
title: Forks and upstream
minutes: 8
setup: bossgit github https://github.com/maker/tool && bossgit github https://github.com/you/tool && mkdir seed && cd seed && git init -q && echo "tool v1" > README.md && git add . && git commit -q -m "v1" && git remote add origin https://github.com/maker/tool && git push -q -u origin main && git remote add mine https://github.com/you/tool && git push -q mine main && cd ~ && rm -r seed
---

You want to fix a bug in someone else's open source project. You do not have permission to push to their repository. So you **fork** it.

## What a fork is

A fork is **your own copy of the repository on GitHub**, under your account, with the full history. You can push to it freely. Then you open a pull request **from your fork to the original**.

```flow
flowchart LR
  U[(maker/tool: upstream)] -- Fork button --> F[(you/tool: origin)]
  F -- clone --> L[(your laptop)]
  L -- push --> F
  F -- pull request --> U
```

## The setup

On GitHub click **Fork**. Then:

```try
git clone https://github.com/you/tool
cd tool
git remote add upstream https://github.com/maker/tool
git remote -v
```

By convention:

| Remote | Points at | You can push? |
|---|---|---|
| `origin` | **your fork** | yes |
| `upstream` | **the original** project | no |

```bash
gh repo fork maker/tool --clone      # fork, clone and add upstream in one command
```

```tip
Always make a **branch** in your fork for each PR (`fix/typo-in-docs`). Never work on your fork's `main`. Keeping `main` identical to upstream makes syncing painless.
```

```quiz
q: In a fork setup, what is upstream?
- Your fork
- [x] The original project you forked from
why: origin is your fork; upstream is the source.

q: Why do you need a fork to contribute to most open source projects?
- Forks are faster
- [x] You do not have push access to the original repository
why: You push to your fork, then ask the maintainers to pull from it.
```

```mission
title: Two remotes
goal: Clone your fork `https://github.com/you/tool`, go inside, and add the original `https://github.com/maker/tool` as a remote called `upstream`.
setup: bossgit github https://github.com/maker/tool && bossgit github https://github.com/you/tool && mkdir seed && cd seed && git init -q && echo "tool v1" > README.md && git add . && git commit -q -m "v1" && git remote add origin https://github.com/maker/tool && git push -q -u origin main && git remote add mine https://github.com/you/tool && git push -q mine main && cd ~ && rm -r seed
check: cwd tool
check: remote origin
check: remote upstream
check: run git remote get-url upstream => maker/tool
hint: git clone https://github.com/you/tool, then cd tool
hint: git remote add upstream https://github.com/maker/tool
solve: git clone https://github.com/you/tool
solve: cd tool
solve: git remote add upstream https://github.com/maker/tool
```

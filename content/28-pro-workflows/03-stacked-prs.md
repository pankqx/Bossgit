---
title: Stacked pull requests
minutes: 9
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start" && git switch -q -c api && echo "api" > api.js && git add . && git commit -q -m "feat: add the API" && git switch -q -c ui && echo "ui" > ui.js && git add . && git commit -q -m "feat: add the UI" && git switch -q main && echo "hotfix" > fix.txt && git add . && git commit -q -m "fix: hotfix" && git switch -q ui
---

A 1,500-line feature in one PR waits days for review. Split it into a **stack** of small PRs, each building on the one before:

```flow
flowchart LR
  M[main] --> A["PR 1: api (base: main)"] --> B["PR 2: ui (base: api)"] --> C["PR 3: docs (base: ui)"]
```

Reviewers can approve PR 1 while you keep working on PR 3. Meta, Google and many startups work this way all day.

## The pain point: updating the stack

When `main` moves, or PR 1 changes after review, every branch above it must be rebased. Modern Git does it in one command:

```try
git log --oneline --graph --all
git rebase main
git log --oneline --graph --all
```

`ui` now sits on the new `main`, with a fresh copy of the API commit inside it. But look: the `api` branch was **left behind** on the old commit. PR 1 still shows the old code. Fix it by hand:

```try
git branch -f api ui~1
git log --oneline --graph --all
```

That is exactly the job `--update-refs` does for you. In a real terminal, with Git 2.38+, from the **top** of the stack:

```bash
git switch docs
git rebase --update-refs main      # rebases ui and api along the way and moves their branches too
git push --force-with-lease origin api ui docs
```

Set `git config --global rebase.updateRefs true` to make it the default.

## After the bottom PR merges

If PR 1 is **squash merged**, its commits on `main` have new ids. Rebase the rest with `--onto`:

```bash
git rebase --onto main api ui      # replay only ui's commits onto the new main
```

Then change PR 2's base to `main` on GitHub (GitHub does this automatically if the `api` branch is deleted).

## Tools that help

**Graphite**, **ghstack**, **spr**, **git-town**, and Meta's **Sapling** manage stacks and their PRs for you.

```quiz
q: In a stack, what is the base branch of PR 2?
- main
- [x] The branch of PR 1
why: Each PR shows only its own changes on top of the one below.

q: Which flag rebases a stack and moves all the branches in it?
- --autosquash
- [x] --update-refs
why: --update-refs updates every branch that points into the rebased commits.
```

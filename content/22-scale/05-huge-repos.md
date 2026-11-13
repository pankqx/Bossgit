---
title: Performance in huge repositories
minutes: 7
---

When a repo has a million files or a decade of history, `git status` can take seconds and `git clone` an hour. Modern Git has tools for this.

## Turn on the built-in boosters

```bash
git maintenance start            # background jobs: prefetch, commit-graph, repack, gc
git config core.fsmonitor true   # a file watcher tells Git what changed (macOS and Windows)
git config core.untrackedCache true
git config feature.manyFiles true
git config fetch.writeCommitGraph true
```

`git maintenance start` registers scheduled tasks with your operating system, so the heavy work happens while you are not waiting.

## scalar

`scalar` ships with Git (since 2.38). It was created by Microsoft to work on the Windows repository, which is around 300 GB. One command sets up everything above, plus partial clone and sparse checkout:

```bash
scalar clone https://github.com/acme/monorepo
scalar register          # apply the settings to an existing clone
```

## Measuring

```bash
GIT_TRACE_PERFORMANCE=1 git status    # see where the time goes
git count-objects -vH                 # how big is the object store?
git rev-list --count --all            # how many commits?
```

## Common slow-downs and fixes

| Symptom | Likely cause | Fix |
|---|---|---|
| Slow `status` | huge working folder | fsmonitor, untracked cache, sparse checkout |
| Slow `log --graph` | no commit-graph | `git commit-graph write --reachable` |
| Huge clone | big binary files in history | LFS, filter-repo, partial clone |
| Slow fetch | thousands of refs | prune old branches, `fetch.prune`, ref filtering |

```quiz
q: Which command sets up background maintenance tasks for a repo?
- git gc --aggressive
- [x] git maintenance start
why: It schedules prefetch, commit-graph and repack jobs.

q: What is scalar?
- A GitHub feature
- [x] A tool shipped with Git that configures big-repo optimisations
why: It turns on partial clone, sparse checkout, fsmonitor and maintenance in one step.
```

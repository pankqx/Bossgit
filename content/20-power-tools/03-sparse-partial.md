---
title: Sparse checkout and partial clone
minutes: 7
---

Big companies have huge repositories: millions of files, hundreds of gigabytes of history. You only work on one small part. Two features make that fast.

## Partial clone: download less history

```bash
git clone --filter=blob:none https://github.com/acme/monorepo     # all commits and trees, file contents on demand
git clone --filter=tree:0 https://github.com/acme/monorepo        # even trees on demand (good for CI)
git clone --depth 1 https://github.com/acme/monorepo              # shallow: only the newest commit
```

`blob:none` is the best default for developers: `git log` works fully, and old file contents download only when you look at them.

## Sparse checkout: put fewer files on disk

```bash
git clone --filter=blob:none --sparse https://github.com/acme/monorepo
cd monorepo
git sparse-checkout set apps/web packages/ui      # only these folders appear
git sparse-checkout add docs
git sparse-checkout list
git sparse-checkout disable                       # everything again
```

The history is all there. Only the **working folder** is smaller, so `git status` and your editor are fast.

| | Saves | Use when |
|---|---|---|
| Shallow (`--depth`) | download time | CI builds that only need the latest code |
| Partial (`--filter`) | download time and disk | daily work in big repos |
| Sparse checkout | files on disk, status speed | you only need some folders |

```warn
Shallow clones break commands that need history: `git log` stops early, `merge-base` can fail, and some CI tools (like changelog generators) need `fetch-depth: 0` in `actions/checkout`.
```

```quiz
q: You need full git log, but want a fast clone of a 20 GB repo. What fits best?
- --depth 1
- [x] --filter=blob:none
why: Partial clone keeps all commits, fetching file contents only when needed.

q: What does sparse checkout change?
- Which commits you have
- [x] Which files appear in your working folder
why: History is untouched; only the checked-out files are limited.
```

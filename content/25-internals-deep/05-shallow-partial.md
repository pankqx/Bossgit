---
title: Shallow clones and partial clones in depth
minutes: 7
---

Both make clones smaller. They cut in **different directions**.

```flow
flowchart TB
  subgraph "Shallow (--depth)"
    S1[newest commits only] --- S2[full files for them]
  end
  subgraph "Partial (--filter)"
    P1[ALL commits and trees] --- P2[file contents fetched on demand]
  end
```

## Shallow clone

```bash
git clone --depth 1 URL                 # 1 commit
git clone --shallow-since=2025-01-01 URL
git fetch --deepen=100                  # get 100 more commits of history
git fetch --unshallow                   # become a full clone
cat .git/shallow                        # the "fake root" commits
```

History is **cut off**. Great for CI builds. Bad for anything that needs history: `blame`, `log`, `merge-base`, `describe`, changelog tools.

In GitHub Actions, `actions/checkout` is shallow by default (`fetch-depth: 1`). Set `fetch-depth: 0` when a job needs tags or history.

## Partial clone

```bash
git clone --filter=blob:none URL        # no file contents until needed (best for developers)
git clone --filter=blob:limit=1m URL    # skip only blobs over 1 MB
git clone --filter=tree:0 URL           # no trees either (best for CI that reads one commit)
```

You have the **full** commit graph, so `log`, `merge-base` and `rebase` work. When you check out or diff an old version, Git quietly downloads the missing blobs from the **promisor remote**.

| | Shallow | Partial (`blob:none`) |
|---|---|---|
| Full history | no | yes |
| Works offline later | yes, for what you have | needs network for old file contents |
| Best for | throwaway CI builds | everyday work on big repos |

```quiz
q: Your release job needs all tags to compute the version, but checkout is shallow. Fix?
- Use --filter=tree:0
- [x] Set fetch-depth: 0 in actions/checkout
why: A shallow clone does not have the tags and history that the tool needs.

q: Which clone keeps every commit but downloads file contents lazily?
- --depth 1
- [x] --filter=blob:none
why: Partial clone keeps the commit graph and fetches blobs on demand.
```

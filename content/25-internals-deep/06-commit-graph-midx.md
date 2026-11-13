---
title: The commit-graph and multi-pack index
minutes: 6
---

To draw `git log --graph`, or answer "is A an ancestor of B?", Git must walk commits. Reading and decompressing each commit object is slow when there are millions. Two extra files fix that.

## commit-graph

`.git/objects/info/commit-graph` stores, for every commit, in a fast binary format:

- its id, tree id and parent ids,
- its commit date,
- its **generation number**: the length of the longest path to a root commit.

Generation numbers let Git **stop early**. If A's generation is lower than B's, A cannot be a descendant of B. On big repos, `git log --graph`, `merge-base` and `branch --contains` go from seconds to milliseconds.

```bash
git commit-graph write --reachable --changed-paths   # changed-paths adds Bloom filters: fast "git log -- file"
git config fetch.writeCommitGraph true
```

## Multi-pack index (MIDX)

A repo that fetches often ends up with many packfiles, and Git must search each `.idx` to find an object. A **multi-pack index** (`.git/objects/pack/multi-pack-index`) is one index over **all** packs. With **reachability bitmaps**, the server can also answer "which objects does this clone need?" almost instantly. GitHub relies on these heavily.

```bash
git multi-pack-index write --bitmap
git maintenance run --task=commit-graph --task=incremental-repack
```

```tip
You rarely run these by hand. `git maintenance start` and `scalar` set them up. But knowing they exist explains why one person's Git is slow and another's is fast on the same repo.
```

```quiz
q: What does a generation number help Git do?
- Sign commits
- [x] Skip large parts of history when checking ancestry
why: It gives a quick lower bound for whether one commit can reach another.

q: What do changed-path Bloom filters speed up?
- git push
- [x] git log -- some/file
why: They let Git skip commits that certainly did not touch the path.
```

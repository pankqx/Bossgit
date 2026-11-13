---
title: "Delta compression: how Git saves space"
minutes: 7
---

Earlier you learned Git stores **snapshots**, not diffs. That is true for the **model**. Inside a packfile, Git is cleverer: it stores many objects as **deltas** against similar objects.

## How it works

1. Git sorts objects by type, file name and size, so versions of the same file sit next to each other.
2. For each object it tries the nearby ones (a **window**, default 10) and asks: "can I describe this as *that one + small changes*?"
3. If the delta is much smaller, it stores the delta. Chains can be up to 50 deep (`pack.depth`).
4. The **newest** version is usually stored in full and older ones as deltas, because you read new versions far more often.

```flow
flowchart LR
  F["app.js v10 (full, 40 KB)"] --> D9["v9 = v10 + delta (300 B)"] --> D8["v8 = v9 + delta (250 B)"]
```

That is how the Linux kernel's 1.3 million commits fit in a few GB.

```bash
git gc --aggressive        # try much harder (bigger window, deeper chains); slow, rarely needed
git repack -a -d -f --depth=50 --window=250   # what --aggressive roughly does
```

## What compresses badly

Already-compressed files: JPG, PNG, MP4, ZIP, PDF, compiled binaries. A small edit changes the whole file, so deltas do not help. That is why big binaries belong in Git LFS.

```quiz
q: Does a packfile store every version of a file in full?
- Yes
- [x] No, many are stored as deltas against similar objects
why: Delta compression is what keeps packs small.

q: Why do video files bloat repositories?
- Git cannot store them
- [x] They are already compressed, so deltas between versions are not small
why: Each new version costs nearly its full size.
```

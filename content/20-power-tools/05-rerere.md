---
title: "git rerere: let Git remember conflict fixes"
minutes: 6
---

**rerere** means **re**use **re**corded **re**solution. When it is on, Git records how you resolved each conflict. If the **same** conflict appears again, Git applies your fix automatically.

```bash
git config --global rerere.enabled true
git config --global rerere.autoUpdate true    # also stage the auto-fixed files
```

## When it saves you

- You rebase a long branch onto `main` every day and fix the same conflict every day.
- You test-merge a feature, abort, and merge again later.
- You resolve conflicts while rebasing, abort, and start the rebase again.

## What it looks like

```
CONFLICT (content): Merge conflict in checkout.js
Resolved 'checkout.js' using previous resolution.
```

You still review the result and run the tests, then `git add` (unless autoUpdate is on) and continue.

```bash
git rerere status       # files rerere is tracking right now
git rerere diff         # what it would apply
git rerere forget checkout.js   # it learned a bad fix; forget it
```

The recordings live in `.git/rr-cache/`, so they are local to your clone.

```quiz
q: What does rerere do?
- Rebases automatically
- [x] Replays your earlier conflict resolution when the same conflict happens again
why: It records resolutions and reuses them.

q: rerere learned a wrong resolution. What do you do?
- Delete the repository
- [x] git rerere forget FILE, then resolve it correctly
why: forget removes the recorded resolution for that path.
```

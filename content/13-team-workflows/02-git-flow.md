---
title: Git Flow
minutes: 8
---

**Git Flow** was described by Vincent Driessen in 2010 and was very popular for software that ships **versioned releases**. You will meet it in banks, enterprise software, embedded systems and older codebases.

## The branches

| Branch | Lives | Purpose |
|---|---|---|
| `main` | forever | Only released code. Every commit is a tagged version. |
| `develop` | forever | Integration branch for the next release. |
| `feature/*` | days to weeks | New work, branched from and merged back into `develop`. |
| `release/*` | days | Freeze and stabilise a version: only bug fixes. Merged into `main` **and** `develop`. |
| `hotfix/*` | hours | Urgent fix from `main`. Merged into `main` **and** `develop`. |

```flow
flowchart LR
  F[feature/login] --> D[develop]
  D --> R[release/2.0]
  R --> M[main + tag v2.0.0]
  R --> D
  M --> H[hotfix/2.0.1]
  H --> M
  H --> D
```

## Honest opinion

Git Flow is **heavy**. Two long-lived branches, merges in two directions, and long feature branches that conflict. Even its author added a note in 2020 saying that for web apps that deploy continuously, a simpler flow like GitHub Flow is a better fit.

It still makes sense when you must **support several versions at once** (for example 1.x and 2.x of a library), or when releases are planned months ahead.

```fact
The `git flow` command-line extension (git-flow, later git-flow-avh) automates the branch commands: `git flow feature start login`, `git flow release finish 2.0`.
```

```quiz
q: In Git Flow, which branch do feature branches start from?
- main
- [x] develop
- release
why: Features are integrated into develop, which becomes the next release.

q: A hotfix in Git Flow is merged into which branches?
- Only main
- Only develop
- [x] main and develop
why: The fix must ship now (main) and must not be lost in the next release (develop).
```

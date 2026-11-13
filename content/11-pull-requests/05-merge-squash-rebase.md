---
title: Merge, squash or rebase?
minutes: 8
---

The green button on a pull request has a dropdown with three choices. Teams usually pick one and turn the others off in **Settings → General → Pull Requests**.

```flow
flowchart TD
  subgraph "Create a merge commit"
    a1[main] --> a2[Merge PR #42]
    b1[commit 1] --> b2[commit 2] --> b3[commit 3] --> a2
  end
  subgraph "Squash and merge"
    c1[main] --> c2["Add wishlist (#42)"]
  end
  subgraph "Rebase and merge"
    d1[main] --> d2[commit 1'] --> d3[commit 2'] --> d4[commit 3']
  end
```

| Option | Result on main | Good for | Watch out |
|---|---|---|---|
| **Create a merge commit** | All PR commits + a merge commit | Keeping full history; reverting a whole PR with one command | Busy graph |
| **Squash and merge** | One single commit per PR | Clean main, one PR = one commit, easy revert | Detailed commit history of the PR is gone from main |
| **Rebase and merge** | PR commits replayed on top, no merge commit | Linear history with meaningful small commits | Every commit must be clean and build on its own |

## What most teams choose

**Squash and merge** is the most popular in product companies. The PR title becomes the commit message, so with Conventional Commit titles (`feat: add wishlist (#42)`) the main history reads like a changelog.

```warn
After a squash merge, your local feature branch is **not** "merged" in Git's eyes, because main got a new commit with a different id. `git branch -d` will refuse. Use `git branch -D` once you have checked the PR is merged.
```

## Related settings worth turning on

- **Automatically delete head branches** after merge.
- **Allow auto-merge**: the PR merges itself once reviews and checks pass (`gh pr merge --auto --squash`).
- **Always suggest updating pull request branches**.
- **Merge queue** for busy repos (module 22).

```quiz
q: Your team wants exactly one commit on main per pull request. Which option?
- Create a merge commit
- [x] Squash and merge
- Rebase and merge
why: Squash turns all of the PR's commits into one.

q: After squash merging, git branch -d feature refuses. Why?
- The branch is protected
- [x] The squashed commit has a different id, so Git does not see the branch as merged
why: Git compares commits, not content. Use -D after confirming the PR merged.
```

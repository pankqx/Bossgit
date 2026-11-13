---
title: Branch protection and rulesets
minutes: 9
---

Rules on GitHub stop mistakes before they happen. Without them, anyone with write access can force-push `main` and wipe a week of work.

## Where

- **Settings → Rules → Rulesets** (the modern way, since 2023). A ruleset can target many branches or tags by pattern, can be applied to a whole organization, and has an **Evaluate** mode to test rules before turning them on.
- **Settings → Branches → Branch protection rules** (the classic way, still common).

## The rules every team should turn on for main

| Rule | What it prevents |
|---|---|
| **Require a pull request before merging** | Direct pushes to main |
| **Required approvals** (1 or 2) | Unreviewed code |
| **Dismiss stale approvals when new commits are pushed** | Sneaking changes in after approval |
| **Require review from Code Owners** | Changes to a module without its owners |
| **Require status checks to pass** (pick your CI jobs) | Merging red builds |
| **Require branches to be up to date** | Passing tests on an old base |
| **Require conversation resolution** | Ignored review comments |
| **Block force pushes** | Rewritten history |
| **Restrict deletions** | Deleted main |
| **Require linear history** | Merge commits (if you squash or rebase) |
| **Require signed commits** | Unverified authors |

```flow
flowchart LR
  P[git push origin main] -->|blocked| X[Rule: require a PR]
  B[git push origin feature] --> PR[Pull request] --> C{Approvals + checks?}
  C -->|yes| M[Merge allowed]
  C -->|no| W[Wait]
```

## What you see in the terminal

```
remote: error: GH006: Protected branch update failed for refs/heads/main.
remote: - Changes must be made through a pull request.
```

That is not a bug. Push a branch, open a PR.

```tip
Allow a **bypass list** only for a release bot or an admin team, and keep "Do not allow bypassing the above settings" on for everyone else. Rules that admins quietly bypass are not rules.
```

```quiz
q: Which rule stops someone from wiping history on main?
- Require approvals
- [x] Block force pushes
why: Force pushing is how history is overwritten.

q: You get "GH006: Protected branch update failed". What should you do?
- Ask for admin and push again
- [x] Push to a branch and open a pull request
why: The rule exists so changes go through review.
```

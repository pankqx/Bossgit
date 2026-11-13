---
title: Trunk-based development vs Git Flow vs GitHub Flow
minutes: 8
---

You learned each workflow in module 13. Here is how to **choose** one, and how to explain the choice like a senior engineer.

## Ask four questions

1. **How do we ship?** Continuously (web, SaaS) or as versions (mobile, desktop, libraries, firmware)?
2. **Do we support old versions?** If customers run 2.x and 3.x, you need release branches.
3. **How strong is our CI?** Without fast, reliable tests, short-lived branches merge broken code.
4. **How big is the team?** 3 people or 300 merging into one repo?

```flow
flowchart TD
  A{Ship continuously?} -->|yes| B{Strong CI + feature flags?}
  B -->|yes| T[Trunk-based]
  B -->|not yet| G[GitHub Flow]
  A -->|no, versioned| C{Support several versions?}
  C -->|yes| R["Trunk-based + release branches (or Git Flow)"]
  C -->|no| G2["GitHub Flow + tags"]
```

## The honest summary

| | GitHub Flow | Git Flow | Trunk-based |
|---|---|---|---|
| Branches | main + short feature branches | main, develop, feature, release, hotfix | main (+ very short branches) |
| Typical team | startups, product teams | enterprise, versioned software | high-performing teams at any scale |
| Integration | every PR | at release time | many times a day |
| Main risk | big PRs that sit for days | merge hell, slow releases | broken main if CI is weak |

## Interview answer template

> "We used **GitHub Flow with squash merges**. Every PR needed one approval and green CI, and main deployed automatically. We used feature flags for anything bigger than a day of work, so branches stayed short. For the mobile app we added `release/x.y` branches, because App Store reviews mean versions live for weeks."

```quiz
q: A SaaS team deploys 20 times a day with fast tests and feature flags. Which workflow fits best?
- Git Flow
- [x] Trunk-based
why: Continuous delivery plus strong CI and flags is exactly what trunk-based needs.

q: A library must patch 2.x while 3.x is developed. What do they need?
- Only main
- [x] Release branches for supported versions
why: Fixes must be applied to old versions separately.
```

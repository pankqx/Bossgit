---
title: Trunk-based development
minutes: 7
---

**Trunk-based development** is how many of the biggest engineering organizations work, including Google, which keeps most of its code in one giant repository. Everyone integrates into one branch (the **trunk**, which is `main`) at least once a day.

## The rules

- Branches live **hours, maybe a day or two**. Never weeks.
- PRs are **small**.
- Unfinished features are merged **hidden behind feature flags**.
- **Automated tests** on every change are non-negotiable.
- Releases are cut from the trunk, sometimes as short-lived `release/*` branches for hotfixes only.

```flow
flowchart LR
  A[small branch] --> T((main))
  B[small branch] --> T
  C[small branch] --> T
  T --> R[release from main]
```

## Why it works

Merge conflicts grow with **time apart**. If everyone merges daily, conflicts stay tiny. The research behind the book *Accelerate* (the DORA reports) found that teams with short-lived branches and frequent integration deliver faster **and** have fewer failures.

## Compared

| | GitHub Flow | Git Flow | Trunk-based |
|---|---|---|---|
| Long-lived branches | main | main + develop | main |
| Feature branch life | days | days to weeks | hours |
| Needs feature flags | helpful | no | **yes** |
| Best for | web apps | versioned releases | high-speed teams of any size |

```tip
In interviews, "how does your team branch?" is a common question. A strong answer names the workflow, why it fits the product, and how CI and flags make it safe.
```

```quiz
q: In trunk-based development, how long should a feature branch live?
- Until the feature is 100% done
- [x] Hours to a day or two
why: Short branches keep conflicts small and integration continuous.

q: How do you merge an unfinished feature to main safely?
- You cannot
- [x] Put it behind a feature flag that is off
why: The code ships but stays invisible until the flag is turned on.
```

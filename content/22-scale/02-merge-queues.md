---
title: Merge queues
minutes: 7
---

On a busy repo, this happens all the time: PR A passes CI. PR B passes CI. Both merge. `main` is **broken**, because A and B were never tested **together**.

"Require branches to be up to date" fixes it, but then every merge forces everyone else to update and rerun CI. With 50 PRs a day, people spend the day clicking "Update branch".

## How a merge queue works

```flow
flowchart LR
  A[PR A: approved] --> Q[Merge queue]
  B[PR B: approved] --> Q
  Q --> T1["Test main + A"]
  Q --> T2["Test main + A + B"]
  T1 -->|green| M1[Merge A]
  T2 -->|green| M2[Merge B]
```

1. Approved PRs click **Merge when ready** and join the queue.
2. GitHub makes temporary branches: `main + A`, then `main + A + B`, and runs CI on each **in parallel**.
3. Each PR merges only if the combination it will actually land in is green.
4. If `main + A + B` fails, B is removed from the queue and its author is told. A still merges.

## Turn it on

In a **ruleset** for `main`: **Require merge queue**. Your CI must also run on the queue's event:

```yaml
on:
  pull_request:
  merge_group:        # required, or the queue waits forever
```

```tip
Merge queues matter when a repo has many merges per day and CI that takes minutes. For a team of three, "require up to date" is enough.
```

```quiz
q: Which problem does a merge queue solve?
- Slow code review
- [x] Two PRs that pass alone but break main together
why: The queue tests each PR on top of everything ahead of it.

q: What event must CI listen to for GitHub's merge queue?
- push
- [x] merge_group
why: The queue triggers merge_group runs on its temporary branches.
```

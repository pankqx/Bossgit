---
title: Semantic versioning and release trains
minutes: 7
---

You know SemVer (module 9). At company scale, the question becomes **when** to release, not just what number to use.

## Release trains

A **release train** leaves on a fixed schedule, whatever is on board. Features that are not ready wait for the next train. Nobody delays the train for one feature.

| Product | Train |
|---|---|
| Chrome | a new stable version about every 4 weeks |
| Firefox | about every 4 weeks |
| Node.js | a new major every 6 months; even numbers become LTS |
| Kubernetes | 3 minor releases a year |
| Many mobile apps | weekly or every 2 weeks |

```flow
flowchart LR
  T1["Train 2.8 (Nov 3)"] --> T2["Train 2.9 (Nov 17)"] --> T3["Train 2.10 (Dec 1)"]
  F1[feature A ready] --> T1
  F2[feature B not ready] -.waits.-> T2
```

## How Git supports it

1. `main` always has the next train's code, unfinished work behind **flags**.
2. On the cut date: `git switch -c release/2.9 main`, tag `v2.9.0-rc.1`.
3. Only cherry-picked **fixes** go into `release/2.9` (fix on main first).
4. Ship `v2.9.0`. Patch with `v2.9.1` if needed.

## Channels

Big products ship the same code at different stability levels: **canary** (daily) → **beta** → **stable**. Each channel is a branch or tag stream, and SemVer pre-release labels say which: `3.0.0-beta.2`.

## LTS

**Long-Term Support** versions get security fixes for years (Node.js LTS for about 30 months). Enterprises upgrade only between LTS versions. More LTS lines means more release branches to maintain.

```quiz
q: A feature is not ready on the train's departure date. What happens?
- The train waits
- [x] The feature waits for the next train, hidden behind a flag
why: Fixed schedules are the point of a release train.

q: What does 4.0.0-rc.2 mean?
- The second patch of 4.0.0
- [x] The second release candidate before 4.0.0
why: Pre-release labels come after a dash and sort before the final version.
```

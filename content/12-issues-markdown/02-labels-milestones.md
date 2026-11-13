---
title: Labels, milestones and assignees
minutes: 6
---

A busy repository has hundreds of open issues. Three tools keep them organised.

## Labels: what kind of thing is it?

Colored tags on issues and PRs. Every repo starts with defaults like `bug`, `enhancement`, `documentation`, `good first issue` and `help wanted`. Teams usually add:

| Group | Examples |
|---|---|
| Type | `bug`, `feature`, `chore`, `docs` |
| Priority | `P0-urgent`, `P1-high`, `P2-normal` |
| Area | `area/checkout`, `area/api`, `area/mobile` |
| Status | `needs-triage`, `blocked`, `needs-design` |

```tip
`good first issue` is special: GitHub shows these to newcomers on github.com/contribute. Use it for small, well-described tasks.
```

## Milestones: when should it be done?

A milestone groups issues and PRs for a release or sprint, like `v2.5` or `Sprint 14`, with an optional due date. GitHub shows a progress bar: "18 of 24 closed".

## Assignees: who is doing it?

Assign yourself before you start, so two people do not fix the same bug. Up to 10 people can be assigned.

## Triage

**Triage** means going through new issues: label them, close duplicates, ask for missing details, set a priority. Many teams rotate a "triage person" each week. On GitHub, the **Triage** role lets someone do this without being able to push code.

```bash
gh issue list --label bug --assignee @me
gh issue create --title "Login fails" --label bug --assignee @me
gh issue edit 42 --add-label P1-high --milestone v2.5
```

```quiz
q: You want to show all issues planned for the next release. What do you use?
- A label called next
- [x] A milestone
why: Milestones group work by release or sprint and show progress.

q: What is the point of assigning yourself to an issue?
- It closes the issue
- [x] Others can see you are working on it, so work is not duplicated
why: Assignees show ownership.
```

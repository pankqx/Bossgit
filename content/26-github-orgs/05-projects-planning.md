---
title: GitHub Projects for planning
minutes: 6
---

At organization level, **GitHub Projects** becomes the team's planning system, across every repo.

## A structure many teams use

- One project per **team** (`Payments roadmap`) or per **product**.
- Fields: **Status**, **Priority**, **Size**, **Iteration** (2-week sprints), **Quarter**, **Team**, **Target date**.
- Views:
  - **Sprint board**: Board grouped by Status, filtered to `iteration:@current`.
  - **Roadmap**: by Quarter, grouped by team.
  - **My work**: Table, `assignee:@me`.
  - **Bugs triage**: Table, `label:bug no:priority`.

## Issue types and sub-issues

Organizations can define **issue types** (Bug, Feature, Task, Epic) and break big issues into **sub-issues**, with a progress bar on the parent. This replaces "epic" tickets in many Jira setups.

## Insights

**Insights** charts show burn-up, open items by status, or work per assignee over time. Use them in sprint reviews, not to judge individuals.

## Automation

- Built-in workflows: item added → Status *Todo*; PR merged → *Done*; auto-add issues from repos matching a filter; auto-archive.
- **GitHub Actions** with `gh project` or the GraphQL API for anything custom ("when label P0 is added, set Priority to Urgent and post in Slack").

```quiz
q: How do you show only the current sprint on a board?
- Make a new project every sprint
- [x] Filter by iteration:@current
why: Iteration fields know which sprint is active.

q: How do you split a large feature into trackable parts on GitHub?
- One huge issue with a long list
- [x] Sub-issues under a parent issue
why: Sub-issues track progress and can be assigned separately.
```

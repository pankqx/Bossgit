---
title: GitHub Projects boards
minutes: 6
---

**GitHub Projects** is a planning tool built into GitHub, like a lighter Jira or Trello. One project can hold issues and PRs from many repositories.

## Views

- **Board:** columns like *Todo → In progress → In review → Done*. Drag cards across.
- **Table:** a spreadsheet of issues with any fields you add.
- **Roadmap:** a timeline with start and end dates.

## Custom fields

Add fields to every item: **Status**, **Priority**, **Size** (S/M/L), **Iteration** (2-week sprints), **Estimate**, **Team**. Then filter and group by them, for example "group by assignee, only Priority = High".

## Automation

Built-in workflows can:

- set Status to *Todo* when an item is added,
- move it to *Done* when the issue closes or the PR merges,
- add every new issue with a label automatically,
- archive items that have been done for 2 weeks.

```bash
gh project list --owner my-org
gh project item-add 3 --owner my-org --url https://github.com/my-org/app/issues/42
```

```tip
For a solo project like BossGit, a simple board (Todo, Doing, Done) with one issue per lesson keeps you moving and gives you a public record of what you shipped.
```

```quiz
q: Can one GitHub Project include issues from several repositories?
- [x] Yes
- No, one project per repo
why: Projects live at the user or organization level and can pull items from many repos.

q: Which view shows work on a timeline?
- Board
- Table
- [x] Roadmap
why: Roadmap lays items out by date.
```

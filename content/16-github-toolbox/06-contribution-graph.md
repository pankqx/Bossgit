---
title: How the contribution graph counts
minutes: 6
---

The green squares on your profile count **contributions**. Knowing the rules saves you from "why didn't today count?"

## What counts

- **Commits**, if all of these are true:
  - the commit email is linked to your account,
  - it is on the repository's **default branch** (usually `main`) or the `gh-pages` branch,
  - it is in a repo you own, or you are a collaborator, or you forked it and starred it... the simple rule is: in a standalone repo, not just a fork.
- **Opening** issues and pull requests.
- **Reviewing** pull requests.
- **Creating** a repository, and opening discussions and answering them.

## What does not count

- Commits that only live on a feature branch (they count once the PR is **merged** into main).
- Commits in a **fork** (unless they are merged upstream).
- Commits made with an email that is not on your account (the classic `you@example.com` mistake).
- Private repo activity is hidden unless you turn on **Include private contributions** in your profile settings (it then shows as a count, without details).

## A healthy way to think about it

The graph is a side effect of good work, not the goal. Engineers who hire can tell the difference between real steady work and a script that commits a date file every day.

```tip
If old commits used the wrong email, add that email to your account (Settings → Emails). GitHub re-links those commits, and the graph fills in.
```

```fact
Commit dates come from the commit itself, in the author's time zone. That is why a commit at 11:30 p.m. can show up on the next day's square.
```

```quiz
q: You committed on a feature branch all week but nothing shows on the graph. Why?
- GitHub is slow
- [x] Only the default branch counts; it will appear once the PR is merged
why: Feature branch commits count when they reach main.

q: Your commits use you@example.com. What fixes the graph?
- Nothing
- [x] Add that email to your account, and fix git config user.email
why: GitHub matches commits to accounts by email.
```

---
title: "Reviewing: comments, suggestions, approvals"
minutes: 9
---

Reviewing code is half of the job of a senior engineer. It is how bugs are caught, how knowledge spreads, and how juniors grow.

## The review tools on GitHub

Open a PR and go to **Files changed**.

- Click the **+** next to a line to comment on it. Drag to select several lines.
- Click the **±** icon in a comment to write a **suggestion**: real code the author can apply with one click.
- Tick **Viewed** on each file as you go.
- Click **Review changes** and choose one:

| Choice | Means |
|---|---|
| **Comment** | Feedback, no decision yet |
| **Approve** | Good to merge |
| **Request changes** | Must be fixed before merge |

A suggestion looks like this in the comment box:

````markdown
```suggestion
const total = items.reduce((sum, i) => sum + i.price, 0)
```
````

## What to look for, in order

1. **Does it do what the PR says?** Pull it and run it if needed: `gh pr checkout 42`.
2. **Correctness:** edge cases, empty lists, nulls, errors, time zones, money rounding.
3. **Security:** user input, secrets, permissions, SQL injection.
4. **Design:** is this the right place for the code? Will it be easy to change?
5. **Tests:** is the new behaviour tested?
6. **Readability:** names, comments, dead code.
7. Style last, and only if no linter does it already.

## How to word comments

Use labels so the author knows what matters:

```
nit: could be `const`             (tiny, optional)
question: what happens if items is empty?
suggestion: extract this into formatPrice()?
blocking: this sends the password in the URL
praise: lovely test names!
```

```tip
Comment on the **code**, not the person. "This function is hard to follow" is fine. "You wrote this badly" is not. Ask questions instead of giving orders.
```

```quiz
q: A small style preference that should not block the merge. How do you mark it?
- blocking:
- [x] nit:
why: nit means minor and optional.

q: What should a reviewer check first?
- Spaces vs tabs
- [x] That the change does what it claims, correctly
why: Correctness and security matter far more than style, which tools can check.
```

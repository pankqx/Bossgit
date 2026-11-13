---
title: Writing a good issue
minutes: 7
---

An **issue** is a page on GitHub for one bug, idea or task. Issues are where work starts. A clear issue gets fixed. A vague one sits for a year.

## A bug report that gets fixed

```markdown
### What happened
Clicking "Pay" on /checkout shows a blank page.

### What I expected
The payment confirmation page.

### Steps to reproduce
1. Add any product to the cart
2. Go to /checkout and choose UPI
3. Click "Pay"

### Environment
Chrome 131 on Android 14, app version 2.4.1

### Logs / screenshots
`TypeError: cannot read properties of undefined (reading 'amount')` at checkout.js:88
```

The magic part is **steps to reproduce**. If a developer can make the bug happen in 30 seconds, it is half fixed.

## A feature request that gets built

- **The problem**, not just the solution: "Users lose their cart when they log out" beats "Add a save button".
- Who it is for, and how often it happens.
- What "done" looks like (acceptance criteria).

## Good habits

- **Search first.** Someone may have reported it already. Add a 👍 reaction instead of "+1" comments.
- **One issue, one problem.** Five bugs in one issue never get closed.
- **Title = summary.** "Checkout blank after UPI payment on Android" beats "Bug!!".
- Never paste passwords, tokens or customer data.

```tip
Mention people with `@name`, link other issues with `#123`, and link commits by pasting their id. GitHub turns all three into links and notifies people.
```

```quiz
q: Which part of a bug report helps the developer most?
- How angry you are
- [x] Exact steps to reproduce it
why: If they can make it happen, they can find the cause.

q: Someone already reported your bug. What should you do?
- Open a new issue anyway
- [x] Add a reaction, and comment only if you have new information
why: Duplicates split the discussion. Reactions show how many people are affected.
```

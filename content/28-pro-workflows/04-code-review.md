---
title: "Code review: giving and receiving feedback"
minutes: 8
---

Code review is where engineers earn trust. Here is how seniors do it, both ways.

## As a reviewer

- **Respond fast.** Within a working day. A PR waiting 3 days costs more than any bug it might have.
- **Understand first.** Read the description and the linked issue. Run it if it is not obvious.
- **Order your attention:** correctness → security → design → tests → readability → style.
- **Be specific.** "This might be slow" is useless. "This runs a query per item; for 500 items that is 500 queries. Could we use `findMany` with `in`?" is useful.
- **Label the weight:** `blocking:`, `suggestion:`, `nit:`, `question:`.
- **Approve with comments** when only nits are left. Trust people to fix them.
- **Praise** good work. It teaches as much as criticism.

## As an author

- Small PR, clear description, self-reviewed diff, green CI **before** asking.
- Point reviewers to the risky part: "Please look closely at the migration."
- Answer every comment: fix, or explain why not.
- Never take it personally. The review is about code, and the goal is shared.

## Team norms that work

| Norm | Why |
|---|---|
| Max ~400 changed lines per PR | review quality drops sharply above that |
| One approval for most code, two for risky areas | speed with safety |
| Automate style (formatters, linters) | humans review logic, not commas |
| "Approve or comment within 1 working day" | flow |

```fact
Studies of code review (for example at Microsoft and Google) found its biggest benefits are **knowledge sharing** and **better design**, more than catching bugs. Review is how a team learns its own codebase.
```

```quiz
q: Which review comment is most useful?
- "This is wrong."
- [x] "This calls the API once per item; batching would avoid 500 requests. Could we use the bulk endpoint?"
why: It says what, why it matters, and a way forward.

q: Only small nits remain. What should a reviewer usually do?
- Request changes
- [x] Approve and leave the nits as optional comments
why: Blocking on nits slows the team for little value.
```

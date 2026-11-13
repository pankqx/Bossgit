---
title: Reading CONTRIBUTING.md
minutes: 6
---

Before you touch any code in a project, read three files. They save you and the maintainers hours.

| File | Tells you |
|---|---|
| `README.md` | What the project is and how to run it |
| `CONTRIBUTING.md` | How they want contributions: setup, tests, style, commit messages, PR process |
| `CODE_OF_CONDUCT.md` | How people must treat each other |

## What to look for in CONTRIBUTING.md

- **Local setup:** exact install and test commands.
- **Branch and commit rules:** Conventional Commits? Sign-off?
- **Tests:** "every PR must include tests", how to run a single test.
- **Formatting:** `npm run lint`, `prettier`, `black`.
- **The process:** "open an issue before big changes", "one approval needed", "we squash merge".
- **CLA or DCO:** some projects need you to sign a **Contributor License Agreement**, or add a `Signed-off-by:` line with `git commit -s` (the **Developer Certificate of Origin**, used by the Linux kernel).

```bash
git commit -s -m "fix: handle empty input"
# adds: Signed-off-by: Your Name <you@example.com>
```

```tip
When you start your own project, write a short CONTRIBUTING.md on day one, even five lines. GitHub links it on the "New issue" and "New pull request" pages.
```

```quiz
q: A project's CONTRIBUTING.md asks for DCO. What do you add to commits?
- A GPG signature
- [x] A Signed-off-by line, with git commit -s
why: DCO is a sign-off line that says you have the right to submit the code.

q: When should you read CONTRIBUTING.md?
- After your PR is rejected
- [x] Before you start writing code
why: It tells you how to set up, test and format, so your first PR is accepted.
```

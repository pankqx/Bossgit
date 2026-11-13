---
title: What CI is
minutes: 7
---

**Continuous Integration (CI)** means: every time someone pushes or opens a pull request, a computer automatically builds the code and runs the tests. If anything breaks, the team knows within minutes, not after the release.

**Continuous Delivery / Deployment (CD)** goes one step further: once the checks pass on `main`, the code is shipped automatically (or with one click).

```flow
flowchart LR
  P[Push or PR] --> B[Install + build] --> T[Lint + tests] --> S{All green?}
  S -->|yes| D[Merge / deploy]
  S -->|no| F[Red check on the PR: fix it]
```

## Why every serious team has it

- Nobody has to remember to run the tests.
- "Works on my machine" stops being an excuse. CI is a clean machine every time.
- Reviewers only spend time on PRs that already pass.
- Branch protection can **require** the checks before merging.

## GitHub Actions

GitHub's built-in CI/CD is **GitHub Actions**. You describe the steps in a YAML file in `.github/workflows/`, and GitHub runs them on its machines (**runners**) with Linux, Windows or macOS. Public repositories get it free; private ones get free minutes every month.

| Word | Meaning |
|---|---|
| **Workflow** | One YAML file: an automated process |
| **Event / trigger** | What starts it: push, pull_request, a schedule, a button |
| **Job** | A group of steps that runs on one runner |
| **Step** | One command (`run:`) or one reusable action (`uses:`) |
| **Action** | A reusable step from the Marketplace, like `actions/checkout` |
| **Runner** | The machine that runs a job |

```fact
BossGit itself uses two workflows: one checks every lesson and builds the site on each pull request, and one deploys to GitHub Pages when main changes.
```

```quiz
q: What does CI do on a pull request?
- Merges it
- [x] Builds the code and runs the checks automatically
why: CI verifies every change on a clean machine.

q: In GitHub Actions, what is a runner?
- A YAML file
- [x] The machine that runs a job
why: GitHub provides hosted runners, or you can host your own.
```

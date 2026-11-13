---
title: Run tests on every pull request
minutes: 8
---

A workflow that runs is only half the job. To **protect** `main`, the check must be **required**.

## 1. A workflow that runs on PRs

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]
concurrency:                       # cancel older runs of the same PR
  group: ci-${{ github.ref }}
  cancel-in-progress: true
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm test -- --reporter=junit --outputFile=report.xml
```

## 2. Make it required

**Settings → Rules → Rulesets** (or Branch protection) → **Require status checks to pass** → search for the job name (`test`) → add it. Now the merge button stays grey until it is green.

## 3. Read a failure

On the PR, click **Details** next to the red ✗. Each step is folded. The failing one is open, with the log. Read from the **first** error, not the last line.

```bash
gh pr checks                 # status of the checks on this branch's PR
gh run list                  # recent runs
gh run view --log-failed     # print only the logs of failed steps
gh run rerun --failed        # rerun only failed jobs (for flaky tests)
```

## Pull requests from forks

For security, workflows triggered by `pull_request` from a **fork** run **without** your secrets and with a read-only token. Never "fix" that by switching to `pull_request_target` and checking out the fork's code: that hands your secrets to strangers.

```tip
Keep CI under 10 minutes. Cache dependencies, run lint and unit tests first, split slow tests into parallel jobs. Slow CI makes people skip it.
```

```quiz
q: Your workflow runs on PRs, but people can still merge red PRs. What is missing?
- A second workflow
- [x] Marking the check as required in branch protection or a ruleset
why: Running and requiring are separate settings.

q: Why do fork PRs not get your repository secrets?
- It is a bug
- [x] Anyone can open a fork PR, so secrets would leak to strangers
why: GitHub protects secrets from untrusted code by default.
```

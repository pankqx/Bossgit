---
title: "Workflow files: triggers, jobs and steps"
minutes: 11
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start"
---

Here is a complete, real workflow. Read it line by line.

```yaml
# .github/workflows/ci.yml
name: CI                         # shown in the Actions tab

on:                              # TRIGGERS: when to run
  push:
    branches: [main]
  pull_request:                  # every PR, any branch
  workflow_dispatch:             # adds a "Run workflow" button

permissions:
  contents: read                 # least privilege for the GITHUB_TOKEN

jobs:
  test:                          # job id
    runs-on: ubuntu-latest       # the runner
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4          # get the code
      - uses: actions/setup-node@v4        # install Node
        with:
          node-version: 22
          cache: npm
      - run: npm ci                        # install exact versions from package-lock.json
      - run: npm run lint
      - run: npm test
```

## The pieces

- **`on:`** lists events. Common ones: `push`, `pull_request`, `schedule` (cron), `workflow_dispatch` (manual), `release`, `issues`. Filter with `branches:`, `paths:` and `tags:`.
- **`jobs:`** run **in parallel** by default. Add `needs: test` to make a job wait for another.
- **`steps:`** run **in order** on the same runner. If one fails, the job stops.
- **`uses: owner/repo@version`** runs an action. **`run:`** runs a shell command.
- **`with:`** gives inputs to an action. **`env:`** sets environment variables.
- **`if:`** runs a step or job only when a condition is true: `if: github.ref == 'refs/heads/main'`.

```yaml
  deploy:
    needs: test
    if: github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying ${{ github.sha }}"
```

`${{ ... }}` is an **expression**. It can read contexts like `github`, `env`, `secrets`, `matrix` and `steps`.

```warn
YAML is strict about **spaces**. Use 2 spaces per level, never tabs. One wrong indent and the workflow will not even start. The Actions tab shows the line of the error.
```

```tip
Pin third-party actions to a full commit SHA (`uses: some/action@8f4b7f8...`) instead of a tag. Tags can be moved by an attacker. GitHub's own `actions/*` are usually pinned to a major version like `@v4`.
```

```quiz
q: Two jobs in a workflow have no needs: lines. How do they run?
- One after the other
- [x] At the same time, in parallel
why: Jobs are parallel unless needs: sets an order.

q: Which trigger adds a manual "Run workflow" button?
- schedule
- [x] workflow_dispatch
why: workflow_dispatch lets you start the workflow by hand from the Actions tab or gh.
```

```mission
title: Your first workflow
goal: Create `.github/workflows/ci.yml` that is named `CI`, runs `on: pull_request`, and has a job running `npm test`. Commit it.
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start"
check: tracked .github/workflows/ci.yml
check: contains .github/workflows/ci.yml name: CI
check: contains .github/workflows/ci.yml pull_request
check: contains .github/workflows/ci.yml runs-on:
check: contains .github/workflows/ci.yml npm test
check: clean
hint: mkdir .github, then mkdir .github/workflows
hint: Write it line by line: echo "name: CI" > .github/workflows/ci.yml, then >> for "on: pull_request", "jobs:", "  test:", "    runs-on: ubuntu-latest", "    steps:", "      - run: npm test"
solve: mkdir .github
solve: mkdir .github/workflows
solve: echo "name: CI" > .github/workflows/ci.yml
solve: echo "on: pull_request" >> .github/workflows/ci.yml
solve: echo "jobs:" >> .github/workflows/ci.yml
solve: echo "  test:" >> .github/workflows/ci.yml
solve: echo "    runs-on: ubuntu-latest" >> .github/workflows/ci.yml
solve: echo "    steps:" >> .github/workflows/ci.yml
solve: echo "      - run: npm test" >> .github/workflows/ci.yml
solve: git add .
solve: git commit -m "ci: run tests on pull requests"
```

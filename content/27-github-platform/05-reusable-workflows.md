---
title: Reusable workflows and composite actions
minutes: 8
---

Twenty repos with the same 80-line CI file means twenty places to fix every bug. Share it instead.

## Reusable workflow: share whole jobs

```yaml
# acme/workflows/.github/workflows/node-ci.yml
on:
  workflow_call:
    inputs:
      node-version: { type: string, default: '22' }
    secrets:
      NPM_TOKEN: { required: false }
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '${{ inputs.node-version }}', cache: npm }
      - run: npm ci && npm test
```

```yaml
# any repo: .github/workflows/ci.yml
on: [pull_request]
jobs:
  ci:
    uses: acme/workflows/.github/workflows/node-ci.yml@v1
    with: { node-version: '20' }
    secrets: inherit
```

## Composite action: share a group of steps

```yaml
# acme/setup-app/action.yml
name: Setup app
description: Install Node, restore cache, install deps
inputs:
  node-version: { default: '22' }
runs:
  using: composite
  steps:
    - uses: actions/setup-node@v4
      with: { node-version: '${{ inputs.node-version }}', cache: npm }
    - run: npm ci
      shell: bash
```

Used as one step: `- uses: acme/setup-app@v1`.

| | Reusable workflow | Composite action |
|---|---|---|
| Shares | whole jobs (with their own runners) | steps inside your job |
| Called with | `jobs.<id>.uses:` | `steps[*].uses:` |
| Can use secrets | yes (passed or inherited) | through inputs only |
| Good for | "the company's standard CI" | "set up our toolchain" |

```tip
Version shared workflows with tags (`@v1`) and keep a changelog. A breaking change in a shared workflow breaks every repo at once.
```

```quiz
q: Which trigger makes a workflow reusable?
- workflow_dispatch
- [x] workflow_call
why: workflow_call lets other workflows call it like a function.

q: You want to share three setup steps used inside many jobs. Which do you write?
- A reusable workflow
- [x] A composite action
why: Composite actions bundle steps that run inside the caller's job.
```

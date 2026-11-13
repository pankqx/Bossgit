---
title: Write your own JavaScript action
minutes: 9
setup: mkdir greet-action && cd greet-action && git init -q
---

When no Marketplace action does what you need, write one. JavaScript actions start fast and run on every runner OS.

## The files

```yaml
# action.yml
name: Greet contributor
description: Comments a welcome message on a first-time contributor's PR
inputs:
  token: { description: GitHub token, required: true }
  message: { description: Text to post, default: 'Thanks for your first PR! 🎉' }
outputs:
  comment-url: { description: URL of the comment }
runs:
  using: node20
  main: dist/index.js
```

```js
// src/index.js
import * as core from '@actions/core'
import * as github from '@actions/github'

try {
  const { context } = github
  const pr = context.payload.pull_request
  if (pr?.author_association === 'FIRST_TIME_CONTRIBUTOR') {
    const octokit = github.getOctokit(core.getInput('token'))
    const { data } = await octokit.rest.issues.createComment({
      ...context.repo, issue_number: pr.number, body: core.getInput('message'),
    })
    core.setOutput('comment-url', data.html_url)
  }
} catch (err) {
  core.setFailed(err.message)
}
```

Bundle `src` and its dependencies into one file with **@vercel/ncc** or **esbuild**, and commit `dist/` (the runner does not run `npm install` for you).

## Use and release it

```yaml
- uses: acme/greet-action@v1
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
```

Tag releases `v1.0.0` and move a major tag `v1` to the newest 1.x, so users get fixes automatically. Publish to the **Marketplace** from the release page.

```tip
There are three kinds of action: **JavaScript** (fast, cross-platform), **Docker** (any language, Linux runners only, slower to start) and **composite** (shell steps). Start with composite; move to JavaScript when you need logic or API calls.
```

```quiz
q: Why commit dist/index.js for a JavaScript action?
- For decoration
- [x] The runner executes it directly and does not install your dependencies
why: The bundled file must contain everything the action needs.

q: Which function marks the action step as failed?
- core.error
- [x] core.setFailed
why: setFailed logs the error and sets a failing exit code.
```

```mission
title: Ship an action
goal: Create the metadata file `action.yml` for an action named `Greet contributor` that runs on `node20` with `main: dist/index.js`, and commit it.
setup: mkdir greet-action && cd greet-action && git init -q
check: tracked action.yml
check: contains action.yml name: Greet contributor
check: contains action.yml using: node20
check: contains action.yml main: dist/index.js
check: clean
solve: echo "name: Greet contributor" > action.yml
solve: echo "description: Welcome first-time contributors" >> action.yml
solve: echo "runs:" >> action.yml
solve: echo "  using: node20" >> action.yml
solve: echo "  main: dist/index.js" >> action.yml
solve: git add .
solve: git commit -m "feat: action metadata"
```

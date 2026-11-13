---
title: The gh command line tool
minutes: 8
---

`gh` is GitHub's official command line tool (cli.github.com). It brings pull requests, issues, Actions and more to your terminal. Seniors use it constantly because it keeps them in flow.

```bash
gh auth login                      # log in once (browser)
gh repo create shop --public --source=. --push   # make a GitHub repo from this folder and push
gh repo clone owner/repo
gh repo view --web                 # open the repo in the browser
```

## Pull requests

```bash
gh pr create --fill --draft
gh pr list --author @me
gh pr checkout 128                 # test a teammate's PR locally
gh pr diff 128
gh pr review 128 --approve -b "Looks great"
gh pr merge 128 --squash --delete-branch
gh pr merge --auto --squash        # merge when checks pass
```

## Issues

```bash
gh issue create -t "Crash on login" -l bug
gh issue list -l "good first issue"
gh issue develop 42 --checkout     # make a branch linked to issue 42
```

## Actions

```bash
gh run list
gh run watch                       # live view of the current run
gh run view --log-failed
gh workflow run deploy.yml
gh secret set API_KEY              # paste the value; it is never shown again
```

## The API, directly

```bash
gh api repos/{owner}/{repo}/pulls --jq '.[].title'
gh api graphql -f query='{ viewer { login } }'
```

```tip
`gh alias set co 'pr checkout'` makes `gh co 128` work. And `gh extension install` adds community commands, like `gh dash` for a dashboard of your PRs.
```

```quiz
q: How do you get a teammate's PR number 77 onto your laptop to test it?
- git clone 77
- [x] gh pr checkout 77
why: gh fetches the PR's branch and switches to it, even from forks.

q: Which command merges a PR automatically once its checks pass?
- gh pr merge --now
- [x] gh pr merge --auto --squash
why: --auto enables auto-merge, which waits for required checks and reviews.
```

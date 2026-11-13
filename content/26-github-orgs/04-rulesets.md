---
title: Rulesets and branch protection in depth
minutes: 8
---

**Rulesets** are the modern replacement for branch protection rules. They are more powerful in four ways:

1. **Many targets:** one ruleset can cover `main`, `release/*` and every `v*` tag.
2. **Layers:** several rulesets can apply at once; the strictest rule wins. Organizations can apply rulesets to **all repos** (or all matching a name or a property).
3. **Evaluate mode:** try a rule and see in **Rule insights** what *would* have been blocked, without blocking anyone.
4. **Bypass list:** specific teams, roles or GitHub Apps can bypass, always or only through a PR.

## Rules available

| Area | Rules |
|---|---|
| Updates | restrict creations, updates, deletions; block force pushes |
| History | require linear history, require signed commits |
| Reviews | required approvals, code owners, dismiss stale, last-push approval, conversation resolution |
| Checks | required status checks (pin to a specific GitHub App), require deployments to succeed |
| Queue | require merge queue |
| Push rules (private/internal repos) | restrict file paths, file size, file extensions |
| Metadata (Enterprise) | commit message, author email, branch name patterns |
| Code scanning | require CodeQL results with no high alerts |

## A sensible org-wide baseline

```
Target: default branch of all repositories
- Restrict deletions
- Block force pushes
- Require a pull request: 1 approval, dismiss stale approvals, require conversation resolution
- Require status checks: "ci" from GitHub Actions
Bypass: none (release bot via pull request only)
```

```bash
gh api repos/{owner}/{repo}/rulesets --jq '.[].name'
gh api repos/{owner}/{repo}/rules/branches/main     # what applies to main right now
```

```quiz
q: What does a ruleset's Evaluate mode do?
- Blocks everything
- [x] Records what would be blocked, without enforcing
why: You can test new rules safely before turning them on.

q: Two rulesets apply to main. One needs 1 approval, the other 2. How many are needed?
- 1
- [x] 2
why: Rulesets layer, and the most restrictive rule applies.
```

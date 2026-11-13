---
title: Dependabot
minutes: 7
---

Your app has 900 dependencies. Every week, some of them get security fixes. You cannot watch them all by hand. **Dependabot** does it for you.

## Three features

| Feature | What it does |
|---|---|
| **Dependabot alerts** | Warns you when a dependency you use has a known vulnerability (from the GitHub Advisory Database) |
| **Security updates** | Opens a PR that upgrades the vulnerable package to a fixed version |
| **Version updates** | Opens PRs to keep dependencies up to date on a schedule |

Turn the first two on in **Settings → Code security**. Version updates need a config file:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
    groups:
      dev-dependencies:
        dependency-type: development     # one PR for all dev deps, not 30
    open-pull-requests-limit: 5
  - package-ecosystem: github-actions    # keep your workflow actions updated too
    directory: /
    schedule:
      interval: weekly
```

## How to handle Dependabot PRs

- **Patch and minor** updates with green CI: review the changelog quickly, merge. Many teams auto-merge them.
- **Major** updates: read the release notes for breaking changes, test properly.
- Do not let them pile up. 40 open Dependabot PRs is a sign the team ignores security.

```bash
npm audit                 # local check for npm
gh api /repos/{owner}/{repo}/dependabot/alerts --jq '.[].security_advisory.summary'
```

```tip
**Dependency review** (a GitHub Action, `actions/dependency-review-action`) can block a PR that **adds** a vulnerable or badly licensed package, before it lands.
```

```quiz
q: Which file configures Dependabot version updates?
- package.json
- [x] .github/dependabot.yml
why: Dependabot reads its schedule and ecosystems from that file.

q: A Dependabot PR bumps a library from 4.x to 5.0.0. What should you do?
- Merge immediately without looking
- [x] Read the release notes for breaking changes and test before merging
why: A major version may change behaviour your code depends on.
```

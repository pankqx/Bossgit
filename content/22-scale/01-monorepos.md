---
title: Monorepos vs many repositories
minutes: 8
---

When a company has 50 services and 10 apps, where does the code live?

| | **Monorepo**: one repo for everything | **Polyrepo**: one repo per project |
|---|---|---|
| Who | Google, Meta, Microsoft (Windows), Uber, many startups | Amazon (mostly), Netflix, most open source |
| Shared code | Import it directly, always the latest | Publish packages, manage versions |
| Big change across many projects | **One PR**, one review, atomic | Many PRs, in the right order |
| Ownership | CODEOWNERS per folder | Repo permissions |
| CI | Must only build what changed (needs smart tools) | Simple per repo |
| Git performance | Needs care at huge sizes | Each repo is small |
| Dependency versions | One version of each library for everyone | Each project can drift |

## Tools that make monorepos work

- **JavaScript/TypeScript:** pnpm/npm/yarn **workspaces**, **Turborepo**, **Nx** (they cache builds and only run tasks for what changed).
- **Many languages, very large:** **Bazel** (from Google), **Buck2** (Meta), **Pants**.
- **Git:** sparse checkout, partial clone, `scalar` and `git maintenance` (lesson 5), CODEOWNERS, path filters in CI:

```yaml
on:
  pull_request:
    paths: ['apps/web/**', 'packages/ui/**']
```

## How to choose

- Small team, several apps that share code: a **monorepo** with workspaces is usually simpler.
- Independent teams, different languages, separate release cycles, or open-source parts: **polyrepo**.
- Whatever you pick, the real costs are tooling and discipline, not Git itself.

```fact
Google's main repository holds billions of lines of code and is used by tens of thousands of engineers every day. It runs on a custom system called Piper, not Git, but the ideas (one trunk, code owners, presubmit checks) are the same ones you are learning.
```

```quiz
q: What is the biggest advantage of a monorepo?
- Smaller clones
- [x] Changing many projects in one atomic pull request
why: Cross-project changes, like renaming a shared API, land together.

q: What do Turborepo and Nx mainly add to a monorepo?
- Git hosting
- [x] Running and caching only the tasks affected by a change
why: Without it, every PR would rebuild and test everything.
```

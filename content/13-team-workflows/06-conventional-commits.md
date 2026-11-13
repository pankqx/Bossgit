---
title: Conventional Commits
minutes: 8
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "chore: start"
---

**Conventional Commits** (conventionalcommits.org) is a simple rule for commit messages that both humans and tools can read:

```
<type>(<optional scope>): <short summary>

<optional body: what and why>

<optional footer: BREAKING CHANGE: ..., Fixes #12>
```

## The types

| Type | For | Version bump |
|---|---|---|
| `feat` | A new feature | MINOR |
| `fix` | A bug fix | PATCH |
| `docs` | Documentation only | none |
| `style` | Formatting, no code change | none |
| `refactor` | Code change that is not a fix or feature | none |
| `perf` | Faster code | PATCH |
| `test` | Adding or fixing tests | none |
| `build` / `ci` | Build system, pipelines | none |
| `chore` | Everything else (deps, tooling) | none |

A `!` after the type, or a `BREAKING CHANGE:` footer, means **MAJOR**.

```try
echo "login" > login.js
git add . && git commit -m "feat(auth): add email login"
echo "fixed" >> login.js
git commit -am "fix(auth): trim spaces in the email"
git log --oneline
```

## Why companies use it

- `git log --oneline` reads like a changelog.
- Tools like **release-please** and **semantic-release** read the messages and decide the next version and write `CHANGELOG.md` (module 22).
- A `commit-msg` hook with **commitlint** can reject bad messages (module 24).

## Good summaries

- Imperative mood: "add", not "added" or "adds". It finishes the sentence "If applied, this commit will…".
- Under ~72 characters, no period at the end.
- Say **what changed for the user**, not which file you edited.

```quiz
q: You fixed a bug in the payments module. Which message fits?
- Fixed stuff
- [x] fix(payments): round totals to two decimals
- feat: payments
why: Type fix, scope payments, and an imperative summary.

q: Which message signals a breaking change?
- fix: remove old API
- [x] feat!: remove the v1 API
why: The ! marks a breaking change, which means a MAJOR version bump.
```

```mission
title: Speak the language
goal: Commit a new file `search.js` with a Conventional Commit message of type `feat` and scope `search`, for example `feat(search): add product search`.
setup: mkdir shop && cd shop && git init -q && echo "shop" > README.md && git add . && git commit -q -m "chore: start"
check: tracked search.js
check: message feat(search):
check: clean
hint: git commit -m "feat(search): add product search"
solve: echo "search" > search.js
solve: git add .
solve: git commit -m "feat(search): add product search"
```

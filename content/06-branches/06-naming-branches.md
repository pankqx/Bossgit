---
title: Naming branches well
minutes: 5
---

A branch name is the first thing your team reads. A good one tells them **what kind of work** it is and **what it is about**, before they open a single file.

## The pattern most teams use

```
type/short-description
type/TICKET-123-short-description
```

| Prefix | For | Example |
|---|---|---|
| `feat/` or `feature/` | New features | `feat/dark-mode` |
| `fix/` | Bug fixes | `fix/login-crash` |
| `hotfix/` | Urgent fixes for production | `hotfix/payment-timeout` |
| `docs/` | Documentation only | `docs/api-examples` |
| `refactor/` | Code changes with no new behaviour | `refactor/split-user-service` |
| `chore/` | Tooling, dependencies, config | `chore/upgrade-react-19` |
| `release/` | Preparing a version | `release/2.4.0` |

## Rules that save pain

- Use **lowercase** and **dashes**. `Fix_Login` and `fix-login` are different branches, and on macOS and Windows that difference causes real bugs.
- **No spaces**, and avoid `~ ^ : ? * [ \`. Git forbids them.
- Keep it short. `fix/login-crash` beats `fix/the-login-page-crashes-when-the-password-is-empty`.
- Put the **ticket number** in if your team uses Jira or GitHub issues: `fix/482-login-crash`. Many tools link it automatically.
- Do not use your own name as the whole branch (`pankaj`). Branches describe work, not people.

```tip
Some companies add the author: `pankaj/feat/dark-mode`. Then `git branch -r --list "origin/pankaj/*"` shows only your branches.
```

```quiz
q: Which branch name is best?
- Pankaj-Work
- new stuff
- [x] fix/231-cart-total
why: It has a type, a ticket number and a short description, all lowercase with dashes.

q: Why avoid capital letters in branch names?
- Git does not allow them
- [x] Branches that differ only by case clash on macOS and Windows
- GitHub hides them
why: Those file systems treat Fix and fix as the same, but Git does not.
```

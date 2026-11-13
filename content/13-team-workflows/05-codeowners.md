---
title: CODEOWNERS
minutes: 7
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start"
---

A **CODEOWNERS** file says who owns which parts of the code. When a PR touches those files, GitHub **automatically requests a review** from the owners. With branch protection's "Require review from Code Owners", the PR cannot merge until an owner approves.

## Where it lives

`.github/CODEOWNERS` (or `CODEOWNERS` at the root, or `docs/CODEOWNERS`).

```
# Everything, unless a later rule matches
*                   @acme/core-team

# Frontend
/web/               @acme/frontend
*.css               @riya

# Payments are sensitive: two teams
/services/payments/ @acme/payments @acme/security

# CI config
/.github/workflows/ @acme/devops
```

## How matching works

- Patterns work like `.gitignore`.
- **The last matching line wins.** Put the general rules at the top and the specific ones at the bottom.
- Owners are `@user`, `@org/team` or an email. Teams must have **write** access to the repo.

```try
mkdir .github
echo "* @acme/core" > .github/CODEOWNERS
echo "/api/ @acme/backend" >> .github/CODEOWNERS
cat .github/CODEOWNERS
```

```warn
If the CODEOWNERS file has errors (an unknown user, a team without access), GitHub shows a warning on the file page. Owners that do not exist simply get no review request, and nobody notices for months.
```

```quiz
q: Two lines match a file. Which owner is used?
- The first line
- [x] The last matching line
- Both, always
why: Like .gitignore, later rules override earlier ones.

q: What does CODEOWNERS do on its own, without branch protection?
- Blocks merges
- [x] Requests reviews from the owners automatically
why: It needs the "Require review from Code Owners" rule to actually block merging.
```

```mission
title: Who owns what
goal: Create `.github/CODEOWNERS` so `@acme/core` owns everything and `@acme/mobile` owns `/app/`. Put the general rule **first**. Commit it.
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start"
check: tracked .github/CODEOWNERS
check: contains .github/CODEOWNERS * @acme/core
check: contains .github/CODEOWNERS /app/ @acme/mobile
check: clean
hint: mkdir .github
hint: echo "* @acme/core" > .github/CODEOWNERS, then >> the /app/ line
solve: mkdir .github
solve: echo "* @acme/core" > .github/CODEOWNERS
solve: echo "/app/ @acme/mobile" >> .github/CODEOWNERS
solve: git add .
solve: git commit -m "chore: add code owners"
```

---
title: GitHub Flow
minutes: 7
setup: bossgit github https://github.com/team/app && mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start" && git remote add origin https://github.com/team/app && git push -q -u origin main
---

A **workflow** is the team's agreement on how branches, reviews and releases work. The simplest one, and the most common in startups and product teams, is **GitHub Flow**.

```flow
flowchart LR
  M[main is always deployable] --> B[Create a branch]
  B --> C[Commit] --> P[Open a pull request]
  P --> R[Review + CI] --> MG[Merge to main] --> D[Deploy]
  D --> M
```

## The six rules

1. Anything on `main` can be deployed **at any moment**.
2. To work on anything, create a **descriptively named branch** from `main`.
3. Commit to that branch and push it often.
4. Open a **pull request** when you want feedback or are ready to merge.
5. Merge only after **review and green CI**.
6. **Deploy right after merging** (often automatically).

```try
git switch -c fix/typo-on-home
echo "Welcome" > home.html
git add . && git commit -m "fix: typo on home page"
git push -u origin fix/typo-on-home
```

## Strengths and limits

| Good at | Harder with |
|---|---|
| Web apps and services that deploy many times a day | Software that ships fixed versions (mobile apps, desktop, libraries supporting old versions) |
| Small teams that want little process | Very large teams merging hundreds of PRs a day (add a merge queue) |

```tip
GitHub Flow needs good **CI** and **feature flags** (module 28) so half-built features can be merged safely while hidden from users.
```

```quiz
q: In GitHub Flow, what is always true about main?
- It only changes once a week
- [x] It can be deployed at any time
why: That is the core rule. Everything else protects it.

q: Where does new work start in GitHub Flow?
- On main directly
- On a develop branch
- [x] On a new branch from main
why: GitHub Flow has only main plus short-lived branches.
```

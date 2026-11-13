---
title: GitHub Apps vs OAuth Apps vs tokens
minutes: 8
---

A script or a bot needs to act on GitHub. Which identity should it use? This is a real design decision, and a classic senior interview topic.

| | Personal access token (PAT) | OAuth App | **GitHub App** |
|---|---|---|---|
| Acts as | **you** | a user who signed in | **itself** (a bot), or on behalf of a user |
| Permissions | your access (fine-grained PATs can narrow it) | broad scopes like `repo` | **fine-grained**, per permission, per repo |
| Installed on | n/a | n/a | chosen orgs and repos |
| Tokens | long-lived (you set expiry) | long-lived user token | **short-lived** (1 hour), created on demand |
| Rate limits | 5,000/h | 5,000/h per user | scales with repos/users, up to 12,500/h+ |
| Survives you leaving the company | **no** | n/a | **yes** |
| Webhooks built in | no | no | yes |

## How to choose

- **A quick personal script:** fine-grained PAT with expiry and only the repos it needs.
- **"Sign in with GitHub" on your website:** an OAuth App (or a GitHub App with user authorization).
- **A bot, an integration, CI automation for a team:** a **GitHub App**. This is the recommended default.
- **Inside GitHub Actions:** the built-in `GITHUB_TOKEN` first; a GitHub App token (`actions/create-github-app-token`) when you need to reach other repos.

## How a GitHub App authenticates

1. Sign a short **JWT** with the app's private key.
2. Exchange it for an **installation access token** for one installation (expires in 1 hour).
3. Call the API with that token.

```quiz
q: A team bot must comment on PRs in 20 repos and keep working after its creator leaves. Best choice?
- The creator's personal access token
- [x] A GitHub App installed on those repos
why: Apps have their own identity, fine-grained permissions and short-lived tokens.

q: How long does a GitHub App installation token last?
- Forever
- [x] About one hour
why: Short-lived tokens limit the damage if one leaks.
```

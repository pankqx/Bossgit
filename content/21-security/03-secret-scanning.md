---
title: Secret scanning and push protection
minutes: 7
---

Leaked secrets are one of the most common causes of real breaches. A cloud key pushed to a public repo can be found and abused by bots **within minutes**, and the bill can reach thousands of dollars by the next morning.

## What GitHub does for you

- **Secret scanning** checks your repository's history for 200+ known token formats (AWS, Google Cloud, Stripe, Slack, OpenAI, GitHub tokens...). For many providers, GitHub **tells the provider**, who can revoke the key automatically.
- **Push protection** checks your push **before** it is accepted. If it finds a secret, the push is blocked:

```
remote: - GITHUB PUSH PROTECTION
remote:   Push cannot contain secrets
remote:   —— Amazon AWS Access Key ID ——————————
remote:     locations:
remote:       - commit: 8a2e1f0  path: config/.env:2
```

Both are on by default for public repositories and free for them. Private repos need GitHub Secret Protection (part of Advanced Security) in organizations. Personal accounts can turn on push protection for themselves in **Settings → Code security**.

## When push protection blocks you

1. **Do not** click "allow" unless it truly is a fake test value.
2. Remove the secret from the commit **before** pushing. If it is the last commit: edit the file, `git commit --amend`. If older: interactive rebase, or reset and recommit.
3. Move the value to an environment variable, a `.env` file in `.gitignore`, or a secrets manager.
4. If there is any chance it leaked, **rotate** it anyway.

## Catch it even earlier

Run a scanner before every commit, with a pre-commit hook (module 24):

```bash
gitleaks protect --staged          # or: trufflehog, detect-secrets
```

```quiz
q: When does push protection act?
- After the code is merged
- [x] When you push, before GitHub accepts the commits
why: It blocks the push, so the secret never reaches the server.

q: Push protection blocked a real API key. What do you do?
- Click allow and push
- [x] Remove the key from the commits, move it to config outside git, and rotate it if it may have leaked
why: The point is to keep secrets out of history entirely.
```

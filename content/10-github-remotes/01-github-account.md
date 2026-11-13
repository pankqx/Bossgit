---
title: Your GitHub account and profile
minutes: 7
---

Git is the tool. **GitHub** is the place where teams keep the shared copy of a repository, review each other's code, track bugs and run automation. It is also, whether you like it or not, part of your CV. Recruiters and engineers open your profile before they call you.

## Set up an account that looks professional

1. Sign up at **github.com**. Pick a username you would be happy to say in an interview: `kspankaj` beats `xXcoderXx99`.
2. Add a real **name**, a clear **photo**, a one-line **bio** ("Full-stack developer. React, Node, Postgres."), your city and a link to your portfolio or LinkedIn.
3. Go to **Settings → Emails**. Add every email you commit with. Commits only count for you if their email is on your account.
4. Tick **Keep my email addresses private**. GitHub gives you a `12345+name@users.noreply.github.com` address. Use it in `git config --global user.email` so your real email is never public in commit history.
5. Turn on **two-factor authentication** (Settings → Password and authentication). Many organisations require it, and GitHub requires it for everyone who contributes code.

```warn
If `git config user.email` is not one of your account's emails, your commits show a grey avatar and do not count on your contribution graph. Check it in every new repo.
```

## What people look at

| Part | What it tells them |
|---|---|
| Pinned repositories | Your best 6 projects. Pick them carefully. |
| Profile README | Who you are, in your own words (module 16). |
| Contribution graph | How often you ship. Steady beats bursts. |
| Each repo's README | Can you explain what you built and how to run it? |

```tip
Six excellent repositories with clear READMEs, tests and a live demo beat sixty half-finished ones. Archive or make private the experiments you would not show in an interview.
```

```quiz
q: Your commits show a grey avatar on GitHub. What is the most likely cause?
- GitHub is down
- [x] The commit email is not on your GitHub account
- You did not push tags
why: GitHub links commits to accounts by email.

q: Why use the noreply email in git config?
- It makes pushes faster
- [x] Your real email stays private, but commits still count for you
why: The noreply address is linked to your account and hides your inbox from the world.
```

---
title: SSH keys and HTTPS tokens
minutes: 10
---

GitHub must know it is really you before it accepts a push. Passwords stopped working for Git in 2021. You have two options.

## Option A: HTTPS with a credential helper (easiest)

The URL looks like `https://github.com/you/app.git`. The easiest way to log in is the GitHub CLI:

```bash
gh auth login          # pick GitHub.com, HTTPS, log in with the browser
gh auth setup-git      # tell Git to use gh for passwords
```

Or use **Git Credential Manager**, which comes with Git for Windows and can be installed on macOS and Linux. It opens a browser login once and stores the token safely.

If a tool asks for a password, use a **personal access token** (Settings → Developer settings → Personal access tokens). Prefer **fine-grained tokens**: give them access to only the repos and permissions they need, with an expiry date.

## Option B: SSH keys

The URL looks like `git@github.com:you/app.git`.

```bash
ssh-keygen -t ed25519 -C "you@example.com"     # make a key pair, press Enter for the default path
eval "$(ssh-agent -s)" && ssh-add ~/.ssh/id_ed25519
cat ~/.ssh/id_ed25519.pub                       # copy this PUBLIC key
# GitHub: Settings → SSH and GPG keys → New SSH key → paste
ssh -T git@github.com                           # test: "Hi you! You've successfully authenticated"
```

```flow
flowchart LR
  P["Private key (stays on your laptop)"] -- proves --> G[GitHub]
  U["Public key (pasted on GitHub)"] --- G
```

```warn
**Never** share or commit the private key (`id_ed25519` without `.pub`). Never paste a token into code, a chat or a screenshot. If you leak one, delete it on GitHub at once and make a new one.
```

## Which one?

| | HTTPS + helper | SSH |
|---|---|---|
| Setup | One browser login | Make a key, paste it |
| Works through strict office firewalls | Usually | Sometimes blocked (port 22) |
| Good for | Most people, Windows | Linux and macOS power users, servers |

```tip
Switch an existing repo between them with `git remote set-url origin git@github.com:you/app.git`. The same key can also **sign** your commits (module 21).
```

```quiz
q: Which file do you paste into GitHub?
- ~/.ssh/id_ed25519
- [x] ~/.ssh/id_ed25519.pub
why: .pub is the public key. The other one is private and never leaves your machine.

q: Git asks for a password over HTTPS. What do you type?
- Your GitHub account password
- [x] A personal access token, or better, log in with gh or a credential manager
why: GitHub stopped accepting account passwords for Git operations in 2021.
```

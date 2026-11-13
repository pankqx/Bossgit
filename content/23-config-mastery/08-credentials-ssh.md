---
title: Credential helpers and SSH keys
minutes: 8
---

Typing a token for every push is slow and unsafe. A **credential helper** stores it securely and hands it to Git when needed.

## Credential helpers

| Helper | Where it stores | OS |
|---|---|---|
| **Git Credential Manager** (`manager`) | the OS keychain, with browser sign-in and 2FA | Windows, macOS, Linux |
| `osxkeychain` | macOS Keychain | macOS |
| `libsecret` | GNOME Keyring / KWallet | Linux desktop |
| `cache --timeout=3600` | memory, for one hour | any |
| `store` | a **plain text** file, `~/.git-credentials` | any (avoid) |
| `gh auth git-credential` | managed by the GitHub CLI | any |

```bash
git config --global credential.helper manager     # Git Credential Manager
gh auth setup-git                                 # or let gh do it
git credential-manager github list                # see stored GitHub accounts (GCM)
```

## SSH: several keys, several accounts

`~/.ssh/config` can pick a key per host alias:

```
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519
  IdentitiesOnly yes

Host github-work
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_work
  IdentitiesOnly yes
```

Then clone work repos as `git@github-work:acme/api.git`. Combine this with conditional includes (lesson 2) and you can never push with the wrong identity.

```bash
ssh -T git@github.com          # "Hi pankaj!"
ssh -T git@github-work         # "Hi pankaj-acme!"
ssh-add -l                     # keys loaded in the agent
```

```warn
`credential.helper store` writes your token in plain text in your home folder. Malware and anyone with your laptop can read it. Use the OS keychain.
```

```quiz
q: Which helper stores tokens in plain text?
- manager
- osxkeychain
- [x] store
why: store writes ~/.git-credentials unencrypted.

q: How do you use two different SSH keys for two GitHub accounts?
- You cannot
- [x] Host aliases in ~/.ssh/config, each with its own IdentityFile
why: Each alias maps to github.com with a different key.
```

---
title: "Conditional includes: work and personal identities"
minutes: 7
---

You commit to work projects with `pankaj@company.com` and to your own with your personal email. Setting `user.email` in every work repo by hand is easy to forget. **Conditional includes** do it automatically, based on the folder.

```ini
# ~/.gitconfig
[user]
  name = K S Pankaj
  email = pankaj@users.noreply.github.com

[includeIf "gitdir:~/work/"]
  path = ~/.gitconfig-work

[includeIf "hasconfig:remote.*.url:git@github.com:acme-corp/**"]
  path = ~/.gitconfig-work
```

```ini
# ~/.gitconfig-work
[user]
  email = pankaj@acme.com
  signingkey = ~/.ssh/id_ed25519_work.pub
[core]
  sshCommand = ssh -i ~/.ssh/id_ed25519_work
```

Now every repository under `~/work/`, **or** any repo whose remote is in the `acme-corp` organization, uses the work email, the work signing key and the work SSH key.

## The conditions

| Condition | Matches |
|---|---|
| `gitdir:~/work/` | repos inside that folder (the trailing `/` means "and everything below") |
| `gitdir/i:` | same, ignoring upper and lower case (Windows, macOS) |
| `onbranch:release/*` | when the current branch matches |
| `hasconfig:remote.*.url:PATTERN` | when any remote URL matches (Git 2.36+) |

Check it worked: `cd ~/work/some-repo && git config user.email`.

```tip
Keep work and personal SSH keys separate. If you leave the company, you delete one key, and your personal account is untouched.
```

```quiz
q: Which condition applies a config to every repo under ~/work?
- onbranch:work
- [x] gitdir:~/work/
why: gitdir matches the repository's location.

q: How do you confirm which email is used in a repo?
- Look at GitHub
- [x] Run git config user.email inside it
why: It prints the final value after all includes.
```

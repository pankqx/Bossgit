---
title: Signed commits and the Verified badge
minutes: 9
setup: mkdir app && cd app && git init -q
---

Anyone can make a commit that claims to be from you. Try it:

```try
git config user.name "Linus Torvalds"
git config user.email "torvalds@linux-foundation.org"
echo "hi" > a.txt && git add . && git commit -m "Totally Linus"
git log -1
```

Git believes whatever `user.name` and `user.email` say. **Signing** a commit adds a cryptographic signature that proves it came from **your key**. GitHub then shows a green **Verified** badge.

## Sign with your SSH key (the easiest way)

```bash
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true      # sign every commit
git config --global tag.gpgsign true         # sign every annotated tag
```

Then on GitHub: **Settings → SSH and GPG keys → New SSH key → Key type: Signing key**, and paste the same public key.

To verify locally, tell Git which keys you trust:

```bash
echo "you@example.com $(cat ~/.ssh/id_ed25519.pub)" >> ~/.ssh/allowed_signers
git config --global gpg.ssh.allowedSignersFile ~/.ssh/allowed_signers
git log --show-signature -1
```

## Other ways

- **GPG** keys: the classic method (`gpg --full-generate-key`, `gpg.format openpgp`).
- **S/MIME** certificates: some companies.
- **Gitsign** (Sigstore): keyless signing with your identity provider, popular in supply-chain security.

## Vigilant mode

**Settings → SSH and GPG keys → Flag unsigned commits as unverified.** Then any commit claiming to be you, but not signed by you, shows **Unverified**. Combined with the branch rule **Require signed commits**, impersonation stops.

```fact
Commits made in GitHub's web editor, and squash merges by the button, are signed by GitHub's own key and show as Verified.
```

```quiz
q: Can anyone make a commit that says it is from you?
- [x] Yes, by setting your name and email in their config
- No, GitHub checks passwords for every commit
why: Author fields are just text. Only a signature proves who made the commit.

q: Which config makes Git sign every commit?
- user.signingkey
- [x] commit.gpgsign true
why: signingkey picks the key; commit.gpgsign turns signing on for every commit.
```

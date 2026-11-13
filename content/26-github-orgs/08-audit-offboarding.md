---
title: Audit logs and leaving a company cleanly
minutes: 7
---

## Audit logs

Organization owners can see an **audit log** (Settings → Logs → Audit log) of who did what: members added or removed, repos created or deleted, settings changed, rulesets bypassed, tokens created, secrets read by workflows. Enterprise plans can **stream** it to a SIEM like Splunk or Datadog.

```
action:repo.destroy
action:protected_branch.policy_override
actor:pankaj created:>2026-10-01
```

```bash
gh api orgs/acme/audit-log -f phrase='action:repo.destroy'     # Enterprise Cloud
```

When something goes wrong ("who turned off branch protection?"), the audit log answers in a minute.

## When someone leaves (the company's checklist)

1. Remove them from the org; **outside collaborator** access too.
2. Revoke their **personal access tokens** and **SSH keys** with org access (the org can require SSO-authorized tokens and revoke them).
3. Transfer ownership of their repos, Gists and Actions secrets they created.
4. Rotate any **shared secrets** they could see.
5. Check bots and GitHub Apps installed by them.

## When **you** leave (your checklist)

1. Your GitHub account is **yours**. Do not delete it. The company only removes you from their org.
2. Remove the work email from your account (or keep it unverified), and update your commit email config.
3. Delete work SSH keys and tokens from your account; delete local clones of company code.
4. Never take company code with you. Not even "just for my portfolio".
5. Keep your personal projects in your personal account, from day one, so there is nothing to untangle.

```warn
Pushing company code to a personal repository, even a private one, can break your contract and the law. Show what you learned with new personal projects instead.
```

```quiz
q: You change jobs. What happens to your GitHub account?
- The old company deletes it
- [x] It stays yours; the company only removes you from its organization
why: Personal accounts belong to people, not employers.

q: Where can an owner see who disabled a branch rule?
- In git log
- [x] In the organization's audit log
why: The audit log records settings changes with the actor and time.
```

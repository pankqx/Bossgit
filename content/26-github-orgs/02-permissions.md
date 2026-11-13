---
title: "Permissions: read, triage, write, maintain and admin"
minutes: 6
---

Every person or team gets one **repository role**:

| Role | Can | Give it to |
|---|---|---|
| **Read** | view, clone, open issues and comment | anyone who needs to see the code |
| **Triage** | + manage issues and PRs: labels, assign, close, mark duplicate | support staff, community helpers |
| **Write** | + push branches, merge PRs (if rules allow), manage releases | developers |
| **Maintain** | + manage some settings: topics, Pages, wikis (not destructive ones) | tech leads |
| **Admin** | + everything: rules, secrets, collaborators, delete or transfer the repo | very few people |

Enterprise organizations can create **custom roles**, for example "Write, plus can bypass the merge queue".

## Principles

- **Least privilege.** Most engineers need Write, not Admin.
- **Admins are a security risk.** An admin's stolen token can delete branch protection. Keep the list short and require 2FA.
- **Bots get their own identity**, a GitHub App with the smallest permissions (module 27), not a person's token.
- **Review access every quarter.** People change teams; access should follow.

```bash
gh api repos/{owner}/{repo}/collaborators --jq '.[] | "\(.login): \(.role_name)"'
```

```quiz
q: A support engineer must label and close issues but must not push code. Which role?
- Write
- [x] Triage
why: Triage manages issues and PRs without push access.

q: Who should have Admin on a repository?
- Every developer
- [x] As few people as possible
why: Admin can remove the protections that keep main safe.
```

---
title: Organizations, teams and roles
minutes: 7
---

A personal account is for one person. Companies and open source communities use an **organization**: a shared account that owns repositories, with people as **members**.

## Organization roles

| Role | Can |
|---|---|
| **Owner** | Everything: billing, settings, delete the org. Keep at least 2, never 20. |
| **Member** | Be in teams, see internal repos, create repos (if allowed) |
| **Billing manager** | Pay the bills, nothing else |
| **Security manager** | View and manage security alerts across all repos |
| **Outside collaborator** | Not a member; has access only to specific repos (contractors) |

## Teams

Teams group people, like `@acme/frontend` or `@acme/payments`. You give **teams** access to repos, not individuals, so when someone joins or leaves you change one team.

- Teams can be **nested**: `@acme/engineering` → `@acme/frontend`, and children inherit the parent's access.
- Mention a team in a PR (`@acme/frontend`) to notify all of them.
- Teams can be synced with your company directory (Entra ID, Okta) on Enterprise plans.
- **Team review assignment** can auto-pick one or two reviewers by round robin or load balance.

## Repository visibility

| Visibility | Who can see |
|---|---|
| Public | everyone on the internet |
| Internal (Enterprise) | every member of the enterprise |
| Private | only people and teams given access |

```tip
Set **base permissions** for members to **No permission** or **Read**, then grant write through teams. Least privilege by default makes audits and offboarding easy.
```

```quiz
q: A new developer joins the frontend team. What is the cleanest way to give access?
- Add them to each repo by hand
- [x] Add them to the @org/frontend team
why: Access is managed per team, so one change covers every repo.

q: Which role fits a short-term contractor who needs one repo?
- Owner
- Member
- [x] Outside collaborator
why: They get access to specific repos without becoming an org member.
```

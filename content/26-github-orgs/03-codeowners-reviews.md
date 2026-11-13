---
title: CODEOWNERS and required reviews
minutes: 7
setup: mkdir monorepo && cd monorepo && git init -q && mkdir web && mkdir api && echo "web" > web/app.js && echo "api" > api/server.js && git add . && git commit -q -m "Start"
---

In an organization, CODEOWNERS becomes a real **governance** tool: no change to payments code ships unless the payments team approved it.

## A company-grade CODEOWNERS

```
# Default owners
*                         @acme/platform

# Apps
/web/                     @acme/web
/mobile/                  @acme/mobile
/api/                     @acme/backend

# Sensitive areas need two teams
/api/payments/            @acme/payments @acme/security
/infra/                   @acme/sre
/.github/                 @acme/sre
/.github/CODEOWNERS       @acme/eng-leads
```

Protect the CODEOWNERS file itself, or anyone could remove themselves from review.

## The matching rules in the ruleset

- **Required approvals:** 1 or 2.
- **Require review from Code Owners:** at least one owner of **each** touched path must approve.
- **Dismiss stale approvals** when new commits are pushed.
- **Require approval of the most recent reviewable push**: the last person who pushed cannot be the only approver.

## Keeping it healthy

- Every team in CODEOWNERS must have **write** access, or GitHub ignores it (and shows an error on the file).
- Use **teams**, not people. People go on holiday.
- Turn on **team review assignment** so one member is auto-picked, not the whole team.

```try
mkdir .github
echo "* @acme/platform" > .github/CODEOWNERS
echo "/web/ @acme/web" >> .github/CODEOWNERS
echo "/api/ @acme/backend" >> .github/CODEOWNERS
cat .github/CODEOWNERS
```

```quiz
q: Why should .github/CODEOWNERS have its own owners?
- It is required by GitHub
- [x] Otherwise anyone could edit it to remove required reviewers
why: Protecting the rules file protects the rules.

q: A PR changes /web and /api. With "require Code Owner review", whose approval is needed?
- Only @acme/web
- [x] An owner from both @acme/web and @acme/backend
why: Each touched path needs one of its owners.
```

```mission
title: Governance
goal: Commit `.github/CODEOWNERS` with `@acme/platform` as default owner and `@acme/backend` owning `/api/`. Then protect the file itself: `/.github/CODEOWNERS` owned by `@acme/leads` on the **last** line.
setup: mkdir monorepo && cd monorepo && git init -q && mkdir api && echo "api" > api/server.js && git add . && git commit -q -m "Start"
check: tracked .github/CODEOWNERS
check: contains .github/CODEOWNERS * @acme/platform
check: contains .github/CODEOWNERS /api/ @acme/backend
check: contains .github/CODEOWNERS /.github/CODEOWNERS @acme/leads
check: clean
solve: mkdir .github
solve: echo "* @acme/platform" > .github/CODEOWNERS
solve: echo "/api/ @acme/backend" >> .github/CODEOWNERS
solve: echo "/.github/CODEOWNERS @acme/leads" >> .github/CODEOWNERS
solve: git add .
solve: git commit -m "chore: code owners"
```

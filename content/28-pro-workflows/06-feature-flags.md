---
title: Feature flags instead of long-lived branches
minutes: 8
---

A big feature takes six weeks. On a branch, it drifts away from `main` for six weeks, then lands in one terrifying merge. With a **feature flag**, you merge small pieces into `main` every day, **switched off**.

```js
if (flags.isEnabled('new-checkout', { userId: user.id })) {
  return renderNewCheckout()
}
return renderOldCheckout()
```

## What flags let you do

- **Merge unfinished work** safely: trunk-based development becomes possible.
- **Release gradually:** 1% of users → 10% → 50% → 100%, watching errors at each step.
- **Turn it off instantly** if something breaks. No revert, no deploy. A "kill switch".
- **Test in production** with internal users first ("dogfooding").
- **A/B test** two versions.

## Separate deploy from release

```flow
flowchart LR
  D["Deploy: code reaches production (flag off)"] --> R["Release: flag turned on for users"]
```

Deploys become boring and frequent. Releases become a business decision.

## Tools

LaunchDarkly, Unleash, Flagsmith, GrowthBook, ConfigCat, Statsig, and cloud services; or a simple config table for small apps. **OpenFeature** is a vendor-neutral standard API.

## The cost: flag debt

Every flag is an `if` with two code paths to test. Old flags rot.

- Give every flag an **owner** and an **expiry date**.
- Remove the flag and the old code path within weeks of reaching 100%.
- Track the number of live flags like any other tech debt.

```quiz
q: What does a feature flag separate?
- Frontend from backend
- [x] Deploying code from releasing it to users
why: Code can be in production, switched off, until you decide to release.

q: A flag has been at 100% for 6 months. What should happen?
- Leave it forever
- [x] Delete the flag and the old code path
why: Stale flags add complexity and hidden bugs.
```

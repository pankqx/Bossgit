---
title: Supply chain basics
minutes: 9
setup: mkdir api && cd api && git init -q && echo "server" > server.js && git add . && git commit -q -m "Start" && echo "STRIPE_KEY=sk_live_abc123" > config.js && git add . && git commit -q -m "Add payments" && echo "routes" > routes.js && git add . && git commit -q -m "Add routes"
---

Your code is safe. But you run code from hundreds of packages, GitHub Actions and build tools written by strangers. Attacking **that chain** is called a **supply chain attack**, and it is one of the biggest risks in software today.

## Real attacks, in short

- **event-stream (2018):** a popular npm package was handed to a new "maintainer" who added code to steal cryptocurrency wallets.
- **SolarWinds (2020):** attackers got into the build system and shipped malware inside signed updates to thousands of companies.
- **xz-utils (2024):** someone spent two years becoming a trusted maintainer, then hid a backdoor for SSH in the release tarballs. One engineer noticed SSH logins were 500 ms slower and found it.
- **tj-actions/changed-files (2025):** a popular GitHub Action was compromised and changed to print secrets into the logs of the workflows using it.

## Defences you can use today

| Risk | Defence |
|---|---|
| Malicious or hijacked packages | Lock files (`package-lock.json`), `npm ci`, Dependabot, review new dependencies, prefer well-maintained ones |
| Hijacked GitHub Actions | **Pin actions to a full commit SHA**, limit `permissions:`, use Dependabot for actions |
| Stolen tokens in CI | OIDC instead of stored keys, environment protection, short-lived tokens |
| Impersonated commits | Signed commits + "require signed commits" |
| Tampered builds | Build in CI only, **artifact attestations** (`actions/attest-build-provenance`), SLSA levels |
| Unknown contents | Generate an **SBOM** (software bill of materials): Settings → Insights → Dependency graph → Export SBOM |

```tip
Treat a new dependency like a new teammate with production access. Check: who maintains it, when it was last updated, how many people use it, and whether you could write the 20 lines yourself.
```

```quiz
q: Why pin an action as uses: owner/action@<full sha> instead of @v3?
- It runs faster
- [x] A tag can be moved to malicious code; a commit SHA cannot change
why: Commit ids are content hashes. Tags are just movable names.

q: What is an SBOM?
- A kind of bug
- [x] A list of every component and dependency in your software
why: It lets you check quickly whether you are affected by a new vulnerability.
```

```mission
title: The Leaked Key
boss: true
goal: Two commits ago someone committed `config.js` with a live Stripe key. Nothing is pushed yet. Rewrite the **local** history so `config.js` never appears in any commit, keep `routes.js` and `server.js`, and add `config.js` to `.gitignore`. (In real life you would also rotate the key.)
setup: mkdir api && cd api && git init -q && echo "server" > server.js && git add . && git commit -q -m "Start" && echo "STRIPE_KEY=sk_live_abc123" > config.js && git add . && git commit -q -m "Add payments" && echo "routes" > routes.js && git add . && git commit -q -m "Add routes"
check: neverin config.js
check: tracked routes.js
check: tracked server.js
check: contains .gitignore config.js
check: tracked .gitignore
check: clean
hint: git reset --soft HEAD~2 puts both commits' changes back in the staging area.
hint: git rm --cached config.js, then echo "config.js" > .gitignore and git add .gitignore
hint: Commit again: git commit -m "Add payments and routes"
solve: git reset --soft HEAD~2
solve: git rm --cached config.js
solve: echo "config.js" > .gitignore
solve: git add .gitignore
solve: git commit -m "Add payments and routes"
```

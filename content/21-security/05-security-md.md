---
title: SECURITY.md and responsible disclosure
minutes: 6
setup: mkdir lib && cd lib && git init -q && echo "lib" > README.md && git add . && git commit -q -m "Start"
---

Someone finds a security hole in your project. Where do they tell you? If the answer is "a public issue", attackers read it at the same time you do. A **SECURITY.md** file tells people how to report **privately**.

## A simple SECURITY.md

```markdown
# Security Policy

## Supported versions
| Version | Supported |
|---------|-----------|
| 2.x     | ✅ |
| 1.x     | ❌ |

## Reporting a vulnerability
Please do NOT open a public issue.
Use GitHub's "Report a vulnerability" button in the Security tab,
or email security@example.com.
We reply within 3 working days and aim to fix critical issues within 14 days.
```

GitHub links this file in the **Security** tab and on the new-issue page.

## Private vulnerability reporting

Turn it on in **Settings → Code security → Private vulnerability reporting**. Reporters get a private form. You then work in a **draft security advisory**: discuss privately, make a **temporary private fork** to fix it, request a **CVE** id, and publish the advisory with the release. Dependabot then alerts everyone who uses the vulnerable versions.

## If you find a hole in someone else's project

1. Do not post it publicly. Do not exploit it beyond what proves it exists.
2. Follow their SECURITY.md, or contact the maintainers privately.
3. Give them reasonable time to fix (often 90 days) before talking publicly.
4. Many companies pay **bug bounties** (HackerOne, Bugcrowd). Read the rules first.

```quiz
q: Where should a security bug be reported for a project with a SECURITY.md?
- A public issue
- A tweet
- [x] The private channel the SECURITY.md describes
why: Public reports give attackers a head start.

q: What does a CVE id give a vulnerability?
- A fix
- [x] A unique public identifier that tools and people can track
why: Scanners like Dependabot use CVE and advisory ids to warn users.
```

```mission
title: Open the right door
goal: Add a `SECURITY.md` that contains a `## Reporting a vulnerability` section and tells people **not** to open a public issue (it must contain `public issue`). Commit it.
setup: mkdir lib && cd lib && git init -q && echo "lib" > README.md && git add . && git commit -q -m "Start"
check: tracked SECURITY.md
check: contains SECURITY.md ## Reporting a vulnerability
check: contains SECURITY.md public issue
check: clean
solve: echo "# Security Policy" > SECURITY.md
solve: echo "## Reporting a vulnerability" >> SECURITY.md
solve: echo "Please do not open a public issue. Use the Report a vulnerability button." >> SECURITY.md
solve: git add .
solve: git commit -m "docs: add security policy"
```

---
title: "Inner source: open source habits inside a company"
minutes: 6
---

**Inner source** means running internal projects the way good open source projects run: anyone in the company can read the code, open issues and send pull requests to any team's repository.

## Why companies do it

- The checkout team needs a fix in the auth library. Instead of a ticket that waits for 3 weeks, they send a PR.
- Less duplicated code: teams find and reuse each other's work.
- Knowledge spreads across teams.
- Engineers grow by contributing outside their own area.

## What it needs

| Piece | Example |
|---|---|
| **Visibility** | Repos are *internal*, so all employees can read them |
| **Docs for outsiders** | README, CONTRIBUTING.md: how to build, test and propose changes |
| **Clear owners** | CODEOWNERS and a "trusted committer" rotation that reviews outside PRs |
| **Service levels** | "We reply to PRs within 2 working days" |
| **Recognition** | Contributions to other teams count in reviews and promotions |

```story
At a large bank, the mobile team waited six weeks for the API team to add one field. After they moved to inner source, a mobile engineer sent a 40-line pull request with tests. The API team reviewed it the same day. A year later, 30% of the API repo's PRs came from other teams.
```

```quiz
q: What is inner source?
- Hiding code from other teams
- [x] Using open source collaboration practices inside a company
why: Internal repos are open to contributions from any team.

q: Which file helps engineers from other teams contribute?
- .gitignore
- [x] CONTRIBUTING.md
why: It explains how to set up, test and submit changes.
```

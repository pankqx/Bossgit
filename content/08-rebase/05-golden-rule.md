---
title: "The golden rule: never rebase shared history"
minutes: 7
---

> **Do not rebase commits that exist outside your own computer and that other people may have built on.**

That's the rule. Here is why it matters so much.

```flow
flowchart TD
  A["You push feature to GitHub"] --> B["Riya pulls it and adds 2 commits"]
  B --> C["You rebase feature and force-push"]
  C --> D["Riya's commits now sit on top of commits that no longer exist"]
  D --> E["Her next pull makes duplicate commits and conflicts everywhere"]
```

Rebase makes **new copies** of commits and throws the old ones away. If someone else has the old ones, their history and yours have split. Git cannot tell that "Add login" and "Add login (copy)" are the same work, so it tries to merge both.

## What counts as shared

| Branch | Rebase it? |
|---|---|
| Your local branch, never pushed | Yes, freely |
| Your feature branch on GitHub, only you push to it | Yes, with `--force-with-lease` |
| A feature branch two people push to | Only if you agree first |
| `main`, `develop`, `release/*` | **Never** |

```tip
Protect `main` on GitHub (module 13) so nobody can force-push to it, not even by accident. This one setting prevents the worst Git disaster most teams ever have.
```

## If it happened anyway

The person whose branch moved can usually recover with:

```bash
git fetch
git rebase --onto origin/feature <old-base> my-local-work
# or, when they had no local commits:
git reset --hard origin/feature
```

```story
A team of six lost a day because someone rebased develop and force-pushed. Every developer got hundreds of "duplicate" commits on their next pull. The fix was boring: everyone saved their own new commits, ran git reset --hard origin/develop, and cherry-picked their work back. The next morning, develop had branch protection.
```

```quiz
q: Which branch is safe to rebase?
- main
- A branch your teammate is also pushing to
- [x] A local branch you have never pushed
why: Nobody else has those commits, so replacing them breaks nobody.

q: Why does rebasing shared history cause trouble?
- Rebase deletes files
- [x] Others still have the old commits, and Git sees the rebased copies as different commits
- GitHub blocks it
why: Same changes, different ids. Git treats them as two separate sets of work.
```

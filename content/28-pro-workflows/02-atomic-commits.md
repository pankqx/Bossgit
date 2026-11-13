---
title: Atomic commits and how to tell a story with history
minutes: 9
setup: mkdir shop && cd shop && git init -q && echo "shop" > README.md && git add . && git commit -q -m "chore: start"
---

An **atomic commit** does **one** logical thing, completely. It builds, the tests pass, and its message says why.

## Compare two histories for the same work

```
❌  wip
❌  more stuff
❌  fix
❌  final fix, add tests, rename variables, update deps
```

```
✅  refactor(cart): extract price calculation into calculateTotal()
✅  feat(cart): apply coupon codes to the total
✅  test(cart): cover expired and invalid coupons
✅  chore(deps): bump date-fns to 4.1
```

The second one can be **reviewed** commit by commit, **reverted** one piece at a time, **bisected** precisely, and **read** a year later.

## How to get there

- **Stage pieces, not files:** `git add -p` lets you pick hunks, so one file's two unrelated changes go into two commits.
- **Commit refactors separately** from behaviour changes. "No behaviour change" commits are fast to review.
- **Clean up before review** with `git rebase -i` (squash fixups, reorder, reword).
- **Write messages** with a subject (what) and a body (why):

```
fix(checkout): round totals to two decimals

Card payments failed for amounts like 10.005 because the payment
provider rejects more than two decimals. Round with banker's rounding,
like the invoice service already does.

Fixes #482
```

```try
echo "export const total = (a) => a" > cart.js
git add cart.js && git commit -m "refactor(cart): add calculateTotal"
echo "export const coupon = (t) => t * 0.9" > coupon.js
git add coupon.js && git commit -m "feat(cart): apply coupon codes"
git log --oneline
```

```quiz
q: What makes a commit atomic?
- It changes one file
- [x] It contains one complete logical change that builds on its own
why: Atomic is about meaning, not file count.

q: Which command lets you commit only part of a file's changes?
- git add .
- [x] git add -p
why: -p (patch) asks hunk by hunk what to stage.
```

```mission
title: Two stories, two commits
goal: Two unrelated changes are waiting: a bug fix in `cart.js` and a new `docs.md`. Make **two separate commits**: first the fix with a message starting `fix`, then the docs with a message starting `docs`.
setup: mkdir shop && cd shop && git init -q && echo "total = a - b" > cart.js && git add . && git commit -q -m "chore: start" && echo "total = a + b" > cart.js && echo "How to use the cart" > docs.md
check: exactcommits 3
check: message docs
check: run git log --oneline -1 HEAD~1 => fix
check: clean
hint: git add cart.js, then git commit -m "fix(cart): add instead of subtract"
hint: git add docs.md, then git commit -m "docs: explain the cart"
solve: git add cart.js
solve: git commit -m "fix(cart): add instead of subtract"
solve: git add docs.md
solve: git commit -m "docs: explain the cart"
```

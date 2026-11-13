---
title: Writing a description people want to read
minutes: 7
---

Reviewers are busy. A good description gets your PR reviewed today. A bad one gets "what is this?" tomorrow.

## A template that works everywhere

```markdown
## What
Adds a wishlist page where signed-in users can save products.

## Why
Closes #128. 30% of support tickets ask for a way to "save for later".

## How
- New `Wishlist` component and `/wishlist` route
- `POST /api/wishlist` stores items in the `wishlist_items` table
- Reuses `ProductCard`, no new styles

## How to test
1. Sign in as test@shop.dev
2. Open any product, click "Save"
3. Go to /wishlist: the product is there

## Screenshots
(before / after)

## Notes for reviewers
The migration is in `db/0042_wishlist.sql`. Please look at the index there.
```

## Rules of thumb

- **Small PRs.** Under ~400 changed lines get reviewed faster and have fewer bugs. Split big work into a chain of PRs (module 28: stacked PRs).
- **One topic per PR.** Do not mix a refactor, a bug fix and a new feature.
- **Link the issue** with `Closes #128` so it closes on merge (module 12).
- **Show, don't tell.** Screenshots or a short screen recording for anything visual.
- **Review your own PR first.** Read the diff on GitHub before you ask anyone. You will catch half the problems yourself.

```tip
Add a `.github/pull_request_template.md` to the repo. GitHub fills every new PR with it, so the whole team writes good descriptions without thinking.
```

```quiz
q: What is the most important thing a PR description explains?
- Which editor you used
- [x] Why the change is needed and how to check it works
why: The diff shows what changed. Only you can explain why and how to verify it.

q: Your PR changes 3,000 lines across a refactor and two features. What is the best move?
- Ask for review anyway
- [x] Split it into smaller PRs, one topic each
why: Small focused PRs are reviewed faster and more carefully.
```

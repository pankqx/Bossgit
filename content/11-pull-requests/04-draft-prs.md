---
title: Draft pull requests
minutes: 5
---

A **draft PR** says "I am working on this, it is not ready to merge, but you can look". GitHub will not let anyone merge it, and it does not ask code owners for review yet.

## When to use one

- You want early feedback on the approach before writing tests.
- You want CI to run on your branch while you keep working.
- You are pairing with someone and want a place to discuss.

## How

- On GitHub: in the **Create pull request** button's dropdown, pick **Create draft pull request**.
- From the terminal: `gh pr create --draft`.
- When it is done: click **Ready for review**, or `gh pr ready`.
- Changed your mind about an open PR? **Convert to draft** is in the reviewers sidebar.

```tip
Write a checklist in the description of a draft PR. GitHub shows its progress ("3 of 5 tasks") on the PR list.
```

```markdown
- [x] API endpoint
- [x] UI
- [ ] Tests
- [ ] Docs
```

```quiz
q: Can a draft PR be merged?
- Yes, like any PR
- [x] No, it must be marked ready for review first
why: Drafts are protected from merging on purpose.

q: Does CI run on a draft PR?
- [x] Yes, workflows run as usual (unless the workflow says otherwise)
- No, never
why: Running CI early is one of the reasons to open a draft.
```

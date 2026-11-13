---
title: Closing issues from a pull request
minutes: 6
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start"
---

When a PR that fixes an issue is merged, the issue should close by itself. You make that happen with a **keyword** in the PR description or a commit message.

```
Closes #42
Fixes #42
Resolves #42
```

All of these work: `close`, `closes`, `closed`, `fix`, `fixes`, `fixed`, `resolve`, `resolves`, `resolved`. Upper or lower case does not matter. For another repository use `Fixes owner/repo#42`. For several, repeat the keyword: `Fixes #42, fixes #43`.

```try
echo "fix" > login.js
git add . && git commit -m "fix: stop login loop" -m "Fixes #42"
git log -1
```

The second `-m` adds a paragraph to the commit message, which is the usual place for issue references.

## Rules to know

- The issue closes when the PR is merged into the **default branch** (usually `main`). Merging into `develop` does not close it.
- A PR that only *mentions* `#42` (no keyword) links to it but does not close it. Use that for "related to".
- You can also link an issue manually in the PR sidebar under **Development**.

```tip
In the issue, GitHub shows "linked pull requests", so anyone reading the bug can jump straight to the fix and its review.
```

```quiz
q: Which line in a PR description closes issue 17 on merge?
- See #17
- [x] Resolves #17
- Issue 17 done
why: resolves is one of the closing keywords. A plain mention only links.

q: The PR says "Fixes #17" and is merged into develop, not main. Is #17 closed?
- Yes
- [x] No, only merges into the default branch close issues
why: GitHub closes issues on merge into the default branch.
```

```mission
title: Close the loop
goal: Fix the bug by creating `cart.js`, and commit it with a message that will **close issue #7** when merged.
setup: mkdir shop && cd shop && git init -q && echo "shop" > README.md && git add . && git commit -q -m "Start"
check: tracked cart.js
check: message #7
check: run git log -1 => Fix
hint: Use a closing keyword like Fixes.
hint: git commit -m "fix: cart total" -m "Fixes #7"
solve: echo "cart" > cart.js
solve: git add .
solve: git commit -m "fix: cart total" -m "Fixes #7"
```

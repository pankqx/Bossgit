---
title: When hooks get in the way, and --no-verify
minutes: 7
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start"
---

Sometimes you need to commit a work-in-progress that fails the linter, or the hook itself is broken. You can skip it:

```bash
git commit --no-verify -m "wip: half done"     # skips pre-commit and commit-msg
git commit -n -m "wip"                          # same, short
git push --no-verify                            # skips pre-push
HUSKY=0 git commit -m "wip"                     # Husky's own switch
SKIP=ruff git commit -m "..."                   # pre-commit framework: skip one hook
```

## When it is fine

- A **local wip commit** you will squash before review.
- The hook is broken and you are fixing the hook itself.
- An emergency hotfix, when CI will still check everything.

## When it is not

- To push code you know fails tests to a shared branch.
- Because the hook is "annoying". Then the hook is too slow or too strict: fix the hook.

## Make hooks people want to keep

- Under 5 seconds for pre-commit.
- Clear error messages that say **how to fix** it.
- Auto-fix instead of complain wherever possible.
- Everything a hook checks is **also** checked in CI, so skipping it locally cannot break main.

```quiz
q: Does --no-verify skip CI checks on GitHub?
- Yes
- [x] No, it only skips local hooks
why: CI runs on GitHub's machines and cannot be skipped from your laptop.

q: Your team keeps using --no-verify. What is the best fix?
- Ban it
- [x] Make the hooks faster and clearer, and enforce the same checks in CI
why: People skip hooks that are slow or confusing.
```

```mission
title: The Broken Build
boss: true
goal: Builds keep breaking because people forget to run tests. Share a hook with the team: create `.githooks/pre-push` that runs `npm test`, point `core.hooksPath` at `.githooks`, and commit the hook.
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start"
check: config core.hooksPath .githooks
check: tracked .githooks/pre-push
check: contains .githooks/pre-push npm test
check: contains .githooks/pre-push #!/bin/sh
check: clean
hint: mkdir .githooks, then echo "#!/bin/sh" > .githooks/pre-push and echo "npm test" >> .githooks/pre-push
hint: git config core.hooksPath .githooks, then add and commit
solve: mkdir .githooks
solve: echo "#!/bin/sh" > .githooks/pre-push
solve: echo "npm test" >> .githooks/pre-push
solve: git config core.hooksPath .githooks
solve: git add .
solve: git commit -m "chore: run tests before push"
```

---
title: Force push and --force-with-lease
minutes: 8
setup: bossgit github https://github.com/you/app && mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start" && git remote add origin https://github.com/you/app && git push -q -u origin main && git switch -q -c feat/ui && echo "ui" > ui.js && git add . && git commit -q -m "wip ui" && git push -q -u origin feat/ui
---

After you amend, rebase or squash a branch you already pushed, a normal push is rejected: your history and GitHub's no longer line up. You must **force** the push.

```try
git commit --amend -m "feat: add the new UI"
git push
git push --force-with-lease
```

## --force vs --force-with-lease

| | `--force` | `--force-with-lease` |
|---|---|---|
| Overwrites the remote branch | always | only if it is still where **you last saw it** |
| If a teammate pushed meanwhile | their commits are deleted | push is **refused** |

`--force-with-lease` compares GitHub's branch with your `origin/feat/ui`. If someone added commits you have not fetched, it stops.

```warn
There is one trap. If you run `git fetch` (or an editor does it in the background) **without** looking, your `origin/branch` is updated, and the lease passes anyway. For extra safety in Git 2.30+: `git push --force-with-lease --force-if-includes`.
```

```bash
git config --global alias.pushf "push --force-with-lease --force-if-includes"
```

## Golden rules

- Force-push **only your own branches**.
- **Never** force-push `main`. Protect it on GitHub so you cannot.
- Tell people if you force-push a branch they are reviewing: "Rebased on main, no code changes."

```quiz
q: When does --force-with-lease refuse to push?
- When you have uncommitted changes
- [x] When the remote branch has commits you have not seen
why: It only overwrites what you already know about.

q: Which branch should never be force-pushed?
- Your own feature branch
- [x] main
why: Everyone builds on main. Rewriting it breaks every clone.
```

```mission
title: Rewrite safely
goal: Your pushed branch `feat/ui` has a commit called `wip ui`. Rename it to `feat: add the new UI` and update GitHub **safely**.
setup: bossgit github https://github.com/you/app && mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start" && git remote add origin https://github.com/you/app && git push -q -u origin main && git switch -q -c feat/ui && echo "ui" > ui.js && git add . && git commit -q -m "wip ui" && git push -q -u origin feat/ui
check: message feat: add the new UI
check: pushed feat/ui
check: exactcommits 2
hint: git commit --amend -m "feat: add the new UI"
hint: git push --force-with-lease
solve: git commit --amend -m "feat: add the new UI"
solve: git push --force-with-lease
```

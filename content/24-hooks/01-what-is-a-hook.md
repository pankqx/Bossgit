---
title: What a hook is and where hooks live
minutes: 7
setup: mkdir app && cd app && git init -q
---

A **hook** is a script that Git runs automatically at a certain moment: before a commit, after a checkout, before a push. If a "pre-" hook exits with an error, Git **stops** the action.

```try
ls .git/hooks
```

A new repo has sample hooks ending in `.sample`. To activate one, make a file with the exact hook name (no extension) and make it executable.

## The hooks you will actually use

| Hook | Runs | Typical job |
|---|---|---|
| `pre-commit` | before the commit is made | lint, format, scan for secrets |
| `prepare-commit-msg` | before the message editor opens | add the ticket number from the branch name |
| `commit-msg` | after you write the message | enforce Conventional Commits |
| `post-commit` | after the commit | notifications |
| `pre-push` | before pushing | run tests |
| `post-checkout`, `post-merge` | after switching or pulling | `npm install` if the lockfile changed |
| `pre-rebase` | before a rebase | block rebasing protected branches |

## A first hook

```bash
cat > .git/hooks/pre-commit <<'HOOK'
#!/bin/sh
if git diff --cached | grep -q "console.log"; then
  echo "Remove console.log before committing."
  exit 1
fi
HOOK
chmod +x .git/hooks/pre-commit
```

Exit code `0` lets the commit continue. Anything else stops it.

## The catch

`.git/hooks` is **not** committed or shared. Each person's clone has its own. That is why teams use the tools in lesson 5.

```quiz
q: A pre-commit hook exits with code 1. What happens?
- The commit is made with a warning
- [x] The commit is stopped
why: A non-zero exit from a pre- hook aborts the action.

q: Are files in .git/hooks shared when you push?
- Yes
- [x] No, they stay in your local clone
why: Nothing inside .git is pushed except objects and refs.
```

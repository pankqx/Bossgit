---
title: Recovering a deleted branch
minutes: 6
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start" && git switch -q -c experiment && echo "idea" > idea.txt && git add . && git commit -q -m "Brilliant idea" && git switch -q main && git branch -q -D experiment
---

You ran `git branch -D experiment`. A week of work, gone? No. A branch is just a name. The commits are still there.

```try
git branch
git reflog
```

Find the last commit of the branch: the line `commit: Brilliant idea`, or the one just before `checkout: moving from experiment to main`. Then give it a name again:

```try
git branch experiment HEAD@{1}
git log --oneline experiment
```

`git branch NAME ID` creates a branch pointing at any commit. You can use the short id from the reflog instead of `HEAD@{1}`.

## When `-D` printed the id

`git branch -D` prints `Deleted branch experiment (was 7f3a2b1).` That id is all you need:

```bash
git branch experiment 7f3a2b1
```

## Deleted on GitHub?

If the branch was deleted on GitHub after a PR, the PR page has a **Restore branch** button. If it was only on someone's laptop, their reflog has it.

```quiz
q: What does git branch rescue a1b2c3 do?
- Deletes a1b2c3
- [x] Creates a branch called rescue pointing at commit a1b2c3
why: A branch is a name for a commit. You can attach the name anywhere.

q: Where do you find the id of the last commit on a deleted branch?
- git log
- [x] git reflog, or the "was ..." id that git branch -D printed
why: git log no longer reaches it, but the reflog remembers.
```

```mission
title: Bring it back
goal: The branch `payments` was deleted by mistake. Recreate it so it points at its last commit, `Add refunds`.
setup: mkdir shop && cd shop && git init -q && echo "shop" > README.md && git add . && git commit -q -m "Start" && git switch -q -c payments && echo "pay" > pay.js && git add . && git commit -q -m "Add payments" && echo "refund" > refund.js && git add . && git commit -q -m "Add refunds" && git switch -q main && git branch -q -D payments
check: branch payments
check: branchhas payments refund.js
check: branchhas payments pay.js
check: head main
hint: git reflog: the line before "moving from payments to main" is the last commit.
hint: git branch payments HEAD@{1}
solve: git branch payments HEAD@{1}
```

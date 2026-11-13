---
title: Keeping a fork in sync
minutes: 8
setup: bossgit github https://github.com/maker/tool && bossgit github https://github.com/you/tool && mkdir tool && cd tool && git init -q && echo "v1" > tool.txt && git add . && git commit -q -m "v1" && git remote add upstream https://github.com/maker/tool && git push -q upstream main && git remote add origin https://github.com/you/tool && git push -q -u origin main && bossgit teammate https://github.com/maker/tool fix.txt maintainer fixed a bug
---

The original project keeps moving. Your fork does not update by itself. Before you start new work, sync.

## From the terminal

```try
git fetch upstream
git log --oneline main..upstream/main
git switch main
git merge --ff-only upstream/main
git push origin main
```

1. `fetch upstream` downloads the maintainers' new commits.
2. `merge --ff-only` moves your `main` forward. If it refuses, you committed on `main` by mistake.
3. `push origin main` updates your fork on GitHub.

## From GitHub

On your fork's page, click **Sync fork → Update branch**. Or:

```bash
gh repo sync you/tool
```

## Update a PR branch that is behind

```bash
git switch fix/docs
git fetch upstream
git rebase upstream/main
git push --force-with-lease
```

```tip
Maintainers love contributors who keep PRs up to date and conflict-free. Many projects ask for rebase rather than merge, so the PR history stays clean.
```

```quiz
q: git merge --ff-only upstream/main refuses on your fork's main. What does that suggest?
- upstream is broken
- [x] You have your own commits on main, which you should move to a branch
why: --ff-only only works if your main has nothing extra.

q: After syncing locally, how does your fork on GitHub get the new commits?
- Automatically
- [x] git push origin main
why: Your fork only changes when you push to it (or click Sync fork).
```

```mission
title: Catch up with the maintainers
goal: The original project (`upstream`) has a new commit. Bring your local `main` **and** your fork (`origin`) up to date with it.
setup: bossgit github https://github.com/maker/tool && bossgit github https://github.com/you/tool && mkdir tool && cd tool && git init -q && echo "v1" > tool.txt && git add . && git commit -q -m "v1" && git remote add upstream https://github.com/maker/tool && git push -q upstream main && git remote add origin https://github.com/you/tool && git push -q -u origin main && bossgit teammate https://github.com/maker/tool fix.txt maintainer fixed a bug
check: same main upstream/main
check: pushed main
check: tracked fix.txt
hint: git fetch upstream
hint: git merge --ff-only upstream/main, then git push origin main
solve: git fetch upstream
solve: git merge --ff-only upstream/main
solve: git push origin main
```

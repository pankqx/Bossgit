---
title: git filter-repo
minutes: 10
setup: mkdir big && cd big && git init -q && echo "app" > app.js && git add . && git commit -q -m "Start" && echo "secret" > keys.txt && git add . && git commit -q -m "Add keys" && echo "more" >> app.js && git commit -q -am "More app" && git rm -q keys.txt && git commit -q -m "Remove keys"
---

Sometimes you must change **all of history**: remove a file from every commit, strip out a folder of huge videos, change an old email in every commit. The modern tool is **git filter-repo** (github.com/newren/git-filter-repo). The Git project itself recommends it over the old `git filter-branch`, which is slow and easy to get wrong.

## Install

```bash
pip install git-filter-repo        # or: brew install git-filter-repo, apt install git-filter-repo
```

## Common jobs

```bash
# Always work on a fresh clone, not your only copy
git clone --no-local app app-clean && cd app-clean

git filter-repo --path keys.txt --invert-paths          # remove a file from every commit
git filter-repo --path videos/ --invert-paths           # remove a folder
git filter-repo --strip-blobs-bigger-than 50M           # remove every huge file
git filter-repo --replace-text expressions.txt          # replace text (e.g. passwords) everywhere
git filter-repo --mailmap my-mailmap                    # fix author names and emails
git filter-repo --subdirectory-filter packages/ui       # turn a subfolder into its own repo, with history
```

`expressions.txt` holds lines like `AKIAEXAMPLE123==>REMOVED`.

## After filtering

- Every rewritten commit has a **new id**.
- filter-repo removes the `origin` remote on purpose, so you do not push by accident. Add it back, then:

```bash
git remote add origin git@github.com:you/app.git
git push --force --all
git push --force --tags
```

- Everyone must **re-clone**. Merging an old clone back in would bring the removed files right back.

```tip
For simple "delete a big file or password everywhere" jobs, **BFG Repo-Cleaner** is another popular tool. It is a Java program and very fast.
```

Here you can see the problem filter-repo solves:

```try
git log --oneline -- keys.txt
git show HEAD~2:keys.txt
```

```quiz
q: Which tool does the Git project recommend for rewriting all of history?
- git filter-branch
- [x] git filter-repo
why: filter-branch is deprecated in practice: slow and full of traps.

q: After running filter-repo and force-pushing, what must teammates do?
- git pull
- [x] Delete their clones and clone again
why: Old clones still contain the old history and would bring it back.
```

```mission
title: The Lost Commit Phantom
boss: true
goal: A rebase went wrong and your branch `feature` now only has `Start`. The real work (commits `Add search` and `Add filters`) is lost. Make `feature` point back at `Add filters` and stay on `feature`.
setup: mkdir shop && cd shop && git init -q && echo "shop" > README.md && git add . && git commit -q -m "Start" && git switch -q -c feature && echo "search" > search.js && git add . && git commit -q -m "Add search" && echo "filters" > filters.js && git add . && git commit -q -m "Add filters" && git reset -q --hard main
check: head feature
check: message Add filters
check: file search.js
check: file filters.js
check: exactcommits 3
hint: git reflog shows where HEAD was before the reset.
hint: git reset --hard HEAD@{1}
solve: git reset --hard HEAD@{1}
```

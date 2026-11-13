---
title: "git cherry-pick: copy one commit"
minutes: 8
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start" && git branch release && git switch -q -c dev && echo "beta" > beta.txt && git add . && git commit -q -m "Beta feature" && echo "fixed" > security.txt && git add . && git commit -q -m "Fix security hole" && echo "more beta" >> beta.txt && git commit -q -am "More beta" && git switch -q release
---

A security fix is on `dev`, between two unfinished features. `release` needs **only the fix**, not the beta features. Merging `dev` would bring everything. Cherry-pick copies just one commit.

```try
git log --oneline dev
git cherry-pick dev~1
git log --oneline
ls
```

`release` now has a new commit with the same change and message as "Fix security hole". It has a **different id**, because its parent is different.

```flow
flowchart LR
  S[Start] --> B[Beta feature] --> F[Fix security hole] --> M[More beta]
  S --> F2["Fix security hole (copy)"]
  R((release)) -.-> F2
  D((dev)) -.-> M
```

## Useful forms

```bash
git cherry-pick abc123             # one commit
git cherry-pick abc123 def456      # several
git cherry-pick A..B               # a range (everything after A, up to B)
git cherry-pick -x abc123          # adds "(cherry picked from commit abc123)" to the message
git cherry-pick -n abc123          # apply the change but do not commit yet
git cherry-pick --continue / --abort / --skip   # same as rebase, when there is a conflict
```

```tip
Use `-x` when you backport fixes to release branches. Months later, anyone can see where the fix came from.
```

```warn
Cherry-pick is a scalpel, not a workflow. If you cherry-pick dozens of commits between branches every week, the same change exists twice with different ids, and future merges get confusing. Merging is usually the better long-term habit.
```

```quiz
q: Does a cherry-picked commit have the same id as the original?
- Yes
- [x] No, it has a new parent, so it has a new id
why: The change and message are copied, but the commit is new.

q: When is cherry-pick the right tool?
- To combine two long branches
- [x] To copy one specific fix to another branch
- To undo a commit
why: It shines for small, targeted copies like hotfixes and backports.
```

```mission
title: Just the fix
goal: Copy **only** the `Fix crash` commit from `dev` onto `release`. `release` must not get `beta.txt`.
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start" && git branch release && git switch -q -c dev && echo "beta" > beta.txt && git add . && git commit -q -m "Beta feature" && echo "fixed" > crash.txt && git add . && git commit -q -m "Fix crash" && git switch -q release
check: head release
check: message Fix crash
check: file crash.txt
check: nofile beta.txt
check: exactcommits 2
hint: The fix is the newest commit on dev, so its name is dev.
hint: git cherry-pick dev
solve: git cherry-pick dev
```

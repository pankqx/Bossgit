---
title: Refs and the index file
minutes: 8
setup: mkdir app && cd app && git init -q && echo "v1" > a.txt && git add . && git commit -q -m "One" && echo "v2" > a.txt && git commit -q -am "Two" && git branch feature HEAD~1
---

## Refs: names for commits

A **ref** is a name that points to a commit (or another ref).

| Ref | Lives at | Moves when |
|---|---|---|
| `refs/heads/main` | branch | you commit on it |
| `refs/tags/v1.0` | tag | never |
| `refs/remotes/origin/main` | remote-tracking | you fetch, pull or push |
| `HEAD` | `.git/HEAD` | you switch, or commit |
| `refs/stash` | stash | you stash |

```try
git show-ref
git rev-parse feature
git update-ref refs/heads/feature main
git rev-parse feature
```

`update-ref` just moved a branch, with no checkout and no merge. This is literally what `git branch -f feature main` does.

## Revision syntax

| You write | Means |
|---|---|
| `HEAD~3` | 3 commits back, following first parents |
| `HEAD^2` | the second parent (of a merge) |
| `main@{yesterday}` | where main was yesterday (from the reflog) |
| `HEAD@{2}` | where HEAD was 2 moves ago |
| `v1.0^{commit}` | the commit a tag points to |
| `main:src/app.js` | that file in main |
| `:/fix login` | the newest commit whose message matches "fix login" |

## The index

`.git/index` is a binary file: a sorted list of every tracked path with its blob id, file mode and timestamps. It **is** the staging area.

- `git add` hashes the file into a blob and writes its id into the index.
- `git commit` turns the index into trees (`write-tree`) and wraps them in a commit.
- `git status` compares three things: HEAD's tree, the index, and your folder.

```bash
git ls-files --stage      # print the index: mode, blob id, stage number, path
```

During a conflict, the index holds **three** versions of the file (stages 1, 2 and 3: base, ours, theirs). That is how `git checkout --ours` knows what "ours" is.

```try
git ls-files
```

```quiz
q: What is the staging area, physically?
- A folder called staging
- [x] The .git/index file
why: The index lists each tracked path with the blob it will commit.

q: What does git update-ref refs/heads/x main do?
- Merges main into x
- [x] Points branch x at the same commit as main
why: It writes the commit id into the ref, nothing else.
```

```mission
title: Move a branch by hand
goal: Without `git branch`, `git switch`, `git reset` or `git merge`, make the branch `feature` point at the same commit as `main`, using a plumbing command.
setup: mkdir app && cd app && git init -q && echo "v1" > a.txt && git add . && git commit -q -m "One" && echo "v2" > a.txt && git commit -q -am "Two" && git branch feature HEAD~1
check: same feature main
check: head main
hint: git update-ref refs/heads/feature main
solve: git update-ref refs/heads/feature main
```

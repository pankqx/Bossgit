---
title: Plumbing commands
minutes: 8
setup: mkdir app && cd app && git init -q && echo "hello" > a.txt && git add . && git commit -q -m "First"
---

Git has two layers of commands:

- **Porcelain:** the friendly commands for people: `add`, `commit`, `log`, `switch`, `merge`.
- **Plumbing:** small, stable commands that do one low-level job. Porcelain is built on top of them, and scripts use them because their output never changes format.

## The plumbing you should know

| Command | Job |
|---|---|
| `git hash-object [-w] FILE` | Hash a file (and with `-w`, store it as a blob) |
| `git cat-file -t / -p ID` | Show an object's type / content |
| `git ls-tree REV` | List a tree |
| `git update-index --add FILE` | Put a file into the staging area |
| `git write-tree` | Turn the staging area into a tree object |
| `git commit-tree TREE -p PARENT -m MSG` | Make a commit object from a tree |
| `git update-ref refs/heads/main ID` | Move a branch |
| `git symbolic-ref HEAD` | Read (or set) what HEAD points to |
| `git rev-parse NAME` | Turn any name into an id |
| `git show-ref` | List all refs with their ids |
| `git for-each-ref`, `git rev-list` | Script-friendly listings of refs and commits |

```try
git rev-parse HEAD
git cat-file -p HEAD
git ls-tree HEAD
git show-ref
git symbolic-ref HEAD
```

## Why seniors care

- Writing scripts and CI jobs: `git rev-parse --abbrev-ref HEAD` gives the branch name, `git rev-list --count main..HEAD` counts commits on a branch.
- Debugging: when porcelain says something confusing, plumbing shows the truth.
- Interviews: "What happens when you run `git commit`?" The answer is in the next lesson.

```tip
Use `git status --porcelain` (yes, the name is confusing) in scripts. It prints a stable, machine-readable format.
```

```quiz
q: Why do scripts prefer plumbing commands?
- They are faster to type
- [x] Their output format is stable and meant for programs
why: Porcelain output can change between versions to be friendlier to people.

q: Which command turns the staging area into a tree object?
- git commit-tree
- [x] git write-tree
why: write-tree saves the index as a tree. commit-tree then wraps a tree in a commit.
```

---
title: Make a commit without git commit
minutes: 12
setup: mkdir byhand && cd byhand && git init -q
---

Here is what `git commit` really does, in five steps. Do them yourself and you will understand Git better than most people who use it every day.

```flow
flowchart LR
  F[file] -- hash-object -w --> B[blob]
  B -- update-index --add --> I[index]
  I -- write-tree --> T[tree]
  T -- commit-tree --> C[commit]
  C -- update-ref --> R[refs/heads/main]
```

## 1. Make a blob

```try
echo "hello" > hello.txt
git hash-object -w hello.txt
git cat-file -t ce013625030ba8dba906f756967f9e9ca394464a
```

## 2. Put it in the index

```try
git update-index --add hello.txt
git status
```

## 3. Turn the index into a tree

```try
git write-tree
```

Copy the id it prints.

## 4. Wrap the tree in a commit

```bash
git commit-tree <tree-id> -m "Made by hand"
```

It prints a **commit** id. If you want a parent, add `-p <parent-id>`.

## 5. Point a branch at it

```bash
git update-ref refs/heads/main <commit-id>
git log --oneline
```

HEAD already says `ref: refs/heads/main`, so `main` now exists and `git log` shows your hand-made commit.

```fact
That is the whole of `git commit`: hash the files, update the index, write the tree, write the commit with the current HEAD as parent, move the branch, and append to the reflog.
```

```quiz
q: Which step gives a commit its parent?
- write-tree
- [x] commit-tree with -p
why: The tree has no history. The commit object records the parent.

q: After commit-tree, why does git log not show the new commit yet?
- It failed
- [x] No ref points at it until you run update-ref
why: An object with no ref pointing to it is not reachable from any branch.
```

```mission
title: Build a Commit by Hand
boss: true
goal: Create `hello.txt` containing `hello` and make a commit with the message `Made by hand` on `main`, using **only plumbing**: hash-object, update-index, write-tree, commit-tree and update-ref.
setup: mkdir byhand && cd byhand && git init -q
check: head main
check: exactcommits 1
check: message Made by hand
check: tracked hello.txt
check: run git cat-file -p HEAD => Made by hand
hint: echo "hello" > hello.txt, then git hash-object -w hello.txt and git update-index --add hello.txt
hint: git write-tree prints a tree id. git commit-tree THAT_ID -m "Made by hand" prints a commit id.
hint: git update-ref refs/heads/main THAT_COMMIT_ID
solve: echo "hello" > hello.txt
solve: git hash-object -w hello.txt
solve: git update-index --add hello.txt
solve: git write-tree
solve: git commit-tree $LAST -m "Made by hand"
solve: git update-ref refs/heads/main $LAST
```

---
title: A branch is a sticky note
minutes: 7
setup: mkdir app && cd app && git init -q && echo "v1" > app.txt && git add . && git commit -q -m "First version" && echo "v2" >> app.txt && git commit -q -am "Second version" && echo "v3" >> app.txt && git commit -q -am "Third version"
---

People imagine a branch as a copy of the whole project. It is not. A branch is much smaller and much simpler:

> **A branch is a name that points at one commit.** That's all.

Think of a sticky note with `main` written on it, stuck on your newest commit. When you make a new commit, Git peels the note off and sticks it on the new one. The note always moves forward with your work.

Look at the graph in the lab. The dark label `main` sits on the newest commit.

```try
git log --oneline
git branch
```

## Making a branch costs nothing

Creating a branch just writes a new sticky note on the same commit. No files are copied.

```try
git branch experiment
git branch
git log --oneline
```

Now two notes, `main` and `experiment`, sit on the **same** commit. The star in `git branch` shows which one you are using.

You can even see that a branch is just a tiny file holding a commit ID:

```try
cat .git/refs/heads/experiment
git rev-parse main
```

Same ID. A branch is 41 bytes on disk. This is why Git users make branches for everything: they are free.

```fact
Older version control systems really did copy every file to make a branch, so people avoided branching. Git made branches cheap, and that changed how the whole industry works.
```

```quiz
q: What is a branch in Git?
- A full copy of the project
- A folder inside .git with your files
- [x] A name that points at a commit
why: It is literally a small file containing one commit ID. That is why branches are so cheap.

q: You make a new commit while on `main`. What happens to the `main` label?
- It stays on the old commit
- [x] It moves to the new commit
- It is deleted
why: The branch you are on always moves forward to the newest commit you make.
```

---
title: Commits are save points
minutes: 6
setup: mkdir game && cd game && git init -q && echo "Level 1: forest" > progress.txt && git add . && git commit -q -m "Reach the forest" && echo "Level 2: cave" >> progress.txt && git commit -q -am "Reach the cave" && echo "Level 3: castle" >> progress.txt && git commit -q -am "Reach the castle"
---

If you have played a video game, you know **save points**. You reach a safe spot, you save. If the next boss destroys you, you go back to the last save instead of starting over.

A Git **commit** is a save point for your project.

```flow
flowchart LR
  A["Reach the forest"] --> B["Reach the cave"] --> C["Reach the castle"]
```

Each commit remembers:

- a **snapshot** of every file at that moment,
- a **message** saying what changed,
- **who** made it and **when**,
- which commit came **before** it (its parent).

That last one is important. Commits are linked in a chain, newest pointing back to older. That chain is your **history**.

## See a real history

The lab already has a small game project with three commits. Look at it:

```try
git log --oneline
cat progress.txt
```

Look at the graph above the terminal too. Three dots, one line. Each dot is a commit. The long string of letters and numbers next to each one (like `a3f9c21`) is its **ID**, also called its **hash**. Every commit in the world has a different one.

## Travel back in time

Let's look at the project as it was at the first save point:

```try
git show HEAD~2:progress.txt
```

`HEAD~2` means "two commits before the one I am on". You just read an old version of a file without changing anything. That is the superpower.

```fact
A commit is not a list of changes. It is a full snapshot of every file. Git is smart enough to store unchanged files only once, so this costs almost no space.
```

```quiz
q: What does a commit store?
- Only the lines you changed
- [x] A snapshot of the project, a message, the author, the time and its parent
- A copy of your whole computer
why: A commit is a full snapshot plus some information about it, linked to the commit before it.

q: What is `a3f9c21`?
- A password
- [x] The short ID (hash) of a commit
- An error code
why: Every commit has a unique ID. Git usually shows the first 7 characters.
```

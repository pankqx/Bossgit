---
title: The three areas
minutes: 8
setup: mkdir recipes && cd recipes && git init -q && echo "Pancakes: flour, eggs, milk" > pancakes.txt && echo "Toast: bread" > toast.txt
---

This is the most important idea in the whole course. Read it slowly.

A file in a Git project can be in **three places**:

| Area | What it is | Think of it as… |
|---|---|---|
| **Working folder** | The files you see and edit | Your desk |
| **Staging area** | The changes you have chosen for the next commit | A box you are packing |
| **Repository** | The commits saved in history | A shelf of sealed boxes |

```flow
flowchart LR
  W["Working folder<br/>(your desk)"] -- "git add" --> S["Staging area<br/>(the box)"]
  S -- "git commit" --> R["Repository<br/>(the shelf)"]
```

You edit on your desk. When something is ready, you put it in the box with `git add`. When the box has everything you want, you seal it with `git commit`. A sealed box is a commit, and it goes on the shelf forever.

## Watch it happen

Under the graph in the lab there are three columns: **Working folder**, **Staging area** and **Repository**. Watch them as you run each line:

```try
git status
git add pancakes.txt
git status
git commit -m "Add pancake recipe"
git status
```

1. At first both files sat in the working folder, untracked.
2. `git add pancakes.txt` moved **only** pancakes into the staging area.
3. `git commit` sealed the box. Pancakes went into history. Toast is still on your desk, untouched.

## Why have a box at all?

Why not just commit everything? Because real work is messy. You might fix a bug **and** start a new feature in the same hour. The staging area lets you put them in **separate commits**, each with a clear message. Your history stays readable, and you can undo one without undoing the other.

```tip
Good commits are small and about one thing. The staging area is the tool that makes that possible.
```

```quiz
q: You changed three files but only want to commit one of them. What do you do?
- Commit all three, then undo two
- [x] `git add` only that one file, then `git commit`
- Delete the other two first
why: Only staged changes go into the commit. That is exactly what the staging area is for.

q: Where does `git commit` take changes from?
- The working folder
- [x] The staging area
- GitHub
why: A commit seals whatever is in the staging area. Unstaged changes stay on your desk.
```

```mission
title: Only the toast
goal: Commit `toast.txt` **without** committing `pancakes.txt`. After your commit, pancakes should still be untracked.
setup: mkdir recipes && cd recipes && git init -q && echo "Pancakes: flour, eggs, milk" > pancakes.txt && echo "Toast: bread" > toast.txt
check: tracked toast.txt
check: nottracked pancakes.txt
check: untracked pancakes.txt
hint: git add toast.txt
hint: git commit -m "Add toast recipe"
```

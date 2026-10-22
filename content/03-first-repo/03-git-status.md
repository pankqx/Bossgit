---
title: Reading git status
minutes: 6
setup: mkdir recipes && cd recipes && git init -q && echo "Pancakes" > pancakes.txt && echo "Toast" > toast.txt && git add . && git commit -q -m "Add recipes" && echo "Soup" > soup.txt && echo "with butter" >> toast.txt && echo "and syrup" >> pancakes.txt && git add pancakes.txt
---

`git status` is the command you will type more than any other. It is free, it changes nothing, and it tells you exactly where you are. Experienced developers run it constantly, before and after almost everything.

```try
git status
```

Let's read it from the top.

**`On branch main`**: which branch you are on. Branches come in module 6.

**`Changes to be committed`** (green): things in the **staging area**. They will go into the next commit. Here, `pancakes.txt` was changed and added.

**`Changes not staged for commit`** (red): files Git already knows, that you changed, but did not add. Here, `toast.txt`.

**`Untracked files`** (red): files Git has never seen. Here, `soup.txt`. Git will ignore them until you `git add` them.

Notice that Git also tells you **what to do next** in brackets: `(use "git add <file>..." to ...)`. When you are lost, read those hints. They are usually exactly right.

## The short version

```try
git status -s
```

Two columns. The left letter is the staging area, the right letter is the working folder. `M` = modified, `A` = added, `??` = untracked. Many developers prefer this once they know it.

```quiz
q: In `git status`, a file is listed under "Changes not staged for commit". What does that mean?
- Git has never seen the file
- [x] Git knows the file and you changed it, but you have not run git add
- The change is already committed
why: Not staged means it is on your desk but not in the box. Untracked would mean Git has never seen it.

q: `git status -s` shows `?? soup.txt`. What is soup.txt?
- Deleted
- Staged
- [x] Untracked
why: Two question marks mean Git does not track the file yet.
```

```mission
title: Stage it all
goal: Get every change, including the new soup recipe, into one commit. When you are done, `git status` should say there is nothing to commit.
setup: mkdir recipes && cd recipes && git init -q && echo "Pancakes" > pancakes.txt && echo "Toast" > toast.txt && git add . && git commit -q -m "Add recipes" && echo "Soup" > soup.txt && echo "with butter" >> toast.txt && echo "and syrup" >> pancakes.txt && git add pancakes.txt
check: clean
check: tracked soup.txt
check: commits 2
hint: git add . stages everything in this folder
hint: Then commit with a message
```

---
title: HEAD means "you are here"
minutes: 6
setup: mkdir app && cd app && git init -q && echo "v1" > app.txt && git add . && git commit -q -m "First version" && echo "v2" >> app.txt && git commit -q -am "Second version" && git branch idea
---

If branches are sticky notes, how does Git know which one you are using? With one more special note called **HEAD**.

> **HEAD points at the branch you are on.** It is the "you are here" dot on the map.

In the graph, the branch HEAD points at is drawn in **red with a dot**. In `git log` you see it written as `HEAD -> main`.

```try
git log --oneline
cat .git/HEAD
```

`.git/HEAD` contains `ref: refs/heads/main`. In plain words: *"you are on main"*.

## Moving HEAD

`git switch` moves HEAD to another branch:

```try
git switch idea
cat .git/HEAD
git log --oneline
```

Now HEAD points at `idea`. Both branches are on the same commit, so your files did not change. But your next commit will move `idea`, not `main`:

```try
echo "a new idea" > idea.txt
git add . && git commit -m "Try an idea"
git log --oneline --all
```

Look at the graph: `idea` moved forward, `main` stayed behind. You just made your first fork in history.

```flow
flowchart LR
  A((1)) --> B((2))
  B --> C(("3 · idea ← HEAD"))
  M["main"] -.-> B
```

```quiz
q: What does HEAD point at, normally?
- The newest commit in the whole repository
- [x] The branch you are currently on
- GitHub
why: HEAD points at your current branch, and the branch points at a commit.

q: You are on `idea` and make a commit. Which label moves?
- main
- [x] idea
- Both
why: Only the branch HEAD points at moves forward.
```

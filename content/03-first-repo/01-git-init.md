---
title: git init makes a repository
minutes: 5
setup: mkdir recipes && cd recipes && echo "Pancakes: flour, eggs, milk" > pancakes.txt
---

A **repository** (or **repo**) is a project folder that Git is watching. Any folder can become one. In the lab you are inside a folder called `recipes` with one file in it. Right now Git knows nothing about it:

```try
ls -a
git status
```

`fatal: not a git repository`. Fair enough. Let's make it one:

```try
git init
ls -a
```

That's all. `git init` created a hidden folder called **`.git`**. Your project files did not change at all.

## The .git folder is the repository

Everything Git knows lives inside `.git`: every commit, every branch, the whole history. Your files outside it are just the version you are working on right now.

```try
tree .git
```

Don't worry about what all of that means yet. By module 19 you will understand every file in there. For now, two rules:

1. **Never edit files inside `.git` by hand.**
2. **If you delete `.git`, the history is gone.** Your current files stay, but every save point disappears.

```try
git status
```

Now Git answers. It says you are on branch `main`, there are no commits yet, and `pancakes.txt` is *untracked*. We'll deal with that in the next lessons.

```fact
`git init` only needs to be run once per project. Run it again and Git simply says "Reinitialized existing Git repository". It does not delete anything.
```

```quiz
q: What does `git init` do to your existing files?
- Deletes them
- Uploads them to GitHub
- [x] Nothing. It only adds a hidden `.git` folder
why: Your files are untouched. The new `.git` folder is where the history will be stored.

q: Where is your project's history stored?
- [x] In the `.git` folder inside the project
- On GitHub
- In a hidden folder on your desktop
why: Git is local. The `.git` folder is the repository.
```

```mission
title: Start a repository
goal: Make a new folder called `diary` in your home folder, and turn it into a Git repository.
check: dir ~/diary
check: dir ~/diary/.git
hint: cd ~ && mkdir diary
hint: cd diary && git init
```

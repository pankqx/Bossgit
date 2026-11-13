---
title: "git show: one commit up close"
minutes: 7
setup: mkdir cafe && cd cafe && git init -q && echo "Soup of the day: tomato" > menu.txt && git add . && git commit -q -m "First menu" && echo "Soup of the day: lentil" > menu.txt && git commit -q -am "Change the soup"
---

`git log` gives you the list. `git show` opens **one** commit and shows exactly what it changed.

```try
git show
git show HEAD~1
```

With no name, `git show` opens `HEAD`, the commit you are on. You can give it any name: a short id, a branch, a tag, or `HEAD~1` (one before HEAD), `HEAD~2`, and so on.

## Read a file from the past

This is one of the most useful tricks in Git. Put a colon and a file name after the commit:

```try
git show HEAD~1:menu.txt
cat menu.txt
```

The first line prints `menu.txt` **as it was** one commit ago. Your current file does not change. You can even save the old version to a new file:

```try
git show HEAD~1:menu.txt > old-menu.txt
cat old-menu.txt
```

```tip
`git show` on a tag shows the tag message too. `git show --stat HEAD` in a real terminal lists only the file names and how many lines changed.
```

```fact
`HEAD~1` means "the first parent of HEAD". `HEAD^` means the same thing. A merge commit has two parents: `HEAD^2` is the second one.
```

```quiz
q: What does git show HEAD~2:README.md print?
- The difference between HEAD and HEAD~2
- [x] The README.md file as it was two commits ago
- The commit message of HEAD~2
why: REV:PATH reads a file from a commit without touching your folder.

q: Does git show HEAD~1:menu.txt change menu.txt in your folder?
- Yes, it restores the old version
- [x] No, it only prints it
why: show only reads. To actually bring a file back you use git restore (next module).
```

```mission
title: Keep the old recipe
goal: The soup changed from tomato to lentil. Make a new file called `tomato.txt` that holds the **old** version of `menu.txt`, and leave `menu.txt` as it is now.
setup: mkdir cafe && cd cafe && git init -q && echo "Soup of the day: tomato" > menu.txt && git add . && git commit -q -m "First menu" && echo "Soup of the day: lentil" > menu.txt && git commit -q -am "Change the soup"
check: contains tomato.txt tomato
check: contains menu.txt lentil
hint: git show HEAD~1:menu.txt prints the old file.
hint: Add > tomato.txt at the end to save it.
solve: git show HEAD~1:menu.txt > tomato.txt
```

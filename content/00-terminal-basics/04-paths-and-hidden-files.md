---
title: Paths and hidden files
minutes: 8
setup: mkdir -p projects/website/images && echo "<h1>Hi</h1>" > projects/website/index.html && echo "secret" > projects/website/.env
---

A **path** is the address of a file. `/home/learner/projects/website/index.html` is a path. Each `/` is one step into a folder.

There are two kinds:

- An **absolute path** starts with `/`. It works from anywhere, like a full street address.
- A **relative path** starts from where you are now, like "two doors down". `projects/website` only works if you are in your home folder.

Special shortcuts:

| Shortcut | Means |
|---|---|
| `~` | your home folder |
| `.` | this folder |
| `..` | the folder above |

```try
cat projects/website/index.html
cd projects/website
cat ./index.html
cat ~/projects/website/index.html
```

All three `cat` commands opened the same file, using different paths.

## Hidden files

Any file whose name starts with a dot is **hidden**. `ls` does not show it. `ls -a` shows **a**ll files:

```try
ls
ls -a
```

There it is: `.env`. Hidden files usually hold settings. And here is why this matters for you: when you start using Git, it keeps your entire history in a hidden folder called **`.git`**. You will see it in the very next module.

```try
tree -a ~/projects
```

```fact
Unix hid dot-files by accident. In the 1970s, `ls` skipped `.` and `..` with a shortcut that skipped every name starting with a dot. People liked it, and the accident became a feature.
```

```quiz
q: Which path works no matter which folder you are in?
- website/index.html
- ../index.html
- [x] ~/projects/website/index.html
why: `~` always means your home folder, so the path works from anywhere. The others depend on where you are.

q: How do you see hidden files?
- ls --secret
- [x] ls -a
- cat -h
why: `-a` means all, including names that start with a dot.
```

```mission
title: The Lost Path Maze
boss: true
goal: Someone hid a file named `.key` deep inside the `maze` folder. Find it, then create a file called `found.txt` in your **home folder** containing the word that is written inside `.key`.
setup: mkdir -p maze/left/dead-end maze/right/door/stairs && echo "nothing here" > maze/left/dead-end/note.txt && echo "treasure" > maze/right/door/stairs/.key
check: file ~/found.txt
check: contains ~/found.txt treasure
hint: ls -a shows hidden files. Try tree -a maze
hint: cat maze/right/door/stairs/.key
hint: echo "treasure" > ~/found.txt
```

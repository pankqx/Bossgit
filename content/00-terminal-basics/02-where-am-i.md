---
title: Where am I? pwd, ls and cd
minutes: 7
setup: mkdir -p projects/website && mkdir photos && echo "buy milk" > todo.txt && echo "<h1>Hello</h1>" > projects/website/index.html && echo "beach" > photos/summer.txt
---

When you open a folder window, you can see where you are and what is inside. In a terminal you ask with three commands. Learn these three and you can go anywhere.

| Command | Says | Like clicking… |
|---|---|---|
| `pwd` | **p**rint **w**orking **d**irectory: where am I? | looking at the address bar |
| `ls` | **l**i**s**t: what is in here? | looking inside the folder |
| `cd name` | **c**hange **d**irectory: go into a folder | double-clicking a folder |

*Directory* is just the old word for *folder*. They mean the same thing.

## Look around

```try
pwd
ls
```

`pwd` says `/home/learner`. That is your home folder. `ls` shows what is inside it: two folders (in blue, ending with `/`) and one file.

## Move around

```try
cd projects
pwd
ls
cd website
ls
```

Each `cd` takes you one step deeper. Now go back up. Two dots, `..`, always mean **the folder above this one**:

```try
cd ..
pwd
cd ~
pwd
```

`cd ~` (or just `cd` on its own) always takes you home, from anywhere.

```fact
The prompt changes as you move. It always shows where you are, so you rarely need `pwd`. Developers still type it out of habit when they feel lost.
```

```quiz
q: You are in `/home/learner/projects/website`. What does `cd ..` do?
- Goes to `/home/learner`
- [x] Goes to `/home/learner/projects`
- Deletes the folder
why: `..` means one folder up. Two `cd ..` would take you to `/home/learner`.

q: Which command shows what is inside the current folder?
- pwd
- [x] ls
- cd
why: `ls` lists the contents. `pwd` only tells you where you are.
```

```mission
title: Find the photo
goal: There is a file called `summer.txt` hidden in a folder somewhere in your home folder. Go into the folder that contains it, then check.
setup: mkdir -p projects/website && mkdir photos && echo "buy milk" > todo.txt && echo "beach" > photos/summer.txt
check: cwd photos
hint: Use ls to see the folders in your home folder.
hint: cd photos
```

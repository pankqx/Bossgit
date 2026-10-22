---
title: Making folders and files
minutes: 7
---

Now let's make things. Four new commands:

| Command | What it does |
|---|---|
| `mkdir name` | **m**a**k**e a **dir**ectory (a folder) |
| `touch name` | make an empty file |
| `echo "text" > file` | write text into a file (replaces what was there) |
| `cat file` | show what is inside a file |

## Make a project folder

```try
mkdir shop
cd shop
touch notes.txt
ls
```

`touch` made an empty file. Let's put words in it with `echo`. The `>` arrow means "send the text into this file instead of the screen".

```try
echo "Sell apples" > notes.txt
cat notes.txt
```

## Add, don't replace

One arrow `>` **replaces** the whole file. Two arrows `>>` **add** a new line at the end:

```try
echo "Sell pears" >> notes.txt
cat notes.txt
echo "Only bananas" > notes.txt
cat notes.txt
```

See how the last command wiped the apples and pears? That is the most common terminal accident. Now imagine that file was your homework, with no backup. This is exactly the problem Git solves, and you'll meet it in the next module.

```warn
`>` replaces the whole file without asking. Use `>>` when you want to add a line.
```

```tip
BossGit has no text editor inside the terminal, so lessons use `echo` to change files. On your own computer you will use an editor like VS Code. The Git commands are exactly the same.
```

```quiz
q: The file `list.txt` contains "eggs". You run `echo "milk" >> list.txt`. What is in the file now?
- Only "milk"
- [x] "eggs" and then "milk" on the next line
- Nothing, the command fails
why: `>>` adds to the end. `>` would have replaced "eggs".
```

```mission
title: Set up a shop
goal: In your home folder, make a folder called `shop`. Inside it, make a file called `prices.txt` that contains the word `apples`.

check: dir ~/shop
check: file ~/shop/prices.txt
check: contains ~/shop/prices.txt apples
hint: mkdir shop, then cd shop
hint: echo "apples 2 coins" > prices.txt
```

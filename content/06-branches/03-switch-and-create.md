---
title: Creating and switching branches
minutes: 8
setup: mkdir shop && cd shop && git init -q && echo "Welcome to the shop" > index.html && git add . && git commit -q -m "Open the shop"
---

Here is the everyday branch workflow. You want to build something new without risking the working version on `main`.

```try
git switch -c dark-mode
```

`-c` means **create**. This one command makes a new branch and switches to it. Now build the feature, with as many commits as you like:

```try
echo "body { background: black }" > style.css
git add . && git commit -m "Add dark colours"
echo "button { color: white }" >> style.css
git commit -am "Make buttons readable"
ls
```

## Your files change when you switch

Go back to `main` and look at the folder:

```try
git switch main
ls
```

`style.css` is **gone**. Don't panic. It is safe in the `dark-mode` branch. When you switch, Git changes the files in your folder to match the commit the branch points at.

```try
git switch dark-mode
ls
```

Back again. This is the magic of branches: one folder, many versions, and you can jump between them in a second.

## Switch needs a clean desk

If you have changes that are not committed and they would be overwritten by the switch, Git stops you to protect your work:

```try
echo "half-done" >> index.html
git switch main
```

Here Git let you switch, because `index.html` is the same on both branches, so nothing would be lost. Your unfinished change came with you. When the file is different on the other branch, Git refuses and asks you to commit or **stash** first (module 9).

```tip
`git switch -` jumps back to the branch you were on before, like the back button in a browser.
```

```quiz
q: What does `git switch -c login` do?
- Switches to an existing branch called login
- [x] Creates a branch called login and switches to it
- Deletes the branch login
why: -c means create. Without it, the branch must already exist.

q: You switch to `main` and a file you made on another branch disappears. Why?
- It was deleted forever
- [x] The file only exists in the other branch's commits; Git shows the files of the branch you are on
- Git has a bug
why: Switching changes your folder to match the branch. Switch back and the file returns.
```

```mission
title: A safe place to experiment
goal: Create a branch called `prices`, switch to it, and commit a new file called `prices.txt`. Then switch back to `main`. The `main` branch must **not** contain `prices.txt`.
setup: mkdir shop && cd shop && git init -q && echo "Welcome" > index.html && git add . && git commit -q -m "Open the shop"
check: branch prices
check: head main
check: nofile prices.txt
check: branchhas prices prices.txt
check: nottracked prices.txt
hint: git switch -c prices
hint: echo "apples: 2" > prices.txt, then add and commit
hint: git switch main
```

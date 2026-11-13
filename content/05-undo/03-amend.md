---
title: Fix the last commit with --amend
minutes: 7
setup: mkdir shop && cd shop && git init -q && echo "shop" > README.md && git add . && git commit -q -m "Start the shop"
---

You just committed and noticed a typo in the message. Or you forgot one file. You do not need a second "oops" commit. You can **replace** the last commit.

## Fix the message

```try
echo "apples" > fruit.txt
git add . && git commit -m "Add frut list"
git commit --amend -m "Add fruit list"
git log --oneline
```

## Add a forgotten file

```try
echo "bananas" > more-fruit.txt
git add more-fruit.txt
git commit --amend --no-edit
git show --stat
```

`--no-edit` keeps the message. The commit now has both files.

## What really happens

`--amend` does not edit the old commit. Commits can never change. Git makes a **brand new commit** with a new id and moves the branch to it. The old one is left behind (and is still in the reflog for a while).

```flow
flowchart LR
  A[Start] --> B["Add frut list (old)"]
  A --> C["Add fruit list (new)"]
  M((main)) -.-> C
```

```warn
Only amend commits you have **not pushed** yet. If teammates already have the old commit, amending gives you a different history from theirs, and your next push is rejected. If you really must, push with `git push --force-with-lease` and tell the team.
```

```tip
Also handy: `git commit --amend --author="Name <email>"` fixes the author, and `git commit --amend --reset-author` uses your current config.
```

```quiz
q: Does git commit --amend keep the same commit id?
- Yes
- [x] No, it makes a new commit with a new id
why: Any change to a commit's content, message or parent gives a new id.

q: When is amending dangerous?
- When the commit has a long message
- [x] When the commit was already pushed and others may have it
- When you use --no-edit
why: Rewriting shared history makes your branch and theirs disagree.
```

```mission
title: The forgotten file
goal: The last commit added `index.html` but forgot `style.css`, and its message has a typo. Fix the **same** commit: include `style.css` and change the message to `Add home page`. There must still be exactly 2 commits.
setup: mkdir site && cd site && git init -q && echo "site" > README.md && git add . && git commit -q -m "Start" && echo "<h1>Hi</h1>" > index.html && echo "h1 {}" > style.css && git add index.html && git commit -q -m "Add hom page"
check: exactcommits 2
check: tracked style.css
check: tracked index.html
check: message Add home page
check: clean
hint: git add style.css
hint: git commit --amend -m "Add home page"
solve: git add style.css
solve: git commit --amend -m "Add home page"
```

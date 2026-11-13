---
title: "Interactive rebase: squash, fixup, reword, drop"
minutes: 12
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start" && echo "form" > login.html && git add . && git commit -q -m "Add login form" && echo "typo fix" >> login.html && git commit -q -am "fix typo" && echo "console.log(1)" > debug.js && git add . && git commit -q -m "debug stuff" && echo "button" >> login.html && git commit -q -am "Add login buton"
---

Before you open a pull request, you clean up your commits so reviewers read a clear story, not "fix typo", "fix typo again", "wip". The tool for this is **interactive rebase**.

```try
git log --oneline
```

## Open the plan

In a real terminal you run:

```bash
git rebase -i HEAD~4      # edit the last 4 commits
git rebase -i main        # edit every commit since you branched from main
```

Git opens your editor with a **todo list**, oldest commit first:

```
pick a1b2c3d Add login form
pick d4e5f6a fix typo
pick 7a8b9c0 debug stuff
pick 1d2e3f4 Add login buton
```

You change the word at the start of each line, save and close. Git does the rest.

| Word | Short | What it does |
|---|---|---|
| `pick` | `p` | Keep the commit as it is |
| `reword` | `r` | Keep it, but edit the message |
| `edit` | `e` | Stop at this commit so you can change it (or split it) |
| `squash` | `s` | Melt into the commit above, and combine both messages |
| `fixup` | `f` | Melt into the commit above, and **throw away** this message |
| `drop` | `d` | Delete the commit |
| (move a line) | | Reorder commits |

For our history the clean plan is:

```
pick a1b2c3d Add login form
fixup d4e5f6a fix typo
drop 7a8b9c0 debug stuff
reword 1d2e3f4 Add login buton
```

Result: two clean commits, "Add login form" and "Add login button".

## The pro trick: fixup commits

When you notice a small mistake in an older commit, commit the fix like this:

```bash
git commit --fixup=a1b2c3d          # makes a commit called "fixup! Add login form"
git rebase -i --autosquash main     # Git puts it in the right place and marks it fixup
git config --global rebase.autoSquash true   # do it every time
```

```warn
BossGit's terminal has no text editor, so `git rebase -i` does not run here. You can get the same result with `git reset --soft` (problem 24), `git commit --amend` and `git revert`. Practise `rebase -i` in a real terminal, on a throwaway branch.
```

```tip
Set a friendly editor first: `git config --global core.editor "code --wait"` for VS Code, or `"nano"`.
```

```quiz
q: Which word melts a commit into the one above and throws away its message?
- squash
- [x] fixup
- drop
why: squash keeps both messages for you to combine. fixup keeps only the first.

q: In the todo list, which commit is at the top?
- [x] The oldest one
- The newest one
- HEAD
why: The list is in the order the commits will be replayed, oldest first. This is the opposite of git log.
```

```mission
title: Clean before review
goal: Without interactive rebase, turn the last **three** commits into **one** commit with the message `Add login page`, so the branch has exactly 2 commits. Remove `debug.js` too.
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start" && echo "form" > login.html && git add . && git commit -q -m "Add login form" && echo "console.log(1)" > debug.js && git add . && git commit -q -m "debug stuff" && echo "button" >> login.html && git commit -q -am "Add login buton"
check: exactcommits 2
check: message Add login page
check: nottracked debug.js
check: contains login.html button
check: clean
hint: git reset --soft HEAD~3 keeps all three changes staged.
hint: git rm debug.js removes it from the staging area and your folder.
hint: Then git commit -m "Add login page"
solve: git reset --soft HEAD~3
solve: git rm debug.js
solve: git commit -m "Add login page"
```

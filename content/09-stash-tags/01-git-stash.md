---
title: "git stash: put work aside"
minutes: 9
setup: mkdir app && cd app && git init -q && echo "v1" > app.js && echo "home" > home.html && git add . && git commit -q -m "Start" && git branch hotfix
---

You are halfway through a feature. Your manager says: "Production is down, fix it **now**." Your changes are not ready to commit. Stash them.

```try
echo "half-done feature" >> app.js
git status
git stash
git status
```

Your folder is clean again. The changes are saved in a special stack. Now you can switch branches, fix the bug, and come back.

```try
git stash list
git stash pop
git status
```

`pop` brings the newest stash back and removes it from the list.

## The full set

| Command | What it does |
|---|---|
| `git stash` or `git stash push -m "msg"` | Save changes with a name |
| `git stash -u` | Also stash **untracked** files (new files are skipped by default!) |
| `git stash list` | Show all stashes: `stash@{0}` is the newest |
| `git stash show -p stash@{1}` | See what is inside one |
| `git stash pop` | Re-apply the newest and remove it |
| `git stash apply stash@{1}` | Re-apply but **keep** it in the list |
| `git stash drop stash@{1}` | Delete one |
| `git stash clear` | Delete all of them |

```bash
git stash push -m "only styles" -- style.css   # stash just one file
git stash branch new-idea stash@{0}            # turn a stash into a branch
git stash --staged                             # stash only what is staged (Git 2.35+)
```

```warn
New files are **not** stashed unless you add `-u`. Many people lose new files because of this. Also, stashes are local only. They never get pushed.
```

```tip
Stash is for minutes or hours, not weeks. If you will be away from the work for long, commit it on a branch ("wip: …") instead. A commit is safer and easier to find.
```

```quiz
q: You made a new file notes.txt and ran git stash. Where is notes.txt?
- In the stash
- [x] Still in your folder, because untracked files are not stashed by default
- Deleted
why: Use git stash -u to include untracked files.

q: What is the difference between pop and apply?
- pop works on any stash, apply only on the newest
- [x] pop removes the stash after applying, apply keeps it
why: apply is handy when you want the same changes on several branches.
```

```mission
title: Hold that thought
goal: You have unfinished changes in `app.js` **and** a new file `idea.txt`. Stash **both**, so your folder is clean and the stash has 1 entry.
setup: mkdir app && cd app && git init -q && echo "v1" > app.js && git add . && git commit -q -m "Start" && echo "unfinished" >> app.js && echo "idea" > idea.txt
check: clean
check: stash 1
check: nofile idea.txt
hint: A plain git stash skips new files.
hint: git stash -u
solve: git stash -u
```

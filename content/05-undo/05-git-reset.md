---
title: "git reset: soft, mixed and hard"
minutes: 11
setup: mkdir notes && cd notes && git init -q && echo "one" > n.txt && git add . && git commit -q -m "One" && echo "two" >> n.txt && git commit -q -am "Two" && echo "three" >> n.txt && git commit -q -am "Three"
---

`git reset` moves your **branch** to another commit. The three modes decide what happens to the staging area and your files.

```flow
flowchart LR
  subgraph "--soft"
    s1[Branch moves] --> s2[Staging kept] --> s3[Files kept]
  end
  subgraph "--mixed (default)"
    m1[Branch moves] --> m2[Staging reset] --> m3[Files kept]
  end
  subgraph "--hard"
    h1[Branch moves] --> h2[Staging reset] --> h3[Files reset]
  end
```

## --soft: undo the commit, keep everything staged

```try
git reset --soft HEAD~1
git status
git log --oneline
```

The "Three" commit is gone from the branch, but its change is **staged**, ready to commit again. Perfect for "I want to redo that commit message" or "squash my last 3 commits into one".

```try
git commit -m "Three, said better"
```

## --mixed: undo the commit, keep the changes unstaged

```try
git reset HEAD~1
git status
```

`--mixed` is the default, so you do not need to type it. The change is back in your working folder, not staged. Good for "I committed too much, let me split it".

## --hard: throw everything away

```try
git reset --hard HEAD~1
git status
cat n.txt
```

The commit **and** the changes are gone. Your folder matches the older commit exactly.

```warn
`--hard` deletes uncommitted work with no way back. Committed work can still be found with `git reflog` for about 90 days (module 17). Never use `reset` on commits you have already pushed to a shared branch.
```

| Mode | Branch | Staging area | Your files |
|---|---|---|---|
| `--soft` | moves | kept | kept |
| `--mixed` | moves | reset | kept |
| `--hard` | moves | reset | **reset** |

```fact
`git reset FILE` (with a file, no mode) is a different job: it only unstages that file. That is why modern Git added `git restore --staged`, which is clearer.
```

```quiz
q: You want to combine your last 3 local commits into one. Which is the simplest way?
- git reset --hard HEAD~3 then commit
- [x] git reset --soft HEAD~3 then commit
- git revert HEAD~3
why: --soft keeps all three changes staged, so one commit holds them all. --hard would delete them.

q: Which mode can destroy uncommitted work?
- --soft
- --mixed
- [x] --hard
why: Only --hard overwrites the files in your folder.
```

```mission
title: Squash before you push
goal: You made 3 tiny local commits that should be **one**. Turn them into a single commit with the message `Add the login page`, so the branch has exactly 2 commits and `login.html` has all three lines.
setup: mkdir site && cd site && git init -q && echo "site" > README.md && git add . && git commit -q -m "Start" && echo "<form>" > login.html && git add . && git commit -q -m "wip" && echo "<input>" >> login.html && git commit -q -am "wip 2" && echo "</form>" >> login.html && git commit -q -am "wip 3"
check: exactcommits 2
check: message Add the login page
check: contains login.html <input>
check: contains login.html </form>
check: clean
hint: git reset --soft HEAD~3 keeps the changes staged.
hint: Then git commit -m "Add the login page"
solve: git reset --soft HEAD~3
solve: git commit -m "Add the login page"
```

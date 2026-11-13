---
title: Which undo do I need?
minutes: 8
setup: mkdir app && cd app && git init -q && echo "ok" > app.js && git add . && git commit -q -m "Start"
---

You now know five ways to undo. Picking the right one is the real skill. Ask two questions: **where is the mistake?** and **has anyone else got it?**

```flow
flowchart TD
  Q1{Where is the mistake?} -->|Edited a file, not staged| R1[git restore FILE]
  Q1 -->|Staged by accident| R2[git restore --staged FILE]
  Q1 -->|In the last commit| Q2{Pushed already?}
  Q1 -->|In an older commit| Q3{Pushed already?}
  Q2 -->|No| R3[git commit --amend]
  Q2 -->|Yes| R4[git revert HEAD]
  Q3 -->|No| R5[git reset or interactive rebase]
  Q3 -->|Yes| R6[git revert ID]
```

## The table to remember

| Situation | Command | Safe after push? |
|---|---|---|
| Throw away an edit | `git restore file` | n/a |
| Unstage a file | `git restore --staged file` | n/a |
| Fix the last commit | `git commit --amend` | no |
| Remove local commits | `git reset --soft/--mixed/--hard` | no |
| Undo a pushed commit | `git revert id` | **yes** |
| "I lost everything!" | `git reflog` | yes |

```story
A junior developer ran git reset --hard on main, then git push --force. Two teammates' work disappeared from GitHub. A senior dev recovered it from their own laptop's reflog in ten minutes, then turned on branch protection so nobody could force-push to main again. The lesson the team wrote down: on shared branches, revert, never reset.
```

```quiz
q: You pushed a commit with a bug to main yesterday. What do you use?
- git commit --amend
- git reset --hard HEAD~1
- [x] git revert with the commit id
why: It is shared, so you must add an undo commit, not rewrite history.

q: You staged a file by accident. Nothing is committed. What do you use?
- git revert
- [x] git restore --staged
- git reset --hard
why: Nothing is committed, so you only need to take it out of the staging area.
```

```mission
title: The Wrong Commit
boss: true
goal: Three problems at once. 1) The last commit `Add debug logs` was never pushed: **remove it** from history but keep `app.js` as it was before it. 2) `notes.txt` has an unwanted edit: **throw it away**. 3) `draft.txt` is staged: **unstage** it and keep the file.
setup: mkdir app && cd app && git init -q && echo "run()" > app.js && echo "notes" > notes.txt && git add . && git commit -q -m "Start" && echo "console.log('debug')" >> app.js && git commit -q -am "Add debug logs" && echo "junk" >> notes.txt && echo "idea" > draft.txt && git add draft.txt
check: exactcommits 1
check: lacks app.js debug
check: lacks notes.txt junk
check: untracked draft.txt
hint: Unstage first, so --hard does not touch draft.txt: git restore --staged draft.txt
hint: git reset --hard HEAD~1 removes the commit and the notes.txt edit together. Untracked files are left alone.
solve: git restore --staged draft.txt
solve: git reset --hard HEAD~1
```

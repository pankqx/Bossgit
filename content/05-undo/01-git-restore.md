---
title: "git restore: throw away a change"
minutes: 7
setup: mkdir essay && cd essay && git init -q && echo "My summer was great." > essay.txt && git add . && git commit -q -m "First draft"
---

You edited a file and made it worse. You want it back exactly as it was in the last commit.

```try
echo "asdfghjkl my cat walked on the keyboard" > essay.txt
cat essay.txt
git restore essay.txt
cat essay.txt
```

`git restore FILE` replaces the file in your working folder with the version from the staging area (which, if you did not stage anything, is the last commit).

```warn
This is one of the few Git commands that **destroys work**. The change you threw away was never committed, so Git has no copy of it. There is no undo. Read `git diff FILE` first.
```

## Restore from any commit

```try
echo "My summer was amazing." > essay.txt
git commit -qam "Better word"
git restore --source=HEAD~1 essay.txt
cat essay.txt
git status
```

`--source` takes the file from an older commit. The file now shows as modified, so you can commit "go back to the old wording" as a normal change.

```bash
git restore .                  # throw away ALL unstaged changes (careful!)
git restore -p essay.txt       # pick which pieces to throw away, one by one
```

```fact
Before Git 2.23 (2019) people used `git checkout -- file` for this. It still works, and you will see it in old answers online. `git restore` and `git switch` were added to split `checkout`'s two jobs into clear commands.
```

```quiz
q: You run git restore notes.txt on a file you never committed changes to. Can you get your edits back?
- Yes, with git reflog
- [x] No, uncommitted edits are gone
- Yes, with git restore --undo
why: Git only keeps what was committed or staged. restore overwrote the only copy.

q: How do you bring back app.js as it was two commits ago?
- git restore app.js HEAD~2
- [x] git restore --source=HEAD~2 app.js
- git reset HEAD~2
why: --source picks the commit, then you name the file.
```

```mission
title: Bad edit
goal: `config.txt` was broken by an edit that was never committed. Bring it back to the committed version. `todo.txt` also has an edit, and you must **keep** that one.
setup: mkdir app && cd app && git init -q && echo "port=8080" > config.txt && echo "buy milk" > todo.txt && git add . && git commit -q -m "Start" && echo "port=oops" > config.txt && echo "call mum" >> todo.txt
check: contains config.txt port=8080
check: contains todo.txt call mum
check: modified todo.txt
hint: git restore takes a file name. Only name the broken one.
solve: git restore config.txt
```

---
title: git merge --abort
minutes: 5
setup: mkdir band && cd band && git init -q && echo "Song: Blue Sky" > setlist.txt && git add . && git commit -q -m "First song" && git switch -q -c anna && echo "Song: Red Sun" > setlist.txt && git commit -q -am "Anna picks Red Sun" && git switch -q main && echo "Song: Green Sea" > setlist.txt && git commit -q -am "Main picks Green Sea"
---

Sometimes you start a merge, see 40 conflicts, and realise this is not the moment. Maybe you merged the wrong branch. Maybe you need to ask the other developer first. You can **cancel** the merge completely.

```try
git merge anna
git status
git merge --abort
git status
cat setlist.txt
```

Everything is back to how it was **before** `git merge`. No markers, no half-merged files.

```tip
The same escape hatch exists for every paused operation: `git rebase --abort`, `git cherry-pick --abort`, `git revert --abort`. When you feel lost in the middle of something, abort, breathe, and start again.
```

```warn
`--abort` throws away any conflict fixes you already made in this merge. If you were halfway done with a hard merge, that work is lost.
```

```fact
If you already finished the merge and regret it, `--abort` is too late. If it is not pushed, `git reset --hard HEAD~1` removes the merge commit. If it is pushed, use `git revert -m 1 <merge-id>`.
```

```quiz
q: After git merge --abort, what does your folder look like?
- It keeps the conflict markers
- [x] Exactly like before the merge started
- It has their version of every file
why: Abort restores the state from before the merge.

q: You are in the middle of a rebase and want out. What do you run?
- git merge --abort
- [x] git rebase --abort
- git reset --soft
why: Each operation has its own --abort.
```

```mission
title: Not now
goal: A merge of `redesign` is in the middle of a conflict. It is the wrong time. **Cancel the merge** so `main` is exactly as it was.
setup: mkdir site && cd site && git init -q && echo "blue" > theme.txt && git add . && git commit -q -m "Theme" && git switch -q -c redesign && echo "purple" > theme.txt && git commit -q -am "Purple" && git switch -q main && echo "green" > theme.txt && git commit -q -am "Green" && git merge redesign
check: nooperation
check: contains theme.txt green
check: lacks theme.txt <<<<<<<
check: exactcommits 2
check: clean
hint: Every paused operation has an --abort.
solve: git merge --abort
```

---
title: git bisect by hand
minutes: 11
setup: mkdir calc && cd calc && git init -q && echo "add=ok" > math.txt && git add . && git commit -q -m "Add addition" && echo "sub=ok" >> math.txt && git commit -q -am "Add subtraction" && echo "mul=ok" >> math.txt && git commit -q -am "Add multiplication" && echo "add=BROKEN" > math.txt && echo "sub=ok" >> math.txt && echo "mul=ok" >> math.txt && git commit -q -am "Refactor math" && echo "div=ok" >> math.txt && git commit -q -am "Add division" && echo "pow=ok" >> math.txt && git commit -q -am "Add power" && echo "mod=ok" >> math.txt && git commit -q -am "Add modulo"
---

Addition worked last month. Today it is broken. There are 7 commits in between, or in real life, 700. Which one broke it? Reading them all would take a day. **git bisect** finds it with a **binary search**: each step halves the suspects.

```flow
flowchart LR
  G[good: old commit] --- M1{test the middle} --- B[bad: today]
  M1 -->|bad| L[search the left half]
  M1 -->|good| R[search the right half]
```

700 commits need at most **10** tests. 1,000,000 commits need 20.

## The routine

```try
git log --oneline
cat math.txt
git bisect start
git bisect bad
git bisect good HEAD~6
```

Git jumps to a commit in the middle (HEAD is detached). **Test it.** Here the test is reading the file:

```try
cat math.txt
```

If you see `add=BROKEN`, type `git bisect bad`. If `add=ok`, type `git bisect good`. Repeat until Git prints:

```
a1b2c3d... is the first bad commit
```

Then **always** finish with:

```bash
git bisect reset          # back to the branch you started on
```

## Tips from experience

- Pick a **good** commit you are sure about: a release tag works well (`git bisect good v2.3.0`).
- If a commit cannot be tested (it does not build), run `git bisect skip`.
- `git bisect log` prints your answers, so you can replay them.
- New words are allowed: `git bisect start --term-old=fast --term-new=slow` when you are hunting a slowdown, not a bug.

```fact
Bisect works best on a history of small commits that each build and pass tests. That is one more reason seniors insist on atomic commits (module 28).
```

```quiz
q: How many tests does bisect need, at most, for about 1,000 commits?
- 1,000
- 100
- [x] About 10
why: Each test halves the range: 2 to the power 10 is 1,024.

q: What must you do when bisect is finished?
- git reset --hard
- [x] git bisect reset
why: It ends the search and puts you back on your branch.
```

```mission
title: Find the breaker
goal: Use `git bisect` to find the commit that changed `add=ok` into `add=BROKEN`. Put a tag called `culprit` on it, then end the bisect so you are back on `main`.
setup: mkdir calc && cd calc && git init -q && echo "add=ok" > math.txt && git add . && git commit -q -m "Add addition" && echo "sub=ok" >> math.txt && git commit -q -am "Add subtraction" && echo "mul=ok" >> math.txt && git commit -q -am "Add multiplication" && echo "add=BROKEN" > math.txt && echo "sub=ok" >> math.txt && echo "mul=ok" >> math.txt && git commit -q -am "Refactor math" && echo "div=ok" >> math.txt && git commit -q -am "Add division" && echo "pow=ok" >> math.txt && git commit -q -am "Add power" && echo "mod=ok" >> math.txt && git commit -q -am "Add modulo"
check: tag culprit
check: same culprit HEAD~3
check: head main
hint: git bisect start, git bisect bad, git bisect good HEAD~6
hint: After each jump, cat math.txt and answer good or bad.
hint: When Git names the first bad commit, git bisect reset, then git tag culprit with that id. It is "Refactor math".
solve: git bisect start
solve: git bisect bad
solve: git bisect good HEAD~6
solve: git bisect reset
solve: git tag culprit HEAD~3
```

---
title: git diff and git diff --staged
minutes: 8
setup: mkdir site && cd site && git init -q && echo "Hello" > index.html && echo "body {}" > style.css && git add . && git commit -q -m "First page"
---

`git diff` answers one question: **what changed?** The trick is knowing which two things it compares.

Remember the three areas: working folder, staging area, repository.

```flow
flowchart LR
  W[Working folder] -- "git diff" --- S[Staging area]
  S -- "git diff --staged" --- R[Last commit]
  W -- "git diff HEAD" --- R
```

## See it

```try
echo "Hello, world" > index.html
git diff
git add index.html
git diff
git diff --staged
```

1. After the edit, `git diff` shows the change. It is in the working folder but not staged.
2. After `git add`, plain `git diff` shows **nothing**. The working folder and the staging area are now the same.
3. `git diff --staged` shows what **will go into the next commit**. (`--cached` is the older name for the same thing.)

```warn
"git diff shows nothing, so I have no changes" is a classic mistake. Your changes may be staged. Run `git status` or `git diff --staged`.
```

## Compare any two commits

```try
git commit -m "Say hello to the world"
git diff HEAD~1 HEAD
```

You can compare any two names: `git diff main feature`, `git diff v1.0 v2.0`, `git diff HEAD~3`.

```bash
git diff --stat main feature     # only file names and counts
git diff --word-diff             # show changed words, great for text files
git diff main...feature          # three dots: changes on feature since it split from main
```

```tip
Read `git diff --staged` before every commit. Ten seconds of reading saves you from committing a debug line or a password.
```

```quiz
q: You edited a file and ran git add. Which command shows that change?
- git diff
- [x] git diff --staged
- git log
why: After git add, the change is in the staging area, and --staged compares it with the last commit.

q: What does git diff HEAD~1 HEAD show?
- Unstaged changes
- [x] What the last commit changed
- The whole history
why: It compares the commit before HEAD with HEAD, which is exactly the last commit's change.
```

```mission
title: Only the fix
goal: Two files have changes. One fixes a bug, the other is a half-written note. Use `git diff` to read them, then **stage only the bug fix** (the file whose change says `fix`).
setup: mkdir site && cd site && git init -q && echo "total = a - b" > calc.js && echo "notes" > notes.txt && git add . && git commit -q -m "Start" && echo "total = a + b // fix the sign" > calc.js && echo "maybe add dark mode???" >> notes.txt
check: staged calc.js
check: modified notes.txt
check: notstaged notes.txt
hint: git diff shows both changes.
hint: git add calc.js
solve: git add calc.js
```

---
title: Resolving a conflict step by step
minutes: 10
setup: mkdir band && cd band && git init -q && echo "Song: Blue Sky" > setlist.txt && git add . && git commit -q -m "First song" && git switch -q -c anna && echo "Song: Red Sun" > setlist.txt && git commit -q -am "Anna picks Red Sun" && git switch -q main && echo "Song: Green Sea" > setlist.txt && git commit -q -am "Main picks Green Sea" && git merge anna
---

The merge is paused with a conflict in `setlist.txt`. Here is the recipe. It is the same in every project, every editor, every company.

## 1. See what is in conflict

```try
git status
```

Look for `both modified:`. Those are the files to fix.

## 2. Open the file and decide

```try
cat setlist.txt
```

You choose: keep yours, keep theirs, or **combine** them. Combining is very common. Here, the band can play both songs:

```try
echo "Song: Green Sea" > setlist.txt
echo "Song: Red Sun" >> setlist.txt
cat setlist.txt
```

**All three markers must be gone.** A file with `<<<<<<<` left in it is a bug you just committed.

## 3. Mark it resolved and finish

```try
git add setlist.txt
git status
git commit -m "Merge anna: play both songs"
git log --oneline --graph
```

`git add` tells Git "this file is resolved". `git commit` finishes the merge.

```flow
flowchart LR
  A[git status] --> B[Edit the file] --> C[Remove all markers] --> D[git add] --> E[git commit]
```

## Shortcuts for whole files

```bash
git checkout --ours setlist.txt     # keep my version of this file
git checkout --theirs setlist.txt   # keep their version
git diff --name-only --diff-filter=U  # list files still in conflict
```

```tip
VS Code shows buttons above each conflict: **Accept Current**, **Accept Incoming**, **Accept Both**. Use them, but always read the result, and run the tests before you commit.
```

```quiz
q: You fixed the file. What tells Git the conflict is resolved?
- Saving the file
- [x] git add on the file
- git merge --continue without anything else
why: Staging the file marks it resolved. Then you commit (or run git merge --continue).

q: Which of these must not be left in the file?
- Blank lines
- [x] <<<<<<<, ======= and >>>>>>> markers
- Both versions of the text
why: Keeping both versions is fine if that is what you want. The markers must always go.
```

```mission
title: Two cooks
goal: Merge `spicy` into `main`. It conflicts in `soup.txt`. Resolve it so the soup has **both** `chilli` and `garlic`, with no markers left, and finish the merge.
setup: mkdir kitchen && cd kitchen && git init -q && echo "water" > soup.txt && git add . && git commit -q -m "Soup base" && git switch -q -c spicy && echo "chilli" > soup.txt && git commit -q -am "Add chilli" && git switch -q main && echo "garlic" > soup.txt && git commit -q -am "Add garlic"
check: merged spicy
check: contains soup.txt chilli
check: contains soup.txt garlic
check: lacks soup.txt <<<<<<<
check: nooperation
check: clean
hint: git merge spicy, then cat soup.txt
hint: echo "garlic" > soup.txt and echo "chilli" >> soup.txt
hint: git add soup.txt and git commit -m "Merge spicy"
solve: git merge spicy
solve: echo "garlic" > soup.txt
solve: echo "chilli" >> soup.txt
solve: git add soup.txt
solve: git commit -m "Merge spicy"
```

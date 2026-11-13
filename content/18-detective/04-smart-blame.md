---
title: Blame that ignores moves and whitespace
minutes: 7
---

Plain `git blame` stops at the **last** commit that touched a line. Often that is a useless commit: someone reformatted the file, or moved a function to another file. The real author is hidden behind it.

## Options that see through the noise

```bash
git blame -w app.js              # ignore whitespace-only changes
git blame -M app.js              # follow lines MOVED within the same file
git blame -C app.js              # also follow lines moved or copied from other files in the same commit
git blame -C -C -C app.js        # look in every commit, any file (slower, thorough)
git blame -L 40,60 app.js        # only these lines
git blame -L :login app.js       # only the function "login"
git blame --since=1.year app.js  # stop at changes older than a year
```

## Skip formatting commits for everyone

1. Put the ids of big formatting commits in a file at the repo root:

```
# .git-blame-ignore-revs
# Ran prettier on the whole codebase
3f2a9c1d8e7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f
```

2. Tell your Git to use it:

```bash
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

GitHub's **Blame** view reads this file automatically.

## Blame on GitHub

- Click any line number in Blame to see the commit, then the PR, then the discussion.
- The ⟲ icon next to a commit means "blame the version **before** this commit", so you can step back through time line by line.

```tip
When you do a big reformat yourself, make it a commit **with nothing else** in it, and add its id to `.git-blame-ignore-revs` in the same PR. Your teammates will thank you.
```

```quiz
q: A whole file was reformatted. Which option helps blame skip that commit?
- -L
- [x] --ignore-rev (or a .git-blame-ignore-revs file)
why: It tells blame to look past that commit, to the earlier author.

q: A function was moved from utils.js to math.js. Which option follows it?
- -w
- [x] -C
why: -C detects lines copied or moved from other files.
```

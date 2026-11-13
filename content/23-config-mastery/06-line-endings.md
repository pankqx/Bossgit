---
title: Line endings and .gitattributes
minutes: 7
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start"
---

Windows ends lines with two characters, **CRLF** (`\r\n`). macOS and Linux use one, **LF** (`\n`). If they mix in one repo you get:

- Diffs where **every line** changed, but nothing really did.
- Shell scripts that fail on Linux with `/bin/bash^M: bad interpreter`.
- Endless merge conflicts.

## The fix: let the repo decide

```try
echo "* text=auto eol=lf" > .gitattributes
echo "*.bat text eol=crlf" >> .gitattributes
echo "*.png binary" >> .gitattributes
git add .gitattributes && git commit -m "chore: normalise line endings"
cat .gitattributes
```

`text=auto` lets Git detect text files and store them with LF in the repo. `eol=lf` also checks them out with LF everywhere. Windows editors handle LF fine today.

## core.autocrlf, the old way

```bash
git config --global core.autocrlf true     # Windows: convert to CRLF on checkout, LF on commit
git config --global core.autocrlf input    # macOS/Linux: convert CRLF to LF on commit
```

This depends on **each person's** settings. `.gitattributes` is better, because it is committed and the same for everyone.

## Fixing a repo that is already mixed

```bash
git add --renormalize .
git commit -m "chore: normalise line endings"
```

```tip
Put the renormalize commit in `.git-blame-ignore-revs`, because it touches many lines.
```

```quiz
q: Why is .gitattributes better than core.autocrlf?
- It is faster
- [x] It is committed, so every developer gets the same rules
why: autocrlf is a personal setting that teammates may not have.

q: A script fails on Linux with ^M in the error. What is the cause?
- A virus
- [x] Windows CRLF line endings in the script
why: The \r character becomes part of the command.
```

```mission
title: One ending to rule them all
goal: Commit a `.gitattributes` with `* text=auto eol=lf` and a rule that marks `*.png` as `binary`.
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start"
check: tracked .gitattributes
check: contains .gitattributes * text=auto eol=lf
check: contains .gitattributes *.png binary
check: clean
solve: echo "* text=auto eol=lf" > .gitattributes
solve: echo "*.png binary" >> .gitattributes
solve: git add .
solve: git commit -m "chore: line endings"
```

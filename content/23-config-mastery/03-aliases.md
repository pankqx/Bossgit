---
title: Aliases that save hours
minutes: 7
setup: mkdir app && cd app && git init -q && echo "a" > a.txt && git add . && git commit -q -m "One" && echo "b" > b.txt && git add . && git commit -q -m "Two"
---

Typing `git log --oneline --graph --all --decorate` 30 times a day is about an hour a month. Aliases are the cheapest productivity win in your career.

```try
git config --global alias.lg "log --oneline --graph --all"
git config --global alias.last "log -1"
git config --global alias.unstage "restore --staged"
git lg
git last
```

## A senior's alias kit

```ini
[alias]
  s = status -sb
  lg = log --oneline --graph --all --decorate
  ll = log --pretty=format:'%C(yellow)%h %C(green)%ad %C(blue)%an%C(auto)%d %Creset%s' --date=short
  last = log -1 --stat
  df = diff --word-diff
  ds = diff --staged
  amend = commit --amend --no-edit
  undo = reset --soft HEAD~1
  unstage = restore --staged
  pushf = push --force-with-lease --force-if-includes
  sync = !git fetch --prune && git rebase origin/$(git rev-parse --abbrev-ref origin/HEAD | cut -d/ -f2)
  recent = for-each-ref --sort=-committerdate --count=15 --format='%(refname:short)' refs/heads/
  whoami = !git config user.name && git config user.email
  aliases = config --get-regexp ^alias\\.
```

## Shell aliases too

In `~/.bashrc` or `~/.zshrc`:

```bash
alias g=git
alias gs="git status -sb"
alias gco="git switch"
```

```warn
Learn the real commands first. In an interview or on a teammate's laptop, your aliases are not there.
```

```quiz
q: An alias value starts with !. What does that mean?
- It is forced
- [x] It runs as a shell command
why: ! lets an alias run several commands or other programs.

q: Which alias undoes the last commit but keeps its changes staged?
- reset --hard HEAD~1
- [x] reset --soft HEAD~1
why: --soft keeps everything staged.
```

```mission
title: Your toolkit
goal: Create the global aliases `lg` (for `log --oneline --graph --all`) and `undo` (for `reset --soft HEAD~1`). Then use `git undo` once, so the branch has 1 commit and `b.txt` is staged.
setup: mkdir app && cd app && git init -q && echo "a" > a.txt && git add . && git commit -q -m "One" && echo "b" > b.txt && git add . && git commit -q -m "Two"
check: config alias.lg log --oneline --graph --all
check: config alias.undo reset --soft HEAD~1
check: exactcommits 1
check: staged b.txt
solve: git config --global alias.lg "log --oneline --graph --all"
solve: git config --global alias.undo "reset --soft HEAD~1"
solve: git undo
```

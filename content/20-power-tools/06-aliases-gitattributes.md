---
title: Aliases and .gitattributes
minutes: 8
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start"
---

## Aliases: your own short commands

```try
git config --global alias.st status
git config --global alias.lg "log --oneline --graph --all"
git st
git lg
```

Aliases live in `~/.gitconfig`. Some that seniors really use:

```ini
[alias]
  st = status -sb
  lg = log --oneline --graph --all --decorate
  last = log -1 --stat
  undo = reset --soft HEAD~1
  amend = commit --amend --no-edit
  pushf = push --force-with-lease --force-if-includes
  wip = !git add -A && git commit -m wip
  gone = !git fetch -p && git branch -vv | awk '/: gone]/{print $1}' | xargs -r git branch -D
```

An alias starting with `!` runs a shell command. `gone` deletes local branches whose remote branch was deleted after merging.

## .gitattributes: rules per file type

A `.gitattributes` file in the repo tells Git how to treat files:

```
* text=auto eol=lf                # normalise line endings to LF in the repo
*.sh text eol=lf                  # scripts must keep LF, even on Windows
*.bat text eol=crlf
*.png binary                      # never diff or merge as text
package-lock.json -diff merge=ours  # hide noisy diffs; on conflict keep ours (needs a merge driver)
*.md diff=markdown                # nicer hunk headers
docs/** linguist-documentation    # GitHub's language bar ignores docs
vendor/** linguist-vendored
*.psd filter=lfs diff=lfs merge=lfs -text   # Git LFS
```

```tip
`* text=auto eol=lf` in every new repo prevents the classic "the whole file changed" diff when a Windows and a Mac user edit the same file.
```

```quiz
q: Where are global aliases stored?
- .git/config
- [x] ~/.gitconfig
why: --global writes to your home folder's config.

q: What does *.png binary in .gitattributes do?
- Deletes PNGs
- [x] Tells Git never to diff or merge PNGs as text
why: binary means -diff -merge -text.
```

```mission
title: Speed up
goal: Make a global alias `lg` for `log --oneline --graph --all`, and commit a `.gitattributes` file containing `* text=auto eol=lf`.
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start"
check: config alias.lg log --oneline --graph --all
check: tracked .gitattributes
check: contains .gitattributes * text=auto eol=lf
check: clean
hint: git config --global alias.lg "log --oneline --graph --all"
hint: echo "* text=auto eol=lf" > .gitattributes, then add and commit
solve: git config --global alias.lg "log --oneline --graph --all"
solve: echo "* text=auto eol=lf" > .gitattributes
solve: git add .
solve: git commit -m "chore: normalise line endings"
```

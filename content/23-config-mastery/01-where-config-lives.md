---
title: "Where config lives: system, global, local and worktree"
minutes: 6
setup: mkdir app && cd app && git init -q
---

You met three levels in module 2. There are actually **four**, plus a way to override anything for one command.

| Level | Flag | File | Wins over |
|---|---|---|---|
| System | `--system` | `/etc/gitconfig` | nothing |
| Global | `--global` | `~/.gitconfig` or `~/.config/git/config` | system |
| Local | `--local` | `.git/config` | global |
| Worktree | `--worktree` | `.git/config.worktree` (needs `extensions.worktreeConfig`) | local |
| One command | `git -c key=value ...` | none | everything |

```try
git config --list
git config --global core.editor "code --wait"
git config core.editor
```

In a real terminal, `git -c user.name="Just Once" commit -m "..."` uses that name for one command only.

## Commands for real debugging

```bash
git config --list --show-origin --show-scope    # every value, its file and its level
git config --get-all user.email                 # all values if set at several levels
git config --global --edit                      # open the file in your editor
git config --global --unset core.editor
```

```fact
Git 2.46 added new subcommands: `git config get`, `git config set`, `git config list`, `git config unset`. The old flag style still works everywhere.
```

```quiz
q: Which overrides everything for a single command?
- --system
- --local
- [x] git -c key=value
why: -c applies only to that one run and beats every file.

q: Which command shows which file each setting came from?
- git config --list
- [x] git config --list --show-origin
why: --show-origin prints the file path next to each value.
```

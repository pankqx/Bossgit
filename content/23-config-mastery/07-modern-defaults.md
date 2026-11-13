---
title: pull.rebase, push.autoSetupRemote and other modern defaults
minutes: 8
setup: mkdir app && cd app && git init -q
---

Git keeps old defaults for backward compatibility. Experienced developers change a handful of them on every new laptop. Here is a tested set, with a reason for each.

```ini
[init]
  defaultBranch = main              # new repos start on main
[pull]
  rebase = true                     # pull replays your commits instead of merging
[push]
  autoSetupRemote = true            # first push of a new branch sets upstream (Git 2.37+)
  default = current                 # push the current branch to the same name
  followTags = true                 # push annotated tags that point at pushed commits
[fetch]
  prune = true                      # forget remote branches that were deleted
  pruneTags = true
[rebase]
  autoStash = true                  # stash around a rebase
  autoSquash = true                 # use fixup! commits automatically
  updateRefs = true                 # move stacked branches too
[merge]
  conflictStyle = zdiff3            # show the base in conflicts
[diff]
  algorithm = histogram
  colorMoved = zebra
[rerere]
  enabled = true
[commit]
  verbose = true                    # show the diff in the commit message editor
[branch]
  sort = -committerdate             # git branch: most recent first
[tag]
  sort = version:refname            # v1.10 after v1.9
[help]
  autocorrect = prompt              # "did you mean...?"
[core]
  fsmonitor = true                  # faster status in big repos
```

```try
git config --global init.defaultBranch main
git config --global pull.rebase true
git config --global push.autoSetupRemote true
git config --global fetch.prune true
git config --global --list
```

```tip
Keep your `~/.gitconfig` in a **dotfiles** repository on GitHub. A new laptop is then ready in one minute.
```

```quiz
q: What does push.autoSetupRemote true change?
- Pushes go to a new remote
- [x] git push on a new branch sets the upstream automatically
why: No more "has no upstream branch" error and typing -u origin branch.

q: What does fetch.prune true do?
- Deletes your local branches
- [x] Removes remote-tracking branches that were deleted on the server
why: It keeps git branch -a clean. Your own local branches are not touched.
```

```mission
title: New laptop setup
goal: Set these **global** defaults: `init.defaultBranch` = `main`, `pull.rebase` = `true`, `push.autoSetupRemote` = `true`, `fetch.prune` = `true`.
setup: mkdir app && cd app && git init -q
check: config init.defaultBranch main
check: config pull.rebase true
check: config push.autoSetupRemote true
check: config fetch.prune true
check: run git config --global pull.rebase => true
solve: git config --global init.defaultBranch main
solve: git config --global pull.rebase true
solve: git config --global push.autoSetupRemote true
solve: git config --global fetch.prune true
```

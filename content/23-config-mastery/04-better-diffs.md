---
title: "Better diffs: diff tools, word diff and color moved"
minutes: 7
---

The default diff is fine. A tuned diff makes code review faster and catches more bugs.

## Settings worth turning on

```bash
git config --global diff.algorithm histogram     # cleaner diffs than the default "myers"
git config --global diff.colorMoved zebra        # moved lines get their own colours, not red and green
git config --global diff.colorMovedWS allow-indentation-change
git config --global diff.renames copies          # detect renames and copies
git config --global diff.mnemonicPrefix true     # i/ w/ c/ instead of a/ b/
```

## Flags for one-off reading

```bash
git diff --word-diff            # show changed words inline: [-old-]{+new+}
git diff --color-words          # same, with colour only
git diff -w                     # ignore whitespace changes
git diff --stat                 # only files and counts
git diff --name-status main     # A/M/D per file
git diff main...feature         # what the feature branch changed since it split
git range-diff main old-feature new-feature   # compare two versions of a rebased branch!
```

`git range-diff` is the senior's tool for reviewing a force-pushed PR: it shows how each commit changed between the old and new version.

## Pretty pagers and external tools

- **delta** (github.com/dandavison/delta): syntax highlighting, side-by-side, line numbers in the terminal.
  `git config --global core.pager delta` and `git config --global interactive.diffFilter "delta --color-only"`
- **difftastic**: understands code structure, so a reformatted line is not shown as changed.
- **difftool**: open diffs in a GUI: `git config --global diff.tool vscode` then `git difftool main`.

```ini
[difftool "vscode"]
  cmd = code --wait --diff $LOCAL $REMOTE
```

```quiz
q: A teammate force-pushed a rebased PR. Which command shows what changed in each commit?
- git diff
- [x] git range-diff
why: range-diff compares two series of commits, commit by commit.

q: What does diff.colorMoved do?
- Removes moved lines from the diff
- [x] Shows moved lines in a different colour from added and removed lines
why: Reviewers instantly see that a block was moved, not rewritten.
```

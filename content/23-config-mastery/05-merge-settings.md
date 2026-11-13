---
title: "Merge and conflict settings: diff3, zdiff3 and mergetool"
minutes: 7
---

The default conflict shows **ours** and **theirs**. It hides the most useful thing: what the line looked like **before** either side changed it.

```bash
git config --global merge.conflictStyle zdiff3
```

Now a conflict looks like this:

```
<<<<<<< ours
const TAX = 0.18
||||||| base
const TAX = 0.15
=======
const RATE = 0.15
>>>>>>> theirs
```

Reading the base tells the story: **we** changed the value, **they** renamed the variable. The right answer is clearly `const RATE = 0.18`. Without the base you would be guessing.

| Style | Shows | Notes |
|---|---|---|
| `merge` (default) | ours, theirs | |
| `diff3` | ours, **base**, theirs | |
| `zdiff3` (Git 2.35+) | ours, **base**, theirs, with common lines moved out of the conflict | the best choice |

## Merge tools

```bash
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait --merge $REMOTE $LOCAL $BASE $MERGED'
git config --global mergetool.keepBackup false    # no .orig files left behind
git mergetool                                     # opens each conflicted file
```

VS Code, IntelliJ, Meld, Beyond Compare and KDiff3 all show a 3-way view.

## Other settings that help

```bash
git config --global rerere.enabled true          # remember resolutions (module 20)
git config --global merge.ff false               # always create merge commits (if your team wants that)
git config --global pull.rebase true             # pull = fetch + rebase
git config --global rebase.autoStash true        # stash and unstash around a rebase automatically
git config --global rebase.updateRefs true       # move stacked branches with a rebase
```

```quiz
q: What extra section does zdiff3 add to a conflict?
- A list of authors
- [x] The base version from before either side changed it
why: Knowing the original makes it clear what each side intended.

q: Which setting stops .orig backup files after git mergetool?
- merge.ff false
- [x] mergetool.keepBackup false
why: It tells mergetool not to keep backup copies.
```

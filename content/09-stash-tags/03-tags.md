---
title: Lightweight and annotated tags
minutes: 8
setup: mkdir app && cd app && git init -q && echo "v1" > app.js && git add . && git commit -q -m "First release" && echo "v2" > app.js && git commit -q -am "Second release" && echo "v3" > app.js && git commit -q -am "Work in progress"
---

A branch moves every time you commit. A **tag** never moves. It marks one commit forever: "this is version 1.0.0".

## Two kinds

```try
git tag v0.1-test HEAD~2
git tag -a v1.0.0 HEAD~1 -m "First stable release"
git tag
git show v1.0.0
```

| | Lightweight | Annotated |
|---|---|---|
| Command | `git tag NAME` | `git tag -a NAME -m "msg"` |
| What it is | Just a name pointing at a commit | A real Git object with author, date and message |
| Use for | Private bookmarks | **Releases** |

`git show v1.0.0` shows the tagger and message first, then the commit.

## Tags must be pushed

```bash
git push origin v1.0.0       # push one tag
git push --tags              # push all tags
git push --follow-tags       # push commits plus the annotated tags that point at them
git push origin --delete v0.1-test   # delete a tag on GitHub
git tag -d v0.1-test         # delete it locally
```

```warn
`git push` alone does **not** send tags. A very common surprise: "I tagged it, why is there no release on GitHub?"
```

```tip
Signed tags (`git tag -s v1.0.0`) prove who made a release. Module 21 covers signing.
```

```bash
git tag -l "v1.*"            # list tags matching a pattern
git describe --tags          # "v1.0.0-3-gabc123" = 3 commits after v1.0.0
git checkout v1.0.0          # look at the code of that release (detached HEAD)
```

```quiz
q: Which tag type should you use for a release?
- Lightweight
- [x] Annotated
why: Annotated tags store who tagged, when and why. Tools like GitHub Releases and git describe expect them.

q: You ran git push. Are your new tags on GitHub?
- Yes
- [x] No, tags need git push --tags or git push origin TAG
why: Tags are pushed separately on purpose.
```

```mission
title: Ship it
goal: Mark the commit `Second release` (one before HEAD) with an **annotated** tag `v2.0.0` with the message `Version 2`.
setup: mkdir app && cd app && git init -q && echo "v1" > app.js && git add . && git commit -q -m "First release" && echo "v2" > app.js && git commit -q -am "Second release" && echo "v3" > app.js && git commit -q -am "Work in progress"
check: tag v2.0.0
check: same v2.0.0 HEAD~1
check: run git cat-file -t v2.0.0 => tag
hint: -a makes an annotated tag. -m gives the message.
hint: git tag -a v2.0.0 HEAD~1 -m "Version 2"
solve: git tag -a v2.0.0 HEAD~1 -m "Version 2"
```

---
title: A proper release tag
difficulty: Medium
tags: tags
---

Light tags are just sticky notes. Real releases use **annotated** tags, which store who made them, when, and a message.

```mission
goal: Create an annotated tag `v2.0` on the current commit with the message `Second release`.
setup: git init -q && echo "# Shop" > README.md && git add . && git commit -q -m "Start the shop" && echo "2.0" > version.txt && git add . && git commit -q -m "Bump to 2.0"
check: tag v2.0
check: run git cat-file -t v2.0 => tag
check: run git show v2.0 => Second release
hint: `-a` makes a tag annotated. `-m` gives it a message.
hint: `git tag -a v2.0 -m "Second release"`.
```

```solution
git tag -a v2.0 -m "Second release"
```

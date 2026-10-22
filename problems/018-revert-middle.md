---
title: Undo a pushed commit safely
difficulty: Medium
tags: undo, revert
---

Three commits went out today. The middle one, `Add broken ads`, crashes the site. Everyone already pulled, so you must **not** rewrite history.

```mission
goal: Undo only `Add broken ads` with a new commit. The header and footer must stay.
setup: git init -q && echo "# Shop" > README.md && git add . && git commit -q -m "Start the shop"
setup: echo "<header>" > header.html && git add . && git commit -q -m "Add header"
setup: echo "popup()" > ads.js && git add . && git commit -q -m "Add broken ads"
setup: echo "<footer>" > footer.html && git add . && git commit -q -m "Add footer"
check: nofile ads.js
check: file header.html
check: file footer.html
check: exactcommits 5
check: message revert
check: clean
hint: `git revert COMMIT` makes a new commit that does the opposite of an old one.
hint: The bad commit is one before HEAD: `HEAD~1`.
```

```solution
git revert HEAD~1
```

---
title: Publish a new branch
difficulty: Medium
tags: remotes, push, branches
---

You made a branch `cart` with a new commit. GitHub has never heard of it.

```mission
goal: Push `cart` to `origin` and set it as the upstream, so later a plain `git push` just works.
setup: bossgit github https://github.com/you/shop
setup: git init -q && echo "# Shop" > README.md && git add . && git commit -q -m "Start the shop"
setup: git remote add origin https://github.com/you/shop && git push -q -u origin main
setup: git switch -q -c cart && echo "cart()" > cart.js && git add . && git commit -q -m "Add cart"
check: pushed cart
check: config branch.cart.remote origin
hint: `git push` alone fails: the branch has no upstream yet.
hint: `git push -u origin cart` pushes and remembers the link.
```

```solution
git push -u origin cart
```

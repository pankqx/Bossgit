---
title: Squash three commits into one
difficulty: Medium
tags: reset, history
---

Your last three commits are called `wip`, `wip again` and `ok now it works`. Nobody needs to see that.

```mission
goal: Turn the last three commits into **one** commit with the message `Add contact page`. Keep all the work.
setup: git init -q && echo "# Shop" > README.md && git add . && git commit -q -m "Start the shop"
setup: echo "<form>" > contact.html && git add . && git commit -q -m "wip"
setup: echo "<input>" >> contact.html && git commit -q -a -m "wip again"
setup: echo "form{}" > contact.css && git add . && git commit -q -m "ok now it works"
check: exactcommits 2
check: message Add contact page
check: tracked contact.html
check: tracked contact.css
check: contains contact.html <input>
check: clean
hint: `git reset --soft` moves the branch back but keeps every change staged.
hint: Go back three commits: `HEAD~3`. Then commit once.
```

```solution
git reset --soft HEAD~3
git commit -m "Add contact page"
```

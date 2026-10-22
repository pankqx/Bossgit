---
title: Erase a password from history
difficulty: Hard
tags: security, history, reset
---

Two commits ago you committed `password.txt`. Then you deleted it in a later commit. But it is **still inside the history**, and you are about to push. Nothing is pushed yet.

```mission
goal: Rewrite your local history so that `password.txt` is not in **any** commit. Keep `app.js` and `login.js`.
setup: git init -q && echo "# Shop" > README.md && git add . && git commit -q -m "Start the shop"
setup: echo "run()" > app.js && echo "admin:1234" > password.txt && git add . && git commit -q -m "Add app"
setup: echo "login()" > login.js && git add . && git commit -q -m "Add login"
setup: git rm -q password.txt && git commit -q -m "Remove password"
check: neverin password.txt
check: tracked app.js
check: tracked login.js
check: clean
check: nooperation
hint: Deleting a file in a new commit does not remove it from older commits.
hint: Your files today are fine. Only the history is dirty. What if you rebuilt the history from today's files?
hint: `git reset --soft HEAD~3` goes back to the clean first commit and keeps today's files staged. Then commit once.
```

```solution
git reset --soft HEAD~3
git commit -m "Add app and login"
```

---
title: Take just the fix
difficulty: Medium
tags: cherry-pick, branches
---

The `dev` branch has three commits: a risky theme, a login fix, and a half-done chat. Production (`main`) needs only the login fix, today.

```mission
goal: Bring only the `Fix login crash` commit onto `main`. Do not bring the theme or the chat.
setup: git init -q && echo "# Shop" > README.md && git add . && git commit -q -m "Start the shop" && echo "login()" > login.js && git add . && git commit -q -m "Add login"
setup: git switch -q -c dev && echo "dark" > theme.css && git add . && git commit -q -m "Try new theme"
setup: echo "login() // safe" > login.js && git commit -q -a -m "Fix login crash"
setup: echo "chat()" > chat.js && git add . && git commit -q -m "Half-done chat"
setup: git switch -q main
check: head main
check: contains login.js safe
check: nofile theme.css
check: nofile chat.js
check: message login crash
check: nooperation
hint: `git log --oneline dev` shows the commits on dev.
hint: `git cherry-pick COMMIT` copies one commit onto your branch.
hint: The fix is one before the tip of dev: `dev~1`.
```

```solution
git log --oneline dev
git cherry-pick dev~1
```

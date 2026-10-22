---
title: Split one commit into two
difficulty: Hard
tags: reset, staging, history
---

Your last commit mixes two unrelated things: new styles and a new script. Reviewers want them as separate commits.

```mission
goal: Replace the last commit with **two** commits: first one with only `style.css`, then one with `app.js`.
setup: git init -q && echo "# Shop" > README.md && git add . && git commit -q -m "Start the shop" && echo "body{}" > style.css && echo "go()" > app.js && git add . && git commit -q -m "Styles and script"
check: exactcommits 3
check: branchhas HEAD~1 style.css
check: branchlacks HEAD~1 app.js
check: tracked app.js
check: clean
hint: Undo the commit but keep the files: `git reset HEAD~1` (mixed reset unstages them).
hint: Now stage and commit `style.css` alone, then `app.js`.
```

```solution
git reset HEAD~1
git add style.css
git commit -m "Add styles"
git add app.js
git commit -m "Add script"
```

---
title: Move a file into a folder
difficulty: Easy
tags: files, mv
---

The project is growing. `app.js` should live inside a `src` folder.

```mission
goal: Move `app.js` to `src/app.js` and commit the move.
setup: git init -q && echo "# Shop" > README.md && git add . && git commit -q -m "Start the shop" && echo "run()" > app.js && git add . && git commit -q -m "Add app"
check: tracked src/app.js
check: nottracked app.js
check: clean
check: exactcommits 3
hint: Make the folder first with `mkdir src`.
hint: `git mv OLD NEW` moves the file and stages the move in one go.
```

```solution
mkdir src
git mv app.js src/app.js
git commit -m "Move app into src"
```

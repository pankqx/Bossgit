---
title: Find the commit that added the bug
difficulty: Medium
tags: detective, blame, history
---

Someone left `debugger` in `app.js` and now the app freezes. There are six commits. Which one did it?

```mission
goal: Put a tag called `culprit` on the commit that **added** the `debugger` line.
setup: mkdir app && cd app && git init -q && echo "start()" > app.js && git add . && git commit -q -m "Start"
setup: echo "load()" >> app.js && git commit -q -a -m "Load data"
setup: echo "debugger" >> app.js && git commit -q -a -m "Speed up loading"
setup: echo "draw()" >> app.js && git commit -q -a -m "Draw screen"
setup: echo "save()" >> app.js && git commit -q -a -m "Save game"
setup: echo "quit()" >> app.js && git commit -q -a -m "Add quit"
check: tag culprit
check: same culprit HEAD~3
hint: `git blame app.js` shows the commit hash next to each line.
hint: Copy the hash on the `debugger` line, then `git tag culprit HASH`.
```

```solution
git blame app.js
# use the hash shown on the debugger line, here it is HEAD~3
git tag culprit HEAD~3
```

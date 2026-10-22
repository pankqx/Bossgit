---
title: A conflict where both sides win
difficulty: Medium
tags: merge, conflicts
---

You added Pasta to the menu on `main`. Your friend added Lemonade on the `drinks` branch, on the same line. Both should stay.

```mission
goal: Merge `drinks` into `main`. The final `menu.txt` must have **both** Pasta and Lemonade, no conflict markers, and the merge must be finished.
setup: mkdir cafe && cd cafe && git init -q && echo "Pizza" > menu.txt && git add . && git commit -q -m "Menu"
setup: git switch -q -c drinks && echo "Lemonade" >> menu.txt && git commit -q -a -m "Add lemonade"
setup: git switch -q main && echo "Pasta" >> menu.txt && git commit -q -a -m "Add pasta"
check: merged drinks
check: parents 2
check: contains menu.txt Pasta
check: contains menu.txt Lemonade
check: lacks menu.txt <<<<<<<
check: lacks menu.txt >>>>>>>
check: nooperation
check: clean
hint: Start with `git merge drinks`. A conflict is expected.
hint: Open the file with `cat menu.txt`. Rewrite it with `echo` so it has Pizza, Pasta and Lemonade, one per line.
hint: Then `git add menu.txt` and `git commit -m "Merge drinks"`.
```

```solution
git merge drinks
echo Pizza > menu.txt
echo Pasta >> menu.txt
echo Lemonade >> menu.txt
git add menu.txt
git commit -m "Merge drinks"
```

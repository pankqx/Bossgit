---
title: Bring back the old recipe
difficulty: Easy
tags: restore, history
---

Grandma's cake used 2 eggs. Two commits later someone changed it to 5 eggs and the cake is a disaster.

```mission
goal: Make `recipe.txt` exactly like it was in the **first** commit, then commit that. Do not delete any commits.
setup: mkdir bakery && cd bakery && git init -q && echo "2 eggs" > recipe.txt && git add . && git commit -q -m "Grandma's cake"
setup: echo "5 eggs" > recipe.txt && git commit -q -a -m "More eggs"
setup: echo "open 9-5" > hours.txt && git add . && git commit -q -m "Add hours"
check: exactcommits 4
check: contains recipe.txt 2 eggs
check: lacks recipe.txt 5 eggs
check: tracked hours.txt
check: clean
hint: You want an old *version of one file*, not to go back in time with the whole project.
hint: `git restore --source=COMMIT FILE` copies a file from any commit.
hint: The first commit is `HEAD~2` here.
```

```solution
git restore --source=HEAD~2 recipe.txt
git commit -a -m "Back to 2 eggs"
```

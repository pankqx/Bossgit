---
title: Resurrect a deleted file
difficulty: Medium
tags: history, restore, detective
---

`secret-recipe.txt` was deleted many commits ago. Now the chef wants it back, exactly as it was.

```mission
goal: Bring back `secret-recipe.txt` with its original text and commit it.
setup: mkdir kitchen && cd kitchen && git init -q && echo "grandma sauce: tomato, love" > secret-recipe.txt && git add . && git commit -q -m "Add recipe"
setup: git rm -q secret-recipe.txt && git commit -q -m "Clean up old files"
setup: echo "soup" > menu.txt && git add . && git commit -q -m "Add menu"
setup: echo "salad" >> menu.txt && git commit -q -a -m "More menu"
setup: echo "9-5" > hours.txt && git add . && git commit -q -m "Hours"
check: tracked secret-recipe.txt
check: contains secret-recipe.txt grandma sauce
check: exactcommits 6
check: clean
hint: `git log --oneline -- secret-recipe.txt` shows only commits that touched that file.
hint: The file still exists in the commit **before** it was deleted.
hint: `git restore --source=HASH secret-recipe.txt`, then add and commit.
```

```solution
git log --oneline -- secret-recipe.txt
git restore --source=HEAD~4 secret-recipe.txt
git add secret-recipe.txt
git commit -m "Bring back the recipe"
```

---
title: Who wrote this line?
difficulty: Easy
tags: history, blame, detective
---

Someone added the line `free shipping forever` to `prices.txt`. The boss wants to know who.

```mission
goal: Find the first name of the person who added that line. Write just the name into a new file called `answer.txt`.
setup: mkdir shop && cd shop && git init -q
setup: bossgit identity Priya priya@shop.dev && echo "shirt 20" > prices.txt && git add . && git commit -q -m "Add prices"
setup: bossgit identity Sam sam@shop.dev && echo "free shipping forever" >> prices.txt && git commit -q -a -m "Update prices"
setup: bossgit identity Leo leo@shop.dev && echo "hat 15" >> prices.txt && git commit -q -a -m "Add hats"
setup: bossgit identity
check: contains answer.txt Sam
hint: `git blame prices.txt` shows who last changed each line.
hint: Or read `git log` and look at what each author did.
hint: Then `echo NAME > answer.txt`.
```

```solution
git blame prices.txt
echo Sam > answer.txt
```

---
title: The daily loop
minutes: 6
setup: mkdir journal && cd journal && git init -q
---

You now know the loop that you will repeat thousands of times:

```flow
flowchart LR
  E["Edit files"] --> S["git status"]
  S --> A["git add"]
  A --> C["git commit -m"]
  C --> E
```

**Edit, check, stage, commit.** Do a small piece of work, check what changed, choose what goes in, save it with a clear message. Then again.

Practise it a few times right now. Each line is one turn of the loop:

```try
echo "Day 1: learned git init" > day1.txt
git status
git add day1.txt
git commit -m "Write day 1"
echo "Day 2: the staging area is a box" > day2.txt
git add day2.txt && git commit -m "Write day 2"
git log --oneline
```

## How often should I commit?

More often than you think. Every time you finish a small step that works, commit it. A commit every 10 to 30 minutes is normal. Small commits are:

- **easy to understand** later,
- **easy to undo** if one was a mistake,
- **easy to review** when someone else reads them.

```story
Keeping a daily commit streak is a great habit, but commit **real work**, not empty changes to keep a square green. A green square from one honest, small commit is worth more than ten fake ones. Your future employer can tell the difference.
```

```quiz
q: What is a good size for a commit?
- One commit per week with everything
- [x] One small, complete step, like "Add the search box"
- One commit per line of code
why: Small commits about one thing are easy to read, review and undo.
```

```mission
title: The Messy Desk
boss: true
goal: Your desk is a mess. There are five files. `shopping.txt` and `budget.txt` belong together: commit **only those two** in one commit with a message that mentions "budget". Then commit `ideas.txt` on its own. Leave `password.txt` and `temp.log` **uncommitted**.
setup: mkdir desk && cd desk && git init -q && echo "README" > README.md && git add . && git commit -q -m "Start" && echo "milk" > shopping.txt && echo "50 coins" > budget.txt && echo "build a robot" > ideas.txt && echo "hunter2" > password.txt && echo "debug" > temp.log
check: exactcommits 3
check: tracked shopping.txt
check: tracked budget.txt
check: tracked ideas.txt
check: nottracked password.txt
check: nottracked temp.log
check: run git log --oneline => budget
hint: git add shopping.txt budget.txt
hint: git commit -m "Plan the budget"
hint: Then add and commit ideas.txt on its own
```

---
title: git log and its most useful options
minutes: 9
setup: mkdir cafe && cd cafe && git init -q && echo "Coffee 3" > menu.txt && git add . && git commit -q -m "Open the cafe" && echo "Tea 2" >> menu.txt && git commit -q -am "Add tea" && echo "Cake 4" >> menu.txt && git commit -q -am "Add cake" && echo "Coffee 4" > menu.txt && echo "Tea 2" >> menu.txt && echo "Cake 4" >> menu.txt && git commit -q -am "Raise coffee price" && echo "open 8-6" > hours.txt && git add . && git commit -q -m "Add opening hours"
---

`git log` lists the commits on your branch, newest first. Each one has an id, an author, a date and a message.

```try
git log
```

That is a lot of text for five commits. Real projects have thousands. So you need **options** that cut the history down to what you want.

## The options you will use every day

```try
git log --oneline
git log --oneline -2
git log --oneline --graph --all
```

| Option | What it does |
|---|---|
| `--oneline` | One line per commit: short id and message |
| `-n 3` or `-3` | Only the newest 3 commits |
| `--graph` | Draws the branch lines on the left |
| `--all` | Shows every branch, not just the one you are on |

```tip
`git log --oneline --graph --all` is so useful that most developers make an alias for it. You will make one in module 23.
```

## Searching the history

```try
git log --oneline --grep price
git log --oneline --author Learner
git log --oneline -- hours.txt
```

- `--grep WORD` keeps commits whose **message** contains the word.
- `--author NAME` keeps commits by one person.
- `-- FILE` keeps commits that **changed that file**. The `--` means "what follows is a file, not a branch".

## Even more filters

In a real terminal you can also use these. They work the same way:

```bash
git log --since="2 weeks ago" --until="yesterday"
git log --format="%h %an %ar %s"     # your own layout: id, author, time ago, subject
git log main..feature                # commits on feature that main does not have
git log --first-parent               # only the main line, skipping work inside merged branches
```

```fact
`git log main..feature` uses "two dot" range syntax. You will use it all the time in code review: "what does this branch add?"
```

```quiz
q: You want the five newest commits, one line each. Which command?
- git log -5 --graph
- [x] git log --oneline -5
- git log --all
why: --oneline makes each commit one line, and -5 keeps the newest five.

q: What does git log -- prices.txt show?
- Commits whose message says prices.txt
- [x] Commits that changed the file prices.txt
- The text inside prices.txt
why: After --, Git reads the names as files, and keeps the commits that touched them.
```

```mission
title: Mark the price change
goal: Find the commit that raised the coffee price. Put a tag called `price-rise` on **that commit**.
setup: mkdir cafe && cd cafe && git init -q && echo "Coffee 3" > menu.txt && git add . && git commit -q -m "Open the cafe" && echo "Tea 2" >> menu.txt && git commit -q -am "Add tea" && echo "Coffee 4" > menu.txt && echo "Tea 2" >> menu.txt && git commit -q -am "Raise coffee price" && echo "open 8-6" > hours.txt && git add . && git commit -q -m "Add opening hours" && echo "Wifi: cafe123" >> hours.txt && git commit -q -am "Share the wifi password"
check: tag price-rise
check: same price-rise HEAD~2
hint: git log --oneline --grep price shows the commit and its short id.
hint: git tag price-rise <the id>
solve: git tag price-rise HEAD~2
```

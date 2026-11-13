---
title: shortlog and statistics
minutes: 6
setup: mkdir team && cd team && git init -q && echo "a" > a.txt && git add . && git commit -q -m "Start" && bossgit identity Riya riya@team.dev && echo "b" > b.txt && git add . && git commit -q -m "Add b" && echo "c" > c.txt && git add . && git commit -q -m "Add c" && bossgit identity Sam sam@team.dev && echo "d" > d.txt && git add . && git commit -q -m "Add d" && bossgit identity Learner learner@bossgit.dev
---

Sometimes you need numbers: who works on what, how big a release is, how fast a codebase changes.

```try
git shortlog
git log --oneline --author Riya
```

`git shortlog` groups commits by author. It is how release notes list contributors.

## In a real terminal

```bash
git shortlog -sn                  # count per person, biggest first
git shortlog -sn --since="3 months ago"
git shortlog -sn -- src/payments/ # who knows this folder best?
git log --stat v1.0..v1.1         # files changed per commit in a release
git diff --shortstat v1.0 v1.1    # "120 files changed, 4012 insertions(+), 990 deletions(-)"
git rev-list --count HEAD         # number of commits
git log --format='%an' | sort | uniq -c | sort -rn   # same as shortlog -sn, with Unix tools
```

## .mailmap

The same person often appears twice ("Pankaj" and "K S Pankaj", work and personal email). A `.mailmap` file merges them:

```
K S Pankaj <pank@example.com> <old-email@example.com>
K S Pankaj <pank@example.com> Pankaj <pank@work.example>
```

```warn
Commit counts are **not** a measure of how good or productive someone is. One careful commit can be worth more than fifty small ones. Use these numbers to find **who to ask**, never to rank people.
```

```quiz
q: Which command shows who has the most commits in src/api/?
- git blame src/api/
- [x] git shortlog -sn -- src/api/
why: shortlog counts commits per author, and -- limits it to a path.

q: What does .mailmap fix?
- Merge conflicts
- [x] One person appearing under several names or emails
why: It maps old names and emails to one identity.
```

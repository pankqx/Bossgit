---
title: "git blame: who wrote this line?"
minutes: 9
setup: mkdir club && cd club && git init -q && echo "Rule 1: be kind" > rules.txt && git add . && git commit -q -m "First rule" && bossgit identity Sam sam@team.dev && echo "Rule 2: no phones" >> rules.txt && git commit -q -am "Add the phone rule" && bossgit identity Learner learner@bossgit.dev && echo "Rule 3: bring snacks" >> rules.txt && git commit -q -am "Add snacks"
---

`git blame` shows, for **every line** of a file, the last commit that changed it and who made that commit.

```try
git blame rules.txt
```

Each line starts with a short commit id and an author. Now you know who to ask about Rule 2, and you can read *why* it was added:

```try
git log --oneline
git show HEAD~1
```

## Blame is for context, not for blaming

The name is a joke. Good engineers use blame to find **the reason** behind a line, not a person to shout at. The usual path is:

1. `git blame file` and find the line.
2. `git show <id>` to read the full commit and its message.
3. Find the pull request on GitHub from that commit, and read the discussion.

```tip
On GitHub, open any file and click **Blame**. You can click "View blame prior to this change" to step further back in time, line by line.
```

## Useful options in a real terminal

```bash
git blame -L 10,20 app.js    # only lines 10 to 20
git blame -w app.js          # ignore changes that only touched spaces
git blame -C -C app.js       # follow lines that were moved or copied from other files
git blame --ignore-rev abc123 app.js   # skip a big "reformat everything" commit
```

```fact
Teams keep a file called `.git-blame-ignore-revs` listing big formatting commits. Run `git config blame.ignoreRevsFile .git-blame-ignore-revs` and blame skips them. GitHub's Blame view reads that file automatically.
```

```quiz
q: What does each line of git blame tell you?
- Who opened the file most recently
- [x] The last commit that changed that line, and its author
- Every commit that ever touched the file
why: Blame gives the latest change per line. To see older ones, look at that commit's parent.

q: A big commit reformatted every file and now blame is useless. What helps?
- Delete that commit
- [x] git blame --ignore-rev or a .git-blame-ignore-revs file
- git blame -L
why: ignore-rev tells blame to look past that commit, to the change before it.
```

```mission
title: The Missing Line
boss: true
goal: The club rules used to say `Rule 3: bring snacks`. Someone removed it in a commit, and later someone else changed another file. **Undo only the commit that removed the line** with `git revert`, so the line comes back and the later work stays.
setup: mkdir club && cd club && git init -q && echo "Rule 1: be kind" > rules.txt && echo "Rule 2: no phones" >> rules.txt && echo "Rule 3: bring snacks" >> rules.txt && git add . && git commit -q -m "Club rules" && echo "Rule 1: be kind" > rules.txt && echo "Rule 2: no phones" >> rules.txt && git commit -q -am "Tidy up the rules" && echo "Meet on Friday" > events.txt && git add . && git commit -q -m "Add events"
check: contains rules.txt Rule 3
check: file events.txt
check: message Revert
check: nooperation
check: commits 4
hint: git log --oneline -- rules.txt shows the commits that changed rules.txt.
hint: git log -S "Rule 3" --oneline finds the commit that added or removed that text.
hint: git revert HEAD~1
solve: git revert HEAD~1
```

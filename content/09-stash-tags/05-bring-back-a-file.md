---
title: Bring back an old file
minutes: 7
setup: mkdir docs && cd docs && git init -q && echo "Install: npm i" > guide.md && echo "Old FAQ" > faq.md && git add . && git commit -q -m "Docs" && echo "Install: pnpm i" > guide.md && git commit -q -am "Switch to pnpm" && git rm -q faq.md && git commit -q -m "Remove FAQ"
---

A file was deleted, or changed for the worse, several commits ago. You want **that one file** back, without undoing anything else.

## Step 1: find the commit where it was right

```try
git log --oneline -- faq.md
```

The newest commit in that list is the one that **deleted** it. You want its parent, one step before: add `~1`.

## Step 2: restore it from there

```try
git restore --source=HEAD~1 faq.md
cat faq.md
git status
```

The file is back in your folder as a new change. Commit it like any other change.

```try
git commit -am "Bring back the FAQ"
```

Wait, `-a` does not add new files. Check:

```try
git status
git add faq.md
git commit -m "Bring back the FAQ"
```

## Same trick for an old version of a file that still exists

```try
git restore --source=HEAD~3 guide.md
cat guide.md
git restore guide.md
```

```bash
git checkout abc123 -- guide.md      # the older command, same result
git log --diff-filter=D --oneline -- faq.md   # find the commit that Deleted a file
git show abc123:path/to/file > copy.txt       # save an old version under a new name
```

```tip
`--diff-filter=D` finds deletions even when you do not know when they happened. Problem 31 practises it.
```

```quiz
q: The commit that deleted faq.md is a1b2c3. Where do you restore from?
- a1b2c3
- [x] a1b2c3~1
why: In a1b2c3 the file is already gone. Its parent still has it.

q: Does git restore --source=X file change any other file?
- Yes, it resets the whole folder to X
- [x] No, only the file you name
why: restore with a path is precise. git reset or git switch would move everything.
```

```mission
title: Resurrection
goal: `contact.html` was deleted in the last commit. Bring it back, and commit it, so the branch has 3 commits and nothing is left to commit.
setup: mkdir site && cd site && git init -q && echo "home" > index.html && echo "email us" > contact.html && git add . && git commit -q -m "Site" && echo "home v2" > index.html && git commit -q -am "New home" && git rm -q contact.html && git commit -q -m "Remove contact page"
check: tracked contact.html
check: contains contact.html email us
check: contains index.html home v2
check: exactcommits 4
check: clean
hint: git restore --source=HEAD~1 contact.html
hint: git add contact.html, then commit
solve: git restore --source=HEAD~1 contact.html
solve: git add contact.html
solve: git commit -m "Bring back the contact page"
```

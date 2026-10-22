---
title: git commit and good messages
minutes: 7
setup: mkdir site && cd site && git init -q && echo "<h1>Home</h1>" > index.html && git add .
---

`git commit` takes everything in the staging area and saves it as a new commit. The `-m` part is the message.

```try
git commit -m "Add home page"
git log
```

The log shows the commit's ID, author, date and message.

## Writing messages people thank you for

Your message is a note to the future, often to yourself in six months. Compare:

| Bad | Good |
|---|---|
| `stuff` | `Add contact form to about page` |
| `fix` | `Fix crash when cart is empty` |
| `asdfgh` | `Remove unused images` |
| `changes` | `Make buttons bigger on phones` |

A good message:

- starts with a **verb** in the command form: *Add*, *Fix*, *Remove*, *Make*, *Update*,
- says **what** changed and, if it's not obvious, **why**,
- is short: about 50 characters for the first line.

A good test: finish the sentence *"If applied, this commit will…"*. "If applied, this commit will **fix crash when cart is empty**." Perfect.

## A shortcut

If you only changed files Git already tracks, `-a` stages them for you:

```try
echo "<p>Hi there</p>" >> index.html
git commit -am "Add a greeting to the home page"
git log --oneline
```

`-a` does **not** add new, untracked files. Those still need `git add`.

## Fixing the last message

Typo in the message you just wrote? If you have not shared the commit yet, `--amend` replaces it:

```try
git commit --amend -m "Greet visitors on the home page"
git log --oneline
```

```fact
Many teams follow a style called **Conventional Commits**: `feat: add search`, `fix: handle empty cart`, `docs: explain setup`. You will meet it in module 13.
```

```quiz
q: Which is the best commit message?
- updated files
- [x] Fix login button on small screens
- final fix!!!
why: It starts with a verb, says what changed and where. Anyone can understand it without opening the code.

q: Does `git commit -a` include brand new files?
- Yes, all files
- [x] No, only files Git already tracks
why: New files must be added with git add the first time.
```

```mission
title: Two clean commits
goal: Add `about.html` and `contact.html` as two **separate** commits, each with a clear message. You need 3 commits in total when you are done, and nothing left to commit.
setup: mkdir site && cd site && git init -q && echo "<h1>Home</h1>" > index.html && git add . && git commit -q -m "Add home page" && echo "<h1>About</h1>" > about.html && echo "<h1>Contact</h1>" > contact.html
check: exactcommits 3
check: tracked about.html
check: tracked contact.html
check: clean
hint: git add about.html, then commit
hint: Then do the same for contact.html
```

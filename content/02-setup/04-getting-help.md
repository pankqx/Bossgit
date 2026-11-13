---
title: Getting help from Git itself
minutes: 5
---

Git has around 150 commands and thousands of options. Nobody remembers them all, not even senior engineers. They know **how to look things up fast**.

## Three kinds of help

```bash
git help commit        # the full manual page, in the terminal or a browser
git commit --help      # the same thing
git commit -h          # a short summary of the options
```

Try the short one here:

```try
git help
git commit -h
```

`-h` is the one you will use most. It fits on one screen and shows every flag.

## Read the messages Git prints

Git's error messages are very good. They often tell you the exact next command. Look at this:

```
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. ... You may want to first integrate the remote changes
hint: (e.g., 'git pull ...') before pushing again.
```

Beginners panic and copy the message into a search engine. Professionals **read the hint**. It says "pull first, then push". That is the answer.

```tip
`git status` is also a help command. It always tells you what state you are in and which commands get you out of it.
```

## Where else to look

- **git-scm.com/docs** has the official manual for every command.
- **git-scm.com/book** is *Pro Git*, a free book by Scott Chacon and Ben Straub.
- **docs.github.com** covers everything about GitHub itself.

```fact
Git also has the "Git guides". Run `git help -g` in a real terminal to list them. `git help everyday` is a list of the 20 commands most people need.
```

```quiz
q: You only want a quick list of the options for git log. What do you run?
- git help log
- [x] git log -h
- git log --version
why: -h prints a short summary. git help log opens the long manual.

q: A Git command fails with a "hint:" line. What should you do first?
- Delete the repository and clone again
- [x] Read the hint, because it usually names the next command
- Run the same command with --force
why: Git's hints are written for exactly this moment. --force is almost never the first answer.
```

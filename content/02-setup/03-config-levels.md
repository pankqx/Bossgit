---
title: "Config levels: system, global and local"
minutes: 7
setup: mkdir work-project && cd work-project && git init -q
---

Git reads settings from three places. Each one is more specific than the one before it, and **the most specific one wins**.

| Level | Flag | Where it lives | Used for |
|---|---|---|---|
| System | `--system` | `/etc/gitconfig` | Every user on this computer |
| Global | `--global` | `~/.gitconfig` | You, in every repository |
| Local | `--local` (the default) | `.git/config` in one repo | Only this repository |

```flow
flowchart LR
  S[system] --> G[global] --> L[local] --> W((Value Git uses))
```

## See where a value comes from

```try
git config --list
git config user.name
```

In a real terminal, `git config --list --show-origin` prints the file next to each value. It is the first command to run when Git is "using the wrong name".

## A different email for one repository

This is the most common real use. You commit to work projects with your work email and to your own projects with your personal email.

```try
git config user.email "pank@company.dev"
git config user.email
git config --global user.email
```

The first line had no `--global`, so it only wrote to this repository's `.git/config`. Your global email did not change.

```tip
Remove a setting with `git config --unset user.email`. Add `--global` to remove it from the global file.
```

```warn
Commits made with the wrong email are not linked to your GitHub account. They do not count on your contribution graph. Always check `git config user.email` in a new repository.
```

```quiz
q: The global file says your email is a@home.dev. The local file says b@work.dev. Which email does a commit in this repo use?
- a@home.dev
- [x] b@work.dev
- Git asks you every time
why: The local level is the most specific, so it wins inside that repository.

q: Where is the global config file?
- .git/config
- [x] ~/.gitconfig in your home folder
- /etc/gitconfig
why: Global means "for you, everywhere", so it lives in your home folder.
```

```mission
title: The work identity
goal: This is a work repository. Set the email **for this repository only** to `pank@company.dev`. Do not change the global email.
setup: mkdir work-project && cd work-project && git init -q
check: config user.email pank@company.dev
check: run git config --global user.email => learner@bossgit.dev
hint: Leave out --global. That writes to the local file.
hint: git config user.email "pank@company.dev"
solve: git config user.email "pank@company.dev"
```

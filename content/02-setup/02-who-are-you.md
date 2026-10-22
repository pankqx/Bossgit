---
title: Tell Git who you are
minutes: 7
setup: bossgit identity off && mkdir project && cd project && git init -q && echo "hello" > hello.txt && git add hello.txt
---

Every commit records **who** made it: a name and an email. Git will refuse to commit until you tell it. The lab is set up like a brand new computer, so let's see:

```try
git commit -m "My first commit"
```

Git stopped you, and told you exactly what to do. You set your identity once per computer with `git config --global`:

```try
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Use your real name (or the name you want people to see), and your real email. Now the commit works:

```try
git commit -m "My first commit"
git log
```

Your name and email are in the commit forever.

## Why your email really matters

On GitHub, the green squares on your profile (the **contribution graph**) count a commit **only if its email matches an email on your GitHub account**. If you commit with the wrong email, your work is real but your graph stays grey.

```warn
Never use a made-up email like `you@example.com` for real work. Use the email you signed up to GitHub with, or GitHub's private address that looks like `12345+username@users.noreply.github.com`. You can find it in GitHub under **Settings → Emails**.
```

## Check your settings

```try
git config user.name
git config --list
```

`--global` saves the setting for every repository on this computer. Without `--global`, a setting applies only to the repository you are in. That is handy if you use a work email for one project.

```quiz
q: Your commits do not show up as green squares on GitHub. What is the most likely reason?
- GitHub is broken
- You did not push hard enough
- [x] The email in your commits is not on your GitHub account
why: GitHub matches commits to you by email. Check `git config user.email` and compare it with GitHub's email settings.

q: What does `--global` mean in `git config --global user.name`?
- The name is visible to the whole world
- [x] The setting is used by every repository on this computer
- The setting is sent to GitHub
why: Global means all repositories for your user on this computer. Local settings override it in one repository.
```

```mission
title: The Gatekeeper
boss: true
goal: This computer has no identity set, and a file is waiting to be committed. Set a name and an email for Git, then make a commit with any message.
setup: bossgit identity off && mkdir project && cd project && git init -q && echo "hello" > hello.txt && git add hello.txt
check: config user.name
check: config user.email
check: commits 1
hint: git config --global user.name "Your Name"
hint: git config --global user.email "you@example.com"
hint: git commit -m "First commit"
```

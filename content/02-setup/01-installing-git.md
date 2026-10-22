---
title: Installing Git on your computer
minutes: 6
---

The lab in this course already has Git. But you will want it on your own computer too, so let's install it now. It takes five minutes.

## Windows

1. Go to **git-scm.com** and click **Download for Windows**.
2. Run the installer. The default answers are fine. When it asks about the default branch name, choose **main**.
3. Open the new program called **Git Bash**. It is a terminal that understands every command in this course.

## macOS

1. Open the **Terminal** app (press Cmd + Space and type "Terminal").
2. Type `git --version` and press Enter.
3. If Git is not installed, macOS offers to install the developer tools. Say yes.

## Linux (Ubuntu, Debian)

```bash
sudo apt update
sudo apt install git
```

## Check it worked

On any system, open a terminal and type:

```try
git --version
```

You should see something like `git version 2.47.0`. The exact number does not matter much.

```tip
On Windows, use **Git Bash** for this course, not the old Command Prompt. Commands like `ls`, `touch` and `cat` only work in Git Bash.
```

```quiz
q: Which command checks whether Git is installed?
- git install
- [x] git --version
- git check
why: If Git answers with a version number, it is installed and working.
```

---
title: Git is not GitHub
minutes: 5
---

These two names confuse almost everyone at first. They are different things.

| | Git | GitHub |
|---|---|---|
| What it is | A **program** | A **website** |
| Where it runs | On your computer | On the internet |
| Made by | Linus Torvalds, 2005 | A company, 2008 (now part of Microsoft) |
| Needs internet? | No | Yes |
| Does what | Keeps the history of your project | Stores copies of Git projects online so people can share and work together |

Think of **Git** as a camera and **GitHub** as Instagram. The camera takes the photos. Instagram is where you share them. You can use the camera without ever posting, and there are other sites besides Instagram (GitLab and Bitbucket do the same job as GitHub).

## Distributed means everyone has everything

When you download a project from GitHub, you don't get just the latest files. You get the **whole history**, every commit ever made. Your copy is complete. If GitHub disappeared tomorrow, every developer's computer would still have the full project.

This is called **distributed** version control. Older systems kept the history on one central server, and if it died, the history died with it.

```flow
flowchart TB
  G[("GitHub (a copy)")]
  A["Your laptop (a full copy)"]
  B["Friend's laptop (a full copy)"]
  A <-->|push / pull| G
  B <-->|push / pull| G
```

## The plan for this course

You will learn **Git first**, on your own computer (well, in this browser). Then, from module 10, you will connect to **GitHub** and learn to work with other people: pull requests, reviews, issues and Actions. Learning in this order is easier, because GitHub only makes sense once Git does.

```quiz
q: Can you use Git without GitHub?
- [x] Yes, Git works completely on your own computer
- No, Git needs a GitHub account
why: Git is a program. GitHub is one of several websites that host Git repositories.

q: You clone a project from GitHub. What do you get?
- Only the newest files
- [x] All the files and the complete history
- A link to the files online
why: That is what distributed means. Every clone is a complete copy.
```

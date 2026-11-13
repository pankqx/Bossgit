---
title: Centralized and distributed version control
minutes: 6
---

Before Git, most teams used **centralized** tools like CVS and Subversion (SVN). There was one server with the history. Your computer only had the latest files. To see an old version, or to save a commit, you had to be online and talk to that server.

Git is **distributed**. When you clone a repository, you get the **whole history**, every commit ever made, on your own laptop.

```flow
flowchart LR
  subgraph Centralized
    S[(Server: all history)] --- A1[Laptop: files only]
    S --- B1[Laptop: files only]
  end
  subgraph Distributed
    G[(GitHub: full copy)] --- A2[(Laptop: full copy)]
    G --- B2[(Laptop: full copy)]
  end
```

## Why this matters every day

- **You can work offline.** Commit on a train, read the log on a plane. Only `push`, `pull` and `fetch` need the network.
- **It is fast.** `git log` reads your disk, not a server far away.
- **Every clone is a backup.** If GitHub went down forever, any teammate's laptop could rebuild the project.
- **Branches are cheap.** Making a branch is writing one tiny file, so people make many.

```story
In 2005 the Linux kernel team lost free access to BitKeeper, the tool they used. Linus Torvalds wrote the first version of Git in about ten days. His goals were speed, a distributed design, and strong protection against corrupted history. Twenty years later almost every software company on Earth uses it.
```

```fact
"Distributed" does not mean "no server". Teams still agree that one copy, usually on GitHub, is the official one. That is a habit the team chooses, not a rule built into Git.
```

```quiz
q: Which of these needs a network connection in Git?
- git commit
- git log
- [x] git push
why: commit and log only use your local copy. push sends commits to another computer.

q: GitHub deletes your repository by mistake. What can still save the project?
- Nothing, the history is gone
- [x] Any full clone on a teammate's laptop
- Only a backup made by GitHub
why: Every clone holds the full history, so any clone can be pushed to a new remote.
```

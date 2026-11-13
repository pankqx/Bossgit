# BossGit capstone: reference code

This folder holds the reference solution for module 29, **Build your own Git and GitHub**. Write your own version first, then compare.

| Folder | What it is | Run it |
|---|---|---|
| `minigit/` | A small Git in Node.js with no libraries. It writes real Git objects, so `git fsck` and `git log` accept its repositories. | `node minigit/minigit.mjs init` |
| `minihub/` | A tiny GitHub. It hosts bare repositories, speaks Git's smart HTTP protocol (clone, fetch, push), shows files and commits, and merges pull requests on the server with `git merge-tree`. | `node minihub/server.mjs`, then open http://localhost:3000 |

Needs Node 20+ and Git 2.38+.

minigit commands: `init`, `hash-object [-w]`, `cat-file -t|-p`, `add`, `write-tree`, `commit -m`, `log`, `branch`, `switch`, `status`.

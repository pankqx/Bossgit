---
title: Loose objects vs packfiles
minutes: 7
---

When you commit, Git writes each new object as its own small, zlib-compressed file:

```
.git/objects/ce/013625030ba8dba906f756967f9e9ca394464a
             ^^ first 2 characters of the id = folder
                ^^^^^^ the other 38 = file name
```

These are **loose objects**. Simple and fast to write, but a repo with 300,000 of them wastes disk and is slow to transfer.

So from time to time Git **packs** them: it writes one big **packfile** (`.git/objects/pack/pack-<id>.pack`) plus an **index** (`.idx`) that says where each object starts inside it.

```bash
git count-objects -v          # count: loose objects, in-pack: packed objects, size-pack: KB
git gc                        # pack loose objects (also runs automatically)
git verify-pack -v .git/objects/pack/pack-*.idx | sort -k3 -n | tail -5   # the 5 biggest objects
ls .git/objects/pack/
```

## When packing happens

- `git gc --auto` runs after many commands when there are more than about **6,700** loose objects (`gc.auto`) or more than 50 packs.
- `git push` and `git fetch` always send packs, never loose objects.
- `git maintenance` can repack in the background.

```fact
The `verify-pack` trick above is how people find "what is making my repo 2 GB?" Pipe the ids into `git rev-list --objects --all | grep <id>` to get the file name.
```

```quiz
q: Where does Git store a brand-new blob right after git add?
- In a packfile
- [x] As a loose object in .git/objects/xx/
why: New objects start loose and are packed later.

q: What does the .idx file next to a .pack do?
- Holds commit messages
- [x] Lets Git find any object inside the pack quickly
why: It maps object ids to offsets in the pack.
```

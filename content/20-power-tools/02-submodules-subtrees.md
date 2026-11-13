---
title: Submodules and subtrees
minutes: 9
---

Sometimes one repository needs another inside it: a shared design system, a firmware library, a theme. Git has two ways.

## Submodules: a pointer to another repo

A submodule records **a URL and one exact commit** of another repository, inside a folder of yours.

```bash
git submodule add https://github.com/acme/ui-kit libs/ui-kit
git commit -m "Add ui-kit as a submodule"
# a .gitmodules file is created, and libs/ui-kit is stored as a commit id

git clone --recurse-submodules https://github.com/acme/shop    # clone with submodules
git submodule update --init --recursive                        # if you forgot
git submodule update --remote libs/ui-kit                      # move to the submodule's newest commit
git config --global submodule.recurse true                     # pull and switch update submodules too
```

**Good:** the code is shared exactly, pinned to a version. **Bad:** everyone must remember the extra commands. Forgetting `--recurse-submodules` gives an empty folder, and updating needs a commit in both repos.

## Subtrees: copy the other repo's history in

```bash
git subtree add --prefix=libs/ui-kit https://github.com/acme/ui-kit main --squash
git subtree pull --prefix=libs/ui-kit https://github.com/acme/ui-kit main --squash
git subtree push --prefix=libs/ui-kit https://github.com/acme/ui-kit fix-from-shop
```

The files become **normal files** in your repo. Clones just work. Updating and sending changes back is more manual.

| | Submodule | Subtree |
|---|---|---|
| Stored as | URL + commit id | real files (and optionally history) |
| Clone needs extra steps | yes | no |
| Best for | large, separately released dependencies | small shared code you rarely update |

```tip
Before either, ask: can this be a **package** (npm, PyPI, Maven) instead? Versioned packages are usually the simplest way to share code between repos. Or use a **monorepo** (module 22).
```

```quiz
q: A teammate clones your repo and libs/ui-kit is an empty folder. Why?
- The submodule was deleted
- [x] They cloned without --recurse-submodules
why: Submodule contents are fetched separately. Run git submodule update --init --recursive.

q: What does a submodule store in the parent repository?
- All of its files
- [x] The URL and one exact commit id
why: The parent only pins which commit of the other repo to use.
```

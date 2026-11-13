---
title: "Part 8: ship it like a professional team"
minutes: 25
setup: mkdir minigit && cd minigit && git init -q && echo "# minigit" > README.md && git add . && git commit -q -m "chore: start"
---

Code that only runs on your laptop is a hobby. Code that is **documented, tested, released and maintained** is a product. Use everything from modules 10 to 28.

## The checklist

| Area | Done when |
|---|---|
| README | what it is, a GIF demo, install, usage, how it works, limits, license |
| Docs | `docs/architecture.md` with a diagram of objects → index → commits → refs → server |
| Tests | `node --test` covers objects, trees, commits, switch, and real-Git compatibility |
| CI | matrix on Linux, macOS, Windows; required check on `main` |
| Rules | ruleset on main: PR required, CI required, no force push |
| Commits | Conventional Commits, atomic, squash merged |
| Releases | `v1.0.0` tag, GitHub Release with notes, `CHANGELOG.md` |
| Community | `CONTRIBUTING.md`, `SECURITY.md`, issue forms, `good first issue` labels |
| Security | Dependabot for Actions, actions pinned, `permissions: contents: read` |
| Demo | MiniHub screenshots; optional deploy to a free VM, with auth turned on |

## The release

```try
echo "MIT License" > LICENSE
git add . && git commit -m "docs: add license"
git tag -a v1.0.0 -m "minigit and MiniHub 1.0.0"
git log --oneline --decorate
```

```bash
git push --follow-tags
gh release create v1.0.0 --generate-notes
```

## Write the story

Publish a post: **"I built Git and GitHub from scratch in 500 lines"**. Cover what a commit really is, the tree sort bug you hit, how `merge-tree` made the server merge possible. Link the repo. Engineers love these posts, and so do hiring managers.

```quiz
q: Which file explains how to contribute to your project?
- README.md
- [x] CONTRIBUTING.md
why: GitHub links it on new issues and pull requests.

q: What protects main from untested merges?
- A README note
- [x] A ruleset requiring a pull request and a passing CI check
why: Rules make the process automatic instead of a promise.
```

```mission
title: Release 1.0.0
goal: Add a `LICENSE` file that contains `MIT`, commit it with a Conventional Commit message starting `docs`, and tag the commit with an **annotated** tag `v1.0.0`.
setup: mkdir minigit && cd minigit && git init -q && echo "# minigit" > README.md && git add . && git commit -q -m "chore: start"
check: tracked LICENSE
check: contains LICENSE MIT
check: message docs
check: tag v1.0.0
check: same v1.0.0 HEAD
check: run git cat-file -t v1.0.0 => tag
solve: echo "MIT License" > LICENSE
solve: git add .
solve: git commit -m "docs: add license"
solve: git tag -a v1.0.0 -m "1.0.0"
```

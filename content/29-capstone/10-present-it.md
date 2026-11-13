---
title: "Part 9: present it, and what you can now say"
minutes: 15
setup: bossgit github https://github.com/you/minihub && mkdir minihub && cd minihub && git init -q && echo "# MiniHub" > README.md && git add . && git commit -q -m "chore: start" && git remote add origin https://github.com/you/minihub && git push -q -u origin main
---

## The 60-second interview pitch

> "I built minigit, a Git implementation in about 250 lines of Node with no libraries. It writes real Git objects, so `git fsck` and `git log` accept its repositories, and that compatibility is my test suite in CI on three operating systems. Then I built MiniHub, a small Git host: it serves clone and push over smart HTTP through `git http-backend`, shows files and history, and merges pull requests on the server with `git merge-tree` and a compare-and-swap `update-ref`, the same approach GitHub uses. The hardest bug was Git's tree sort order for folders."

## Questions you can now answer from experience

- What exactly is in a commit? Why do rebased commits get new ids?
- How does `git status` know what changed?
- What happens on the network during `git push`?
- How does a merge button work without a working folder?
- How would you stop two merges racing each other?
- How would you secure a Git server?

## What you have now

| Before BossGit | Now |
|---|---|
| "I use add, commit, push." | You know the object model down to the bytes. |
| Afraid of rebase and reset | You choose merge or rebase on purpose, and can recover from anything with the reflog. |
| GitHub is a website | You know PRs, reviews, rules, Actions, OIDC, Apps and webhooks, and built a mini version. |
| Solo commits | You work like a senior on a team: atomic commits, small PRs, CI, releases, security. |

```mission
title: Ship MiniHub
boss: true
goal: Finish the release on a feature branch, the professional way. Create branch `feat/pulls`, commit a file `pulls.js`, push the branch to `origin` with upstream, switch back to `main`, merge it with a **merge commit** (`--no-ff`), tag `main` as annotated `v1.0.0`, and push `main`.
setup: bossgit github https://github.com/you/minihub && mkdir minihub && cd minihub && git init -q && echo "# MiniHub" > README.md && git add . && git commit -q -m "chore: start" && git remote add origin https://github.com/you/minihub && git push -q -u origin main
check: branch feat/pulls
check: pushed feat/pulls
check: head main
check: merged feat/pulls
check: parents 2
check: tag v1.0.0
check: same v1.0.0 main
check: pushed main
hint: git switch -c feat/pulls, commit pulls.js, git push -u origin feat/pulls
hint: git switch main, git merge --no-ff feat/pulls
hint: git tag -a v1.0.0 -m "1.0.0", git push
solve: git switch -c feat/pulls
solve: echo "pulls" > pulls.js
solve: git add .
solve: git commit -m "feat: pull requests"
solve: git push -u origin feat/pulls
solve: git switch main
solve: git merge --no-ff feat/pulls -m "Merge feat/pulls"
solve: git tag -a v1.0.0 -m "1.0.0"
solve: git push
```

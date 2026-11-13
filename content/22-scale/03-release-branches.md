---
title: Release branches and hotfixes
minutes: 8
setup: mkdir app && cd app && git init -q && echo "v1" > app.txt && git add . && git commit -q -m "feat: version 1" && git tag -a v1.0.0 -m "1.0.0" && echo "v2 work" > next.txt && git add . && git commit -q -m "feat: start version 2"
---

Web apps deploy `main` many times a day. But mobile apps, desktop apps, libraries and on-premise software ship **versions**, and customers stay on old versions for months. You must fix bugs in 1.x while 2.x is being built.

## Release branches

```flow
flowchart LR
  M1[main] --> M2[main: v2 work] --> M3[main]
  M1 --> R["release/1.x"] --> P1[v1.0.1 fix] --> P2[v1.0.2 fix]
  P1 -. cherry-pick to main .-> M3
```

```try
git switch -c release/1.x v1.0.0
echo "v1 + security fix" > app.txt
git commit -am "fix: security patch"
git tag -a v1.0.1 -m "1.0.1"
git switch main
git cherry-pick -x release/1.x
git log --oneline --graph --all
```

## Rules teams use

- Create `release/X.Y` when a version is feature complete. Only **fixes** go in.
- **Fix on main first, then cherry-pick** to the release branch (upstream first). This way no fix is ever forgotten in the next version. Google, Chromium and Kubernetes all work like this.
- Use `cherry-pick -x` so every backport points at its original.
- Protect release branches like main.
- Decide how many old versions you support, and write it in SECURITY.md.

```tip
GitHub Actions can automate backports: label a merged PR `backport release/1.x` and a bot opens the cherry-pick PR.
```

```quiz
q: Where should a bug fix usually land first?
- On the oldest release branch
- [x] On main, then cherry-picked to release branches
why: Fixing main first guarantees future versions have the fix.

q: Why use git cherry-pick -x for backports?
- It is faster
- [x] It records the original commit id in the message
why: Anyone can trace the backport to the original fix.
```

```mission
title: Patch the old version
goal: Customers on 1.0.0 need a fix. Create `release/1.x` from tag `v1.0.0`, commit a fix that changes `app.txt` to contain `patched`, and tag it `v1.0.1` (annotated). The fix must **not** include `next.txt`.
setup: mkdir app && cd app && git init -q && echo "v1" > app.txt && git add . && git commit -q -m "feat: version 1" && git tag -a v1.0.0 -m "1.0.0" && echo "v2 work" > next.txt && git add . && git commit -q -m "feat: start version 2"
check: branch release/1.x
check: tag v1.0.1
check: same v1.0.1 release/1.x
check: same release/1.x~1 v1.0.0
check: branchlacks release/1.x next.txt
check: run git show release/1.x:app.txt => patched
hint: git switch -c release/1.x v1.0.0
hint: echo "patched" > app.txt, commit, then git tag -a v1.0.1 -m "1.0.1"
solve: git switch -c release/1.x v1.0.0
solve: echo "patched" > app.txt
solve: git commit -am "fix: patch"
solve: git tag -a v1.0.1 -m "1.0.1"
```

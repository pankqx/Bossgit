---
title: "git revert: undo by adding a commit"
minutes: 8
setup: mkdir app && cd app && git init -q && echo "theme=light" > settings.txt && git add . && git commit -q -m "Add settings" && echo "theme=neon-pink" > settings.txt && git commit -q -am "Try a bold theme" && echo "lang=en" > lang.txt && git add . && git commit -q -m "Add language"
---

The bold theme went live and users hate it. It was pushed days ago and three people built on top of it. You cannot rewrite history. You **revert** it.

```try
git log --oneline
git revert HEAD~1
git log --oneline
cat settings.txt
```

`git revert` makes a **new commit** that does the opposite of an old one. If the old commit added a line, the revert removes it. History keeps both: what happened, and that it was undone.

```flow
flowchart LR
  A[Add settings] --> B[Try a bold theme] --> C[Add language] --> D["Revert 'Try a bold theme'"]
```

## Revert vs reset

| | `git revert` | `git reset` |
|---|---|---|
| History | Adds a commit, keeps everything | Moves the branch back, drops commits |
| Safe on pushed branches? | **Yes** | No |
| Typical use | Undo something already on `main` | Clean up your own local commits |

```tip
On GitHub, every merged pull request has a **Revert** button. It opens a new pull request that reverts the whole merge. This is how teams roll back a bad release in minutes.
```

```bash
git revert --no-edit HEAD     # use the default message
git revert -n HEAD~2 HEAD~1   # revert several, then commit them together yourself
git revert -m 1 <merge-id>    # revert a merge commit, keeping parent 1 (the main line)
```

```warn
If later commits changed the same lines, a revert can **conflict**, just like a merge. Fix the file, `git add` it, then `git revert --continue`.
```

```quiz
q: Which undo is safe for a commit that is already on the shared main branch?
- git reset --hard
- git commit --amend
- [x] git revert
why: revert adds history instead of removing it, so nobody else's copy breaks.

q: After git revert, how many commits are in history compared to before?
- One fewer
- The same
- [x] One more
why: revert records the undo as a brand new commit.
```

```mission
title: Roll back the release
goal: The commit `Change the price to 99` broke the shop. It is already pushed. Undo it **without removing any commit** from history.
setup: mkdir shop && cd shop && git init -q && echo "price=10" > price.txt && git add . && git commit -q -m "Set price" && echo "price=99" > price.txt && git commit -q -am "Change the price to 99" && echo "sale!" > banner.txt && git add . && git commit -q -m "Add banner"
check: contains price.txt price=10
check: file banner.txt
check: exactcommits 4
check: message Revert
hint: The bad commit is HEAD~1.
hint: git revert HEAD~1
solve: git revert HEAD~1
```

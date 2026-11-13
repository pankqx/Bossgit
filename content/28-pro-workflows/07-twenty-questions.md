---
title: Twenty Git questions interviewers love
minutes: 15
---

Short, accurate answers to the questions that come up again and again. Say them in your own words.

1. **Git vs GitHub?** Git is a distributed version control tool on your machine. GitHub is a hosting service built around Git, adding PRs, issues, Actions and permissions.
2. **What is a commit?** A snapshot of the whole project (a tree), with parent(s), author, committer and message, identified by a hash of all of that.
3. **What are the three areas?** Working folder, staging area (index), repository.
4. **`git fetch` vs `git pull`?** Fetch downloads and updates remote-tracking branches only. Pull is fetch plus merge (or rebase).
5. **Merge vs rebase?** Merge joins histories with a merge commit and keeps them true. Rebase replays your commits on a new base for a linear history, creating new commits. Never rebase shared history.
6. **What is a fast-forward?** When the target has not moved, the branch pointer just moves forward. No merge commit.
7. **`reset` vs `revert`?** Reset moves the branch (rewrites local history). Revert adds a new commit that undoes an old one (safe on shared branches).
8. **soft, mixed, hard?** All move the branch. Soft keeps staging and files; mixed resets staging; hard resets staging and files.
9. **What is HEAD? Detached HEAD?** HEAD points to the current branch. Detached means it points straight at a commit.
10. **How do you resolve a conflict?** Open the files, choose the right content, remove the markers, `git add`, then commit or `--continue`. Use `zdiff3` to see the base.
11. **How do you undo a pushed commit?** `git revert <id>` and push.
12. **How do you recover a deleted branch or lost commit?** `git reflog`, then `git branch name <id>`.
13. **What does `git stash` do?** Saves uncommitted changes on a stack and cleans the working folder. `-u` for untracked files.
14. **`cherry-pick`?** Copies one commit's change onto the current branch as a new commit.
15. **How do you find which commit introduced a bug?** `git bisect` (binary search), or `git log -S` if you know the text.
16. **What is `.gitignore` and how do you stop tracking a committed file?** Ignore rules for untracked files. Use `git rm --cached file` plus the rule.
17. **`--force` vs `--force-with-lease`?** Lease refuses to overwrite commits on the remote that you have not seen.
18. **How do you squash commits?** `git rebase -i` with `squash`/`fixup`, or `git reset --soft` and recommit, or squash-merge the PR.
19. **What is a remote and origin?** A named URL of another copy of the repo. `origin` is the default for where you cloned from.
20. **How does Git store data?** As content-addressed objects (blobs, trees, commits, tags) in `.git/objects`, packed with delta compression; branches are refs that point at commits.

```tip
For senior roles, expect follow-ups: "How would you set up branching and CI for a 50-person team?", "How do you remove a secret from history?", "Explain what happens during git push." Modules 13, 17, 19 and 25 are your answers.
```

```quiz
q: An interviewer asks how to undo a commit that is already on main. Best answer?
- git reset --hard HEAD~1 and force push
- [x] git revert the commit and push, because main is shared
why: Reverting keeps everyone's history valid.

q: What is a commit, precisely?
- A diff of changed lines
- [x] A snapshot (tree) plus parent(s), author, committer and message, named by its hash
why: Git stores snapshots; diffs are computed on demand.

q: How do you recover a branch you deleted by mistake?
- You cannot
- [x] Find its last commit in git reflog and run git branch NAME ID
why: The commits are still there; only the name was removed.
```

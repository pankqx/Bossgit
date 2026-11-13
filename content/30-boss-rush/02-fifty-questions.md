---
title: Fifty interview questions
minutes: 30
---

Lesson 28.7 covered the twenty classics. These thirty go deeper, the kind asked for senior and platform roles. Try to answer each **out loud** before reading the answer.

## Internals

21. **Why does a rebased commit get a new id?** The id hashes the commit's content, which includes its parent id and tree. New parent, new id.
22. **What is the index?** A binary file listing every tracked path with its blob id, mode and stat data; it is the next commit's tree, prepared.
23. **What is a packfile?** A file holding many objects, delta-compressed, with an `.idx` for lookup. Used for storage and for network transfer.
24. **What does `git gc` delete?** Unreachable objects older than the prune expiry, after expiring old reflog entries. Reachable history is never deleted.
25. **What is a dangling commit?** A commit no ref or reflog entry points to, usually from an amend or deleted branch.
26. **How does Git detect renames?** It does not record them. It compares deleted and added files by content similarity when showing diffs.
27. **SHA-1 risks?** Collisions are possible in theory; Git uses collision-detecting SHA-1 and supports SHA-256 repositories.
28. **What happens in `git push` on the wire?** Ref discovery, the client computes missing objects, sends a pack, then requests ref updates; the server rejects non-fast-forwards.

## Collaboration at scale

29. **How would you set up branching for 50 engineers?** Trunk-based or GitHub Flow, short branches, required reviews and CI, CODEOWNERS, merge queue, feature flags, release branches only if versions must be supported.
30. **What is a merge queue?** It tests each PR merged on top of the ones ahead of it before merging, so main never breaks from untested combinations.
31. **Squash vs merge vs rebase merge?** Squash: one commit per PR, clean main. Merge commit: full history, easy whole-PR revert. Rebase: linear history of the PR's commits.
32. **Why are long-lived branches risky?** Divergence grows over time, so conflicts and integration bugs grow; feedback comes late.
33. **What are stacked PRs?** A chain of small dependent PRs, each based on the previous branch; rebased together with `--update-refs`.
34. **How do CODEOWNERS and rulesets work together?** CODEOWNERS requests reviews; a ruleset with "require code owner review" enforces them.
35. **How do you keep a monorepo fast?** Sparse checkout, partial clone, fsmonitor, commit-graph, maintenance, and build tools that run only affected targets.

## Recovery and security

36. **A secret was pushed. Steps?** Rotate it immediately, remove it from history (filter-repo), force-push, ask everyone to re-clone, check logs for misuse, enable push protection.
37. **Someone force-pushed over main. Recover?** Find the old tip in any clone's reflog or the PR/branch events, push it back with lease, then protect the branch.
38. **How do you prove a commit is from you?** Sign it (SSH, GPG or Sigstore) and add the key to GitHub; enable vigilant mode.
39. **Why pin Actions to a SHA?** Tags can be moved to malicious code; a commit SHA cannot change.
40. **What is OIDC in CI?** Workflows get short-lived signed identity tokens and exchange them for temporary cloud credentials, so no long-lived keys are stored.
41. **Why is `pull_request_target` dangerous?** It runs with write permissions and secrets; checking out and running PR code there lets anyone steal them.

## Practical commands

42. **Find who changed a line and why?** `git blame -w -C`, then `git show` the commit and read its PR.
43. **Find when a string was removed?** `git log -S "text"`.
44. **Compare two versions of a rebased PR?** `git range-diff`.
45. **Work on two branches at once?** `git worktree add`.
46. **Undo a merge commit already pushed?** `git revert -m 1 <merge>`.
47. **List branches merged into main?** `git branch --merged main`.
48. **Apply one commit from another branch?** `git cherry-pick -x <id>`.
49. **Stop tracking a file but keep it?** `git rm --cached file` and add it to `.gitignore`.
50. **Make Git remember conflict resolutions?** `git config rerere.enabled true`.

```quiz
q: Your answer to "how to undo a pushed merge commit"?
- git reset --hard HEAD~1
- [x] git revert -m 1 <merge-commit>
why: -m 1 keeps the main line as the parent to revert to, and revert is safe on shared history.

q: Best first step after pushing a secret?
- Make the repo private
- [x] Rotate the secret
why: Assume it was copied the moment it was pushed.

q: Which command compares an old and a new version of a rebased branch, commit by commit?
- git diff
- [x] git range-diff
why: range-diff pairs up commits from both series and shows how each changed.
```

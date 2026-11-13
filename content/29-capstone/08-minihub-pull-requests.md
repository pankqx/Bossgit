---
title: "Part 7: pull requests and the merge button"
minutes: 30
---

On GitHub, a pull request is mostly **a comparison of two branches** plus a discussion. The merge button then does a merge **on the server**, where there is no working folder.

## Listing open pull requests

Any branch with commits that `main` does not have is a candidate:

```js
const open = branches(repo).filter(b =>
  b !== 'main' && Number(git(repo, 'rev-list', '--count', `main..${b}`)) > 0)
```

## The compare page

```js
git(repo, 'log', '--format=%h %s', `main..${head}`)      // the commits in the PR
git(repo, 'diff', `main...${head}`)                      // three dots: changes since the branch split
```

Three dots matters. `main...feature` shows only what the **feature** changed, even if `main` moved on since. That is what GitHub's "Files changed" tab shows.

## Merging without a working folder

Since Git 2.38, `git merge-tree --write-tree` does a full three-way merge (the same **ort** engine as `git merge`) **in memory**, and prints the resulting tree, or the conflicts. GitHub switched its merge button to this same machinery.

```js
function merge(repo, base, head) {
  const baseId = git(repo, 'rev-parse', `refs/heads/${base}`).trim()
  const headId = git(repo, 'rev-parse', `refs/heads/${head}`).trim()
  let tree
  try {
    tree = git(repo, 'merge-tree', '--write-tree', baseId, headId).split('\n')[0].trim()
  } catch (e) {
    return { ok: false, msg: 'Conflicts:\n' + e.stdout }          // exit code 1 = conflicts
  }
  const commit = git(repo, 'commit-tree', tree, '-p', baseId, '-p', headId, '-m', `Merge branch '${head}' into ${base}`).trim()
  git(repo, 'update-ref', `refs/heads/${base}`, commit, baseId)  // the 3rd argument = "only if base is still baseId"
  return { ok: true, msg: `Merged as ${commit.slice(0, 7)}` }
}
```

Look at what you used: `commit-tree` and `update-ref` are the **plumbing** commands from module 19. The last argument of `update-ref` is a **compare-and-swap**: if someone pushed to `main` a millisecond ago, the update fails instead of silently losing their commit. That is the same safety idea as `--force-with-lease`.

## Try the whole flow

```bash
git switch -c feat/search
echo "search" > search.js && git add . && git commit -m "feat: search"
git push hub feat/search
# open http://localhost:3000/shop/pulls → compare → Merge pull request
git switch main && git pull hub main
git log --oneline --graph         # your server's merge commit, with two parents
```

## Stretch goals (pick some, each is a great PR)

- **Squash merge**: `commit-tree` with only `-p baseId`.
- **Conflict view**: show the conflicted files from merge-tree's output.
- **Branch protection**: refuse merges unless a `ci-passed` file exists in the branch, or a test command passes.
- **Comments**: store PR comments in a JSON file per PR.
- **Webhooks**: POST a JSON payload to a URL after every push (`post-receive`) or merge.
- **Users and tokens**: HTTP basic auth checked against a users file, read vs write permission.
- **Syntax highlighting** and rendered Markdown READMEs.

```quiz
q: What does git merge-tree --write-tree give you?
- A merged working folder
- [x] The id of the merged tree, or a list of conflicts, without touching any files
why: It merges in memory, which is perfect for a server.

q: Why pass the old value as the 3rd argument to update-ref?
- To make it faster
- [x] So the update fails if the branch moved in the meantime, instead of losing commits
why: It is a compare-and-swap, the same idea as --force-with-lease.
```

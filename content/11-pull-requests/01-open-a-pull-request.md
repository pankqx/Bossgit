---
title: Branch, push, open a pull request
minutes: 10
setup: bossgit github https://github.com/team/shop && mkdir shop && cd shop && git init -q && echo "shop" > README.md && git add . && git commit -q -m "Start" && git remote add origin https://github.com/team/shop && git push -q -u origin main
---

In almost every company, nobody pushes straight to `main`. You push a **branch** and open a **pull request** (PR): a page on GitHub that says "please review these commits and merge them into main".

## The loop you will repeat thousands of times

```try
git switch -c feat/wishlist
echo "wishlist" > wishlist.html
git add . && git commit -m "feat: add a wishlist page"
git push -u origin feat/wishlist
```

GitHub prints a link like `https://github.com/team/shop/pull/new/feat/wishlist`. Open it, or click the yellow **Compare & pull request** banner on the repo page.

```flow
flowchart LR
  B[Branch] --> C[Commits] --> P[Push] --> PR[Open PR] --> R[Review + CI] --> M[Merge] --> D[Delete branch]
```

## Fill in the PR form

- **Base:** the branch to merge into (`main`). **Compare:** your branch.
- **Title:** what it does, short. "Add a wishlist page", not "Update".
- **Description:** why, what, how to test (next lesson).
- **Reviewers**, **assignee**, **labels**, and a linked issue.

## From the terminal

```bash
gh pr create --fill               # title and body from your commits
gh pr create --draft --reviewer riya --label feature
gh pr status                      # PRs that need you
gh pr checkout 42                 # get someone else's PR locally to test it
```

## Updating a PR

Push more commits to the **same branch**. The PR updates by itself. No need to open a new one.

```tip
Open the PR early, even before you are done, as a **draft** (lesson 4). Teammates can see the direction and stop you before you spend two days on the wrong idea.
```

```quiz
q: You need to change something after opening a PR. What do you do?
- Close it and open a new one
- [x] Push new commits to the same branch
why: A PR follows its branch. New commits appear in it automatically.

q: What is the "base" of a pull request?
- The branch with your changes
- [x] The branch your changes will be merged into
why: Base is the target, usually main. Compare (or head) is your branch.
```

```mission
title: Ready for review
goal: Make a branch `feat/search`, commit a file `search.html`, and push the branch to `origin` with upstream set, ready to open a pull request.
setup: bossgit github https://github.com/team/shop && mkdir shop && cd shop && git init -q && echo "shop" > README.md && git add . && git commit -q -m "Start" && git remote add origin https://github.com/team/shop && git push -q -u origin main
check: branch feat/search
check: branchhas feat/search search.html
check: pushed feat/search
check: branchlacks main search.html
hint: git switch -c feat/search
hint: Commit the file, then git push -u origin feat/search
solve: git switch -c feat/search
solve: echo "search" > search.html
solve: git add .
solve: git commit -m "feat: add search page"
solve: git push -u origin feat/search
```

---
title: Removing a secret from history
minutes: 10
setup: mkdir api && cd api && git init -q && echo "server" > server.js && git add . && git commit -q -m "Start" && echo "AWS_KEY=AKIAEXAMPLE123" > .env && git add . && git commit -q -m "Add config"
---

You committed an `.env` file with a real API key. Deleting the file in a new commit is **not enough**: the key is still in history, and anyone who clones can run `git show HEAD~1:.env`.

```try
git rm --cached .env
git commit -m "Remove .env"
git show HEAD~1:.env
```

See? Still there.

## Step 0, before anything else: rotate the key

```warn
If the commit was ever pushed, assume the secret is **stolen**. Bots scan public GitHub for keys within minutes. Go to the provider (AWS, Stripe, Google…), **revoke** the key and make a new one. Rewriting history comes second. It does not un-leak anything.
```

## If it was NOT pushed yet

Rewrite the local commits so the file never existed. For the last commit:

```bash
git rm --cached .env
echo ".env" >> .gitignore
git add .gitignore
git commit --amend --no-edit
```

For an older commit, use interactive rebase: mark the commit `edit`, remove the file, `git commit --amend`, `git rebase --continue`.

## If it WAS pushed

1. Rotate the secret (above).
2. Rewrite history with **git filter-repo** (next lesson) to remove the file from **every** commit.
3. Force-push all branches and tags.
4. Ask everyone to re-clone. Old clones still contain the secret.
5. On GitHub, contact Support to clear cached views and PR diffs if needed.

```tip
Turn on **push protection** (module 21). GitHub then blocks a push that contains a known secret format, before it ever leaves your laptop.
```

```quiz
q: You pushed an API key yesterday. What is the first thing to do?
- Rewrite history
- Make the repo private
- [x] Revoke and rotate the key at the provider
why: Once pushed, assume it is stolen. Rewriting history does not stop someone who already copied it.

q: You delete the secret file in a new commit. Is it safe?
- Yes
- [x] No, it is still in the earlier commit
why: Every old commit keeps its files. You must rewrite history to remove it.
```

```mission
title: Never happened
goal: The last commit added `.env` with a password, and it was **not pushed**. Make history look as if `.env` was never committed, but keep `server.js` and add a `.gitignore` that ignores `.env`. The file can stay on your disk.
setup: mkdir api && cd api && git init -q && echo "server" > server.js && git add . && git commit -q -m "Start" && echo "PASSWORD=hunter2" > .env && echo "routes" > routes.js && git add . && git commit -q -m "Add routes"
check: neverin .env
check: tracked routes.js
check: tracked .gitignore
check: contains .gitignore .env
check: exactcommits 2
check: clean
hint: git rm --cached .env
hint: echo ".env" > .gitignore and git add .gitignore
hint: git commit --amend --no-edit
solve: git rm --cached .env
solve: echo ".env" > .gitignore
solve: git add .gitignore
solve: git commit --amend --no-edit
```

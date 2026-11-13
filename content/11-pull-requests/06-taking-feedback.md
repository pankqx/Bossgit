---
title: Taking feedback without stress
minutes: 8
setup: bossgit github https://github.com/team/app && mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start" && git remote add origin https://github.com/team/app && git push -q -u origin main && git switch -q -c feat/price && echo "total = a + b" > price.js && git add . && git commit -q -m "feat: add price total" && git push -q -u origin feat/price
---

Your first PR at a new job will get 15 comments. That is normal. It is not a judgement of you. It is the team teaching you how they work.

## A calm routine

1. Read **all** the comments before changing anything.
2. Fix the clear ones. Reply "Done" or react with 👍 and **resolve** the conversation.
3. For anything you disagree with, ask a question or explain your reason **once**. If it is still unclear, talk on a call. Text is bad at tone.
4. Push the fixes and click **Re-request review** next to the reviewer's name.

## Push fixes: new commits or rewrite?

```try
echo "total = a + b + tax" > price.js
git commit -am "Add tax to the total"
git push
```

Adding commits is the simplest. Reviewers can click "changes since last review". If your team **squash merges**, these extra commits do not matter.

Some teams prefer you to keep a clean history and fold fixes into the original commits:

```bash
git commit --fixup=<commit-id>
git rebase -i --autosquash origin/main
git push --force-with-lease
```

```tip
Keep a private list of every comment you get more than once. After a month, you will not get them anymore. That list is how juniors become seniors fast.
```

```quiz
q: A reviewer's comment is unclear and you disagree. What is the best first step?
- Ignore it and merge
- [x] Ask a question or explain your reasoning once, then talk live if needed
why: Assume good intent and resolve it quickly together.

q: Why use --force-with-lease after squashing review fixes into earlier commits?
- [x] The branch history changed, so a normal push is rejected
- It is required for every push
why: Rewriting commits needs a force push; the lease makes it safe.
```

```mission
title: The Tough Reviewer
boss: true
goal: The reviewer says: "the total forgets tax, and please keep **one** commit". Change `price.js` to `total = a + b + tax`, fold it into the existing commit with **amend**, and update the PR branch on GitHub.
setup: bossgit github https://github.com/team/app && mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start" && git remote add origin https://github.com/team/app && git push -q -u origin main && git switch -q -c feat/price && echo "total = a + b" > price.js && git add . && git commit -q -m "feat: add price total" && git push -q -u origin feat/price
check: head feat/price
check: exactcommits 2
check: contains price.js tax
check: pushed feat/price
check: clean
hint: echo "total = a + b + tax" > price.js
hint: git commit -a --amend --no-edit
hint: git push --force-with-lease
solve: echo "total = a + b + tax" > price.js
solve: git commit -a --amend --no-edit
solve: git push --force-with-lease
```

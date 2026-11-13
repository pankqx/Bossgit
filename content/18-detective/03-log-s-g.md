---
title: Searching history with log -S and -G
minutes: 8
setup: mkdir shop && cd shop && git init -q && echo "const TAX = 0.18" > tax.js && git add . && git commit -q -m "Add tax" && echo "function total() {}" > cart.js && git add . && git commit -q -m "Add cart" && echo "const TAX = 0.12" > tax.js && git commit -q -am "Update config" && echo "const TAX = 0.12" > tax.js && echo "// TODO remove" >> tax.js && git commit -q -am "Notes"
---

"When did the tax rate become 0.12, and who did it?" The commit message says "Update config", which is useless. You need to search the **code** in history, not the messages.

## -S: the pickaxe

```try
git log --oneline -S "0.12"
git log --oneline -S "TAX"
```

`-S TEXT` keeps commits where the **number of times** TEXT appears changed: where it was added or removed. That is exactly "when did this appear or disappear?"

Notice `-S "TAX"` only shows "Add tax". Changing `0.18` to `0.12` did not change how many times the word TAX appears.

## -G: regular expressions on changed lines

```try
git log --oneline -G "TAX = 0\.1[0-9]"
```

`-G REGEX` keeps commits where any **added or removed line** matches. It catches edits that `-S` misses.

## Combine with -p to read the change

```try
git log -p -S "0.12"
```

## In a real terminal

```bash
git log -S "apiKey" --all             # search every branch
git log -S "login" -- src/auth/        # only in one folder
git log -L :calculateTotal:cart.js     # the history of ONE function
git log -L 10,30:cart.js               # the history of lines 10 to 30
git grep "TODO" v1.0                   # search the files of an old version
```

```tip
`git log -L :functionName:file` is a hidden gem. It shows every change to one function over time, with diffs. Perfect for "why does this function look like this?"
```

```quiz
q: Which finds the commit where the text "hunter2" was first added?
- git log --grep hunter2
- [x] git log -S hunter2
why: --grep searches messages. -S searches the code changes.

q: A value changed from 5 to 6 on a line containing LIMIT. Which finds that commit with "LIMIT"?
- -S LIMIT
- [x] -G LIMIT
why: The count of LIMIT did not change, so -S misses it. -G matches the changed lines.
```

```mission
title: Who set the rate?
goal: Find the commit that **introduced** `0.12` into `tax.js` and tag it `rate-change`.
setup: mkdir shop && cd shop && git init -q && echo "const TAX = 0.18" > tax.js && git add . && git commit -q -m "Add tax" && echo "function total() {}" > cart.js && git add . && git commit -q -m "Add cart" && echo "const TAX = 0.12" > tax.js && git commit -q -am "Update config" && echo "// notes" >> cart.js && git commit -q -am "Notes"
check: tag rate-change
check: same rate-change HEAD~1
hint: git log --oneline -S "0.12"
solve: git tag rate-change HEAD~1
```

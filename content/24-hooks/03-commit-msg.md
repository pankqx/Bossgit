---
title: "commit-msg: enforce Conventional Commits"
minutes: 6
---

The `commit-msg` hook receives **one argument**: the path to a file with the message. It can read the message, and reject it.

## A tiny hand-written version

```sh
#!/bin/sh
# .githooks/commit-msg
msg=$(head -1 "$1")
pattern='^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z0-9-]+\))?!?: .{1,72}$'
if ! echo "$msg" | grep -Eq "$pattern"; then
  echo "✗ Commit message must look like: feat(auth): add login"
  echo "  You wrote: $msg"
  exit 1
fi
```

## With commitlint (the usual tool)

```bash
npm i -D @commitlint/cli @commitlint/config-conventional
echo "export default { extends: ['@commitlint/config-conventional'] }" > commitlint.config.js
echo 'npx --no -- commitlint --edit "$1"' > .husky/commit-msg
```

```
⧗   input: added stuff
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]
```

## Bonus: prepare-commit-msg adds the ticket

```sh
#!/bin/sh
# branch feat/SHOP-123-cart  →  message starts with "SHOP-123: "
ticket=$(git rev-parse --abbrev-ref HEAD | grep -oE '[A-Z]+-[0-9]+')
[ -n "$ticket" ] && sed -i.bak "1s/^/$ticket: /" "$1"
```

```tip
If your team squash merges, the **PR title** becomes the commit on main. Check the PR title in CI too (for example with `amannn/action-semantic-pull-request`).
```

```quiz
q: What does the commit-msg hook receive?
- The diff
- [x] The path to a file containing the commit message
why: It reads that file, checks it, and can even edit it.

q: Message "Fixed bug" vs pattern feat|fix(...)?: ... Does it pass?
- Yes
- [x] No, it has no type prefix like fix:
why: Conventional Commits require the type and a colon.
```

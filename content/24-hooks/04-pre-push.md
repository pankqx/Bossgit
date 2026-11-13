---
title: "pre-push: run tests before you push"
minutes: 6
---

`pre-push` runs after you type `git push` and before anything is sent. It is the right place for **slower** checks than pre-commit, because you push far less often than you commit.

```sh
#!/bin/sh
# .githooks/pre-push
# stdin gives: <local ref> <local sha> <remote ref> <remote sha> for each ref being pushed
while read local_ref local_sha remote_ref remote_sha; do
  if [ "$remote_ref" = "refs/heads/main" ]; then
    echo "✗ Do not push straight to main. Open a pull request."
    exit 1
  fi
done

npm run typecheck && npm test -- --run || {
  echo "✗ Tests failed. Push cancelled."
  exit 1
}
```

## Good pre-push jobs

- Type check and unit tests (a minute or two at most).
- Block pushes to `main` or `release/*` from laptops.
- Block pushes that contain `WIP` or `fixup!` commits.
- Check for big files.

## Bad pre-push jobs

- The full end-to-end suite (that is CI's job).
- Anything that needs network access to slow services.

```quiz
q: Why put tests in pre-push rather than pre-commit?
- pre-commit cannot run tests
- [x] You push less often than you commit, so slower checks are acceptable there
why: Keep pre-commit fast; pre-push can take a little longer.

q: Where does a pre-push hook find which branches are being pushed?
- In the commit message
- [x] On standard input, one line per ref
why: Git writes local ref, local sha, remote ref and remote sha for each.
```

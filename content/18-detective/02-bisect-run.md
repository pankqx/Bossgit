---
title: git bisect run
minutes: 7
---

Answering "good" or "bad" by hand is boring. If you can write a **command** that tests a commit, Git can run the whole search alone.

```bash
git bisect start HEAD v2.3.0      # bad first, then good
git bisect run npm test           # or any script
git bisect reset
```

Git checks out the middle commit, runs the command, and reads the **exit code**:

| Exit code | Means |
|---|---|
| `0` | good |
| `1` to `127` (except 125) | bad |
| `125` | skip this commit (cannot test it) |
| `128` or more | stop the bisect |

## A focused test script

The whole test suite may fail for other reasons in old commits. Write a tiny script that checks **only your bug**:

```bash
#!/bin/sh
# test-add.sh
npm run build --silent || exit 125     # cannot build: skip this commit
node -e "process.exit(require('./dist/math').add(2,2) === 4 ? 0 : 1)"
```

```bash
chmod +x test-add.sh
git bisect run ./test-add.sh
```

```warn
Keep the script **outside** the repo (or untracked), because bisect checks out old commits where your new script does not exist.
```

```story
A web team noticed their page load time had doubled over two months, with 600 commits since. One engineer wrote a 10-line script that built the site and failed if the bundle was over 300 KB, then ran git bisect run. Nine builds later, Git pointed at a commit that imported a whole charting library for one tiny icon. The fix took five minutes.
```

```quiz
q: Your test script cannot build an old commit. Which exit code should it return?
- 0
- 1
- [x] 125
why: 125 tells bisect to skip that commit.

q: Why put the test script outside the repository?
- It runs faster
- [x] Bisect checks out old commits where the script may not exist
why: Untracked or external files are not touched when Git checks out commits.
```

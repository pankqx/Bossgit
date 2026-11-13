---
title: Semantic versioning
minutes: 6
---

Version numbers are a promise to the people who use your code. **Semantic Versioning** (SemVer, semver.org) is the promise almost everyone uses.

```
MAJOR.MINOR.PATCH        for example  2.4.1
```

| Bump | When | Example |
|---|---|---|
| **PATCH** | A bug fix. Nothing new, nothing broken. | 2.4.1 → 2.4.2 |
| **MINOR** | A new feature. Old code still works. | 2.4.2 → 2.5.0 |
| **MAJOR** | A **breaking change**. Users may need to change their code. | 2.5.0 → 3.0.0 |

When you bump one number, the ones to its right go back to 0.

## Extra labels

```
1.0.0-alpha.1    early, unstable
1.0.0-beta.2     feature complete, still testing
1.0.0-rc.1       release candidate: will ship unless a bug is found
1.0.0+build.45   build metadata (ignored when comparing versions)
```

## 0.x is special

Before 1.0.0, anything can change at any time. `0.4.0` to `0.5.0` may break things. Going to **1.0.0** means "the public API is stable now".

## Version ranges in package files

```
^2.4.1   any 2.x.x from 2.4.1 up   (allows MINOR and PATCH)
~2.4.1   any 2.4.x from 2.4.1 up   (allows PATCH only)
2.4.1    exactly this
```

```tip
Tag every release with a `v` and the version: `git tag -a v2.5.0 -m "..."`. Tools like GitHub Releases, Go modules and many CI pipelines expect this exact form.
```

```fact
Conventional Commits (module 13) let tools decide the bump for you: `fix:` means PATCH, `feat:` means MINOR, and `feat!:` or "BREAKING CHANGE" means MAJOR.
```

```quiz
q: You add a new optional feature that does not break anything. Current version 3.2.7. Next version?
- 3.2.8
- [x] 3.3.0
- 4.0.0
why: A new feature with no breaking change is a MINOR bump, and PATCH resets to 0.

q: You remove a function people use. Current version 3.3.0. Next version?
- 3.4.0
- [x] 4.0.0
- 3.3.1
why: Removing something users rely on is a breaking change: MAJOR.

q: What does ^1.4.0 allow?
- Only 1.4.0
- 1.4.x only
- [x] Any 1.x.x from 1.4.0 up, but not 2.0.0
why: The caret allows MINOR and PATCH updates within the same MAJOR.
```

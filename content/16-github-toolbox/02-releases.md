---
title: Releases and changelogs
minutes: 7
setup: mkdir app && cd app && git init -q && echo "v1" > app.txt && git add . && git commit -q -m "feat: first version" && echo "fix" >> app.txt && git commit -q -am "fix: crash on start" && echo "dark" >> app.txt && git commit -q -am "feat: dark mode"
---

A **tag** marks a commit. A **GitHub Release** is a page built on a tag: release notes, downloadable files (binaries, installers) and a "Latest" badge.

## Create one

```bash
git tag -a v1.1.0 -m "v1.1.0"
git push origin v1.1.0
gh release create v1.1.0 --generate-notes ./dist/app.zip
```

Or on GitHub: **Releases → Draft a new release**, pick the tag, click **Generate release notes**. GitHub lists every merged PR and new contributor since the last release. You can shape them with `.github/release.yml` (group by label: Features, Fixes).

## A changelog people read

A `CHANGELOG.md` in the repo (the format from **keepachangelog.com**):

```markdown
## [1.1.0] - 2026-11-13
### Added
- Dark mode (#42)
### Fixed
- Crash on start when no config file exists (#40)
```

```try
git log --oneline
git log --oneline --grep feat
git log --oneline --grep fix
```

With Conventional Commits, the changelog nearly writes itself. Tools like **release-please** open a "Release PR" that bumps the version and updates `CHANGELOG.md`. Merge it, and the tag and release are created (module 22).

```tip
Write release notes for **users**, not for developers: "You can now switch to dark mode in Settings", not "Refactor ThemeProvider".
```

```quiz
q: What is a GitHub Release built on?
- A branch
- [x] A tag
why: Each release points at a tag, which points at a commit.

q: Which button builds notes from merged PRs automatically?
- Publish
- [x] Generate release notes
why: GitHub collects the PRs and contributors since the previous tag.
```

```mission
title: Version 1.1.0
goal: Tag the current commit with an **annotated** tag `v1.1.0` (message `Dark mode release`), ready to become a GitHub Release.
setup: mkdir app && cd app && git init -q && echo "v1" > app.txt && git add . && git commit -q -m "feat: first version" && echo "dark" >> app.txt && git commit -q -am "feat: dark mode"
check: tag v1.1.0
check: same v1.1.0 HEAD
check: run git cat-file -t v1.1.0 => tag
solve: git tag -a v1.1.0 -m "Dark mode release"
```

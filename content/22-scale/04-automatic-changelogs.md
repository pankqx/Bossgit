---
title: Automatic changelogs and versions
minutes: 7
---

With Conventional Commits, a computer can decide the next version **and** write the changelog. Nobody argues about "is this 2.4 or 3.0?" again.

## release-please (by Google)

```yaml
# .github/workflows/release.yml
on:
  push:
    branches: [main]
permissions:
  contents: write
  pull-requests: write
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: googleapis/release-please-action@v4
        with:
          release-type: node
```

1. You merge PRs to main with titles like `feat: add wishlist` and `fix: rounding`.
2. release-please keeps **one open "Release PR"**: it bumps `package.json` to the right version and updates `CHANGELOG.md`.
3. When you are ready to ship, you **merge the Release PR**. It creates the tag and the GitHub Release.

## semantic-release

Releases **on every push** to main that contains a `feat` or `fix`, with no Release PR. Popular for npm libraries.

## Changesets

Popular in monorepos: each PR adds a small file in `.changeset/` that says which packages change and how (`patch`, `minor`, `major`), plus a human-written note.

| Tool | Release happens | Good for |
|---|---|---|
| release-please | when you merge the Release PR | apps and libraries that want control |
| semantic-release | automatically on every merge | libraries with frequent releases |
| Changesets | when you merge the version PR | monorepos with many packages |

```quiz
q: In release-please, what do you merge to ship a version?
- Every feature PR
- [x] The Release PR it keeps up to date
why: Merging the Release PR creates the tag and GitHub Release.

q: Since the last release there was one feat and two fix commits. Version was 3.1.4. What does the tool choose?
- 3.1.5
- [x] 3.2.0
- 4.0.0
why: The highest bump wins: a feat means MINOR.
```

---
title: Matrix builds
minutes: 7
---

Your library must work on Node 18, 20 and 22, on Linux and Windows. That is 6 combinations. A **matrix** runs the same job once for each, in parallel.

```yaml
jobs:
  test:
    strategy:
      fail-fast: false               # keep the others running if one fails
      max-parallel: 4
      matrix:
        os: [ubuntu-latest, windows-latest]
        node: [18, 20, 22]
        include:                     # add one extra combination
          - os: macos-latest
            node: 22
        exclude:                     # remove one
          - os: windows-latest
            node: 18
    runs-on: ${{ matrix.os }}
    name: Node ${{ matrix.node }} on ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - run: npm ci && npm test
```

2 × 3 = 6, plus 1 included, minus 1 excluded = **6 jobs**.

## When to use a matrix

- Libraries and CLIs that users run on many versions or systems.
- Databases: test against Postgres 15, 16 and 17.
- Splitting a slow test suite into **shards**: `matrix: { shard: [1, 2, 3, 4] }` and `npm test -- --shard=${{ matrix.shard }}/4`.

```tip
For an app that only runs on one server version, a matrix is waste. Test the version you deploy, and save minutes.
```

```quiz
q: A matrix has os: [ubuntu, windows] and python: ["3.11", "3.12", "3.13"]. How many jobs?
- 3
- 5
- [x] 6
why: Every combination: 2 times 3.

q: What does fail-fast: false do?
- Stops all jobs at the first failure
- [x] Lets the other combinations finish even if one fails
why: The default (true) cancels the rest when one fails.
```

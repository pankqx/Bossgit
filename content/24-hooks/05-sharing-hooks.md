---
title: "Sharing hooks with a team: core.hooksPath, Husky and pre-commit"
minutes: 8
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start"
---

`.git/hooks` is private to each clone. To share hooks, **commit them** in a normal folder and tell Git to look there.

## core.hooksPath (built into Git)

```try
mkdir .githooks
echo "#!/bin/sh" > .githooks/pre-commit
echo "npm run lint" >> .githooks/pre-commit
git config core.hooksPath .githooks
git add .githooks && git commit -m "chore: share git hooks"
git config core.hooksPath
```

On a real system also run `chmod +x .githooks/*`, and commit that (Git stores the executable bit). Each developer runs the `git config` line once, or a setup script does it.

## Husky (JavaScript projects)

```bash
npm install --save-dev husky
npx husky init                 # creates .husky/pre-commit and adds "prepare": "husky" to package.json
echo "npx lint-staged" > .husky/pre-commit
```

The `prepare` script runs on every `npm install`, so hooks are installed for every developer automatically. Husky works by setting `core.hooksPath` to `.husky/_`.

## pre-commit framework

`pre-commit install` once per clone, config committed in `.pre-commit-config.yaml` (lesson 2). Also has a free CI service, pre-commit.ci.

| | core.hooksPath | Husky | pre-commit |
|---|---|---|---|
| Needs | nothing | Node | Python |
| Auto-installs | no | yes, on npm install | no (`pre-commit install`) |
| Ready-made hooks | write your own | write your own | hundreds |

```quiz
q: How can a team share hooks without any extra tools?
- Commit .git/hooks
- [x] Commit a folder like .githooks and set core.hooksPath to it
why: .git is never committed, but hooksPath can point to any committed folder.

q: How does Husky install hooks for every developer?
- It emails them
- [x] Through the prepare script that runs on npm install
why: npm runs prepare automatically after installing dependencies.
```

---
title: "pre-commit: lint and format before every commit"
minutes: 8
---

The most useful hook: check only the files **you are about to commit**, and only quickly. Slow hooks get skipped.

## lint-staged (JavaScript projects)

```json
// package.json
{
  "lint-staged": {
    "*.{js,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,md,json}": "prettier --write"
  }
}
```

The `pre-commit` hook runs `npx lint-staged`. It passes **only staged files** to each tool, re-stages any fixes, and fails if errors remain.

## The pre-commit framework (any language)

pre-commit.com, very popular for Python and polyglot repos:

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v5.0.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-added-large-files
      - id: detect-private-key
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.8.0
    hooks:
      - id: ruff
      - id: ruff-format
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.21.0
    hooks:
      - id: gitleaks
```

```bash
pip install pre-commit
pre-commit install            # writes .git/hooks/pre-commit
pre-commit run --all-files    # run on everything once
pre-commit autoupdate         # bump hook versions
```

## Rules for good hooks

- **Fast**: under a few seconds. Leave the full test suite to CI.
- **Only staged files.** Never check the whole repo on every commit.
- **Auto-fix** what can be fixed (formatting), and fail only on real problems.
- **Same checks in CI**, because anyone can skip a hook.

```quiz
q: What should a pre-commit hook check?
- The entire test suite
- [x] Quick checks on the staged files only
why: Hooks must be fast or people skip them. CI runs the slow checks.

q: Which command installs the pre-commit framework's hook into a clone?
- pre-commit run
- [x] pre-commit install
why: install writes the hook script into .git/hooks.
```

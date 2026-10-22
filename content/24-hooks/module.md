---
title: Hooks and automation
tagline: Let Git check your work before anyone else does.
track: Automation
boss: The Broken Build
---

Hooks are small scripts Git runs at key moments. Teams use them to stop bad commits before they ever leave a laptop.

## Planned lessons

- What a hook is and where hooks live
- pre-commit: lint and format before every commit
- commit-msg: enforce Conventional Commits
- pre-push: run tests before you push
- Sharing hooks with a team: core.hooksPath, Husky and pre-commit
- Server-side hooks and why GitHub uses rules instead
- When hooks get in the way, and --no-verify

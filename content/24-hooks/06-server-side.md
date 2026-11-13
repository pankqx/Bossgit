---
title: Server-side hooks and why GitHub uses rules instead
minutes: 6
---

Client-side hooks run on **your** laptop, so anyone can skip them. A Git **server** can run hooks too, and those cannot be skipped:

| Server hook | Runs | Can |
|---|---|---|
| `pre-receive` | once per push, before any ref is updated | reject the whole push |
| `update` | once per branch being pushed | reject one branch |
| `post-receive` | after the push succeeded | trigger deploys, notify chat |

Self-hosted servers (plain Git over SSH, GitLab self-managed, Gitea, GitHub Enterprise Server) let admins install them.

## On github.com

You **cannot** run your own server hooks on github.com. Instead GitHub gives you safer, managed versions of the same ideas:

| You want | On GitHub use |
|---|---|
| Reject pushes to main | Rulesets: require a pull request, block force pushes |
| Enforce commit message format | Rulesets: **commit message pattern** (Enterprise), or a required CI check |
| Block secrets | **Push protection** |
| Block big files or certain paths | Rulesets: **file path / file size / file extension** restrictions |
| Require tests to pass | Required **status checks** |
| Run something after a push | **GitHub Actions** (`on: push`) or **webhooks** (module 27) |

```fact
GitHub Enterprise Server does support `pre-receive` hooks, written as scripts that run in an isolated environment. Large companies use them for custom compliance checks.
```

```quiz
q: Which hook can reject a push on the server?
- pre-commit
- post-receive
- [x] pre-receive
why: pre-receive runs before any ref is updated and can refuse the push.

q: On github.com, how do you run something after every push to main?
- A post-receive hook
- [x] A GitHub Actions workflow on push, or a webhook
why: github.com does not allow custom server hooks.
```

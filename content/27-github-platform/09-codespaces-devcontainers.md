---
title: Codespaces and dev containers
minutes: 6
---

You met Codespaces in module 16. At company scale, the **dev container** becomes infrastructure: the definition of "a working laptop for this project", versioned in the repo.

## A production-grade devcontainer.json

```json
{
  "name": "shop",
  "build": { "dockerfile": "Dockerfile" },
  "features": {
    "ghcr.io/devcontainers/features/node:1": { "version": "22" },
    "ghcr.io/devcontainers/features/docker-in-docker:2": {},
    "ghcr.io/devcontainers/features/github-cli:1": {}
  },
  "forwardPorts": [5173, 5432],
  "portsAttributes": { "5173": { "label": "web", "onAutoForward": "openBrowser" } },
  "postCreateCommand": "npm ci && npm run db:setup",
  "secrets": { "STRIPE_TEST_KEY": { "description": "Test key from the team vault" } },
  "hostRequirements": { "cpus": 4, "memory": "8gb" },
  "customizations": { "vscode": { "extensions": ["dbaeumer.vscode-eslint"] } }
}
```

## Prebuilds

Building a big dev container can take 10 minutes. **Prebuilds** build it ahead of time on every push to main, so a new Codespace is ready in seconds.

## Organization controls

Owners choose who can create Codespaces, which machine types, idle timeout, and a **spending limit**. They can restrict which repos can use them and require codespaces to be deleted after N days.

```tip
Even without Codespaces, a dev container gives you a reproducible local environment with Docker and VS Code's Dev Containers extension. "It works on my machine" becomes "it works in the container".
```

```quiz
q: What makes a new Codespace for a big project open in seconds?
- A faster laptop
- [x] Prebuilds
why: Prebuilds create the container image ahead of time.

q: Where does the dev container definition live?
- In the GitHub settings only
- [x] In the repository, in .devcontainer/
why: It is versioned with the code, so everyone gets the same setup.
```

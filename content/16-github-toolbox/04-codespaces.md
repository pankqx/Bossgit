---
title: Codespaces
minutes: 6
---

A **Codespace** is a full development computer in the cloud, opened from any repository with one click: **Code → Codespaces → Create codespace on main**. You get VS Code in the browser (or your desktop VS Code), a terminal, and the repo already cloned.

## Why teams use it

- **New joiners code on day one.** No "install these 14 tools" document.
- **Same setup for everyone**, defined in the repo.
- **Works from any laptop**, even a cheap one or a tablet.
- Review a PR by running it, without touching your local machine.

## The dev container

The setup lives in `.devcontainer/devcontainer.json`:

```json
{
  "name": "Shop",
  "image": "mcr.microsoft.com/devcontainers/typescript-node:22",
  "features": {
    "ghcr.io/devcontainers/features/github-cli:1": {}
  },
  "forwardPorts": [5173],
  "postCreateCommand": "npm ci",
  "customizations": {
    "vscode": { "extensions": ["dbaeumer.vscode-eslint", "esbenp.prettier-vscode"] }
  }
}
```

The same file works locally with Docker and the VS Code **Dev Containers** extension, so the cloud and your laptop match.

## Cost

Personal accounts get a free monthly quota of core-hours and storage. Codespaces **stop after 30 minutes idle** by default, and you should delete old ones. Check Settings → Billing.

```tip
Press `.` on any GitHub repo page to open **github.dev**, a lightweight editor in the browser. No terminal, but perfect for quick edits and reading code.
```

```quiz
q: Where is a Codespace's setup defined?
- In the README
- [x] In .devcontainer/devcontainer.json
why: The dev container file describes the image, tools, ports and setup commands.

q: What does pressing . on a GitHub repo do?
- Starts a Codespace
- [x] Opens github.dev, an editor in the browser
why: github.dev is free and instant, but has no terminal or running code.
```

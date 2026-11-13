---
title: GitHub Pages
minutes: 6
---

GitHub Pages turns a repository into a free website with HTTPS. It is perfect for portfolios, project docs, blogs and front-end apps (no server code).

## Three kinds of site

| Kind | Repo name | URL |
|---|---|---|
| User site | `USER.github.io` | `https://USER.github.io` |
| Organization site | `ORG.github.io` | `https://ORG.github.io` |
| Project site | any repo | `https://USER.github.io/REPO/` |

## Two ways to publish

1. **Deploy from a branch:** Settings → Pages → pick a branch and `/` or `/docs`. GitHub serves the files as they are (and can run Jekyll for Markdown sites).
2. **GitHub Actions:** build with any tool (Vite, Next.js static export, Astro, Hugo, Docusaurus) and deploy the output (previous module).

## Limits worth knowing

- Static files only: no PHP, no Node server, no database. Use an API elsewhere if needed.
- Published sites should stay under about 1 GB, with a soft bandwidth limit of 100 GB a month.
- On free accounts the repo must be **public** for Pages (private Pages needs a paid plan).
- Not for commercial shops or SaaS backends. Read GitHub's terms.

```tip
Make `USER.github.io` your portfolio: a single page with your best projects, each linking to its live demo on its own project site. Recruiters click links, not zip files.
```

```quiz
q: What URL does a project site for repo shop owned by pank get?
- https://shop.github.io
- [x] https://pank.github.io/shop/
why: Project sites live under the owner's github.io domain, in a folder named after the repo.

q: Can GitHub Pages run a Node.js server?
- Yes
- [x] No, it only serves static files
why: Pages is static hosting. Back ends need another service.
```

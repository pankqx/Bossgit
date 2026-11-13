---
title: Deploy to GitHub Pages
minutes: 9
setup: mkdir site && cd site && git init -q && echo "<h1>Hi</h1>" > index.html && git add . && git commit -q -m "Site"
---

**GitHub Pages** hosts static websites for free at `https://USER.github.io/REPO/`. This is exactly how BossGit is hosted. The modern way to publish is a workflow.

## The workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write          # allowed to publish to Pages
  id-token: write       # proves the run's identity to Pages (OIDC)
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci && npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

## Turn it on

**Settings → Pages → Build and deployment → Source: GitHub Actions.** Push to `main`, and in a minute the site is live. The URL appears on the run and in Settings → Pages.

## Things that trip people up

- **Paths.** The site lives under `/REPO/`, not `/`. In Vite set `base: '/REPO/'` (or `'./'`), in other tools the "base path" or "public path".
- **Single-page apps** with real URLs get 404 on refresh. Use hash routing (`/#/learn`), like BossGit does, or copy `index.html` to `404.html`.
- **Custom domain:** add it in Settings → Pages and create a DNS `CNAME` record. Tick **Enforce HTTPS**.

```fact
The older way is "Deploy from a branch": GitHub serves the files from a `gh-pages` branch or the `/docs` folder. It still works, but the Actions way lets you build first.
```

```quiz
q: Which permission must the workflow have to publish to Pages?
- contents: write
- [x] pages: write (plus id-token: write)
why: pages: write allows the deployment, id-token: write lets the job prove who it is.

q: Your Vite app on Pages shows a blank page and 404s for /assets/... What is the most likely fix?
- Make the repo public
- [x] Set the base path to /REPO/ or ./
why: The site lives in a subfolder, so asset paths must include it.
```

```mission
title: The Red Pipeline
boss: true
goal: The deploy workflow never runs. It has **two bugs**: the trigger says `pussh` instead of `push`, and the branch is `master` but this repo uses `main`. Fix both in `.github/workflows/deploy.yml` and commit.
setup: mkdir site && cd site && git init -q && echo "<h1>Hi</h1>" > index.html && mkdir .github && mkdir .github/workflows && echo "name: Deploy" > .github/workflows/deploy.yml && echo "on:" >> .github/workflows/deploy.yml && echo "  pussh:" >> .github/workflows/deploy.yml && echo "    branches: [master]" >> .github/workflows/deploy.yml && echo "jobs:" >> .github/workflows/deploy.yml && echo "  deploy:" >> .github/workflows/deploy.yml && echo "    runs-on: ubuntu-latest" >> .github/workflows/deploy.yml && echo "    steps:" >> .github/workflows/deploy.yml && echo "      - uses: actions/deploy-pages@v4" >> .github/workflows/deploy.yml && git add . && git commit -q -m "Add deploy"
check: contains .github/workflows/deploy.yml   push:
check: lacks .github/workflows/deploy.yml pussh
check: contains .github/workflows/deploy.yml [main]
check: lacks .github/workflows/deploy.yml master
check: contains .github/workflows/deploy.yml deploy-pages
check: clean
hint: There is no editor, so write the whole file again with echo > and echo >>.
hint: Keep every other line the same, with the same spaces.
solve: echo "name: Deploy" > .github/workflows/deploy.yml
solve: echo "on:" >> .github/workflows/deploy.yml
solve: echo "  push:" >> .github/workflows/deploy.yml
solve: echo "    branches: [main]" >> .github/workflows/deploy.yml
solve: echo "jobs:" >> .github/workflows/deploy.yml
solve: echo "  deploy:" >> .github/workflows/deploy.yml
solve: echo "    runs-on: ubuntu-latest" >> .github/workflows/deploy.yml
solve: echo "    steps:" >> .github/workflows/deploy.yml
solve: echo "      - uses: actions/deploy-pages@v4" >> .github/workflows/deploy.yml
solve: git commit -am "ci: fix the deploy trigger"
```

---
title: GitHub Packages and container registry
minutes: 6
---

**GitHub Packages** hosts packages next to your code: npm, Maven, Gradle, NuGet, RubyGems, and **container images** in the GitHub Container Registry (`ghcr.io`).

## Build and push a Docker image from Actions

```yaml
permissions:
  contents: read
  packages: write
jobs:
  image:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          push: true
          tags: ghcr.io/acme/shop:${{ github.sha }},ghcr.io/acme/shop:latest
```

```bash
docker pull ghcr.io/acme/shop:latest
```

## Private npm packages for a company

```ini
# .npmrc
@acme:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

`npm publish` from CI with `NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}`, and `npm install @acme/ui` in other repos.

## Good to know

- Packages can be **public** or **private**, and inherit access from a linked repository.
- Add **artifact attestations** (`actions/attest-build-provenance`) so users can verify where an image was built.
- Free for public packages; private ones use the account's storage and transfer quota.

```quiz
q: What is the registry address for GitHub container images?
- docker.io
- [x] ghcr.io
why: GitHub Container Registry lives at ghcr.io/OWNER/IMAGE.

q: Which permission does a workflow need to push to GitHub Packages?
- contents: write
- [x] packages: write
why: packages: write lets GITHUB_TOKEN publish packages.
```

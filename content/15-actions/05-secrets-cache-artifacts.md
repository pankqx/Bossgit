---
title: Secrets, caching and artifacts
minutes: 10
---

## Secrets

Passwords, API keys and deploy tokens go in **Settings → Secrets and variables → Actions**, never in the YAML.

```yaml
    steps:
      - run: ./deploy.sh
        env:
          API_KEY: ${{ secrets.PROD_API_KEY }}
```

- Secrets are encrypted and **masked** in logs (shown as `***`).
- **Environment secrets** (Settings → Environments, like `production`) can require a manual **approval** before a job can read them.
- **Variables** (`${{ vars.NAME }}`) are for non-secret config.
- Every run also gets an automatic `GITHUB_TOKEN`. Limit it with `permissions:`.
- Better than any stored cloud key: **OIDC** (module 27), which needs no long-lived secret at all.

```warn
Printing a secret in pieces, base64 encoding it, or writing it to a file can get around masking. Treat logs as public.
```

## Caching

Downloading dependencies on every run is slow. Cache them:

```yaml
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm             # built-in caching for npm, yarn and pnpm
      # or the general action:
      - uses: actions/cache@v4
        with:
          path: ~/.cache/pip
          key: pip-${{ runner.os }}-${{ hashFiles('requirements.txt') }}
          restore-keys: pip-${{ runner.os }}-
```

The **key** changes when the lockfile changes, so the cache refreshes only when dependencies do.

## Artifacts

Files a job produces (test reports, builds, screenshots) vanish with the runner unless you **upload** them:

```yaml
      - uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/
          retention-days: 7
  report:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with: { name: coverage }
```

| | Cache | Artifact |
|---|---|---|
| Purpose | Speed: reuse dependencies between runs | Output: keep or pass files |
| Shared between | Runs on the same branch (and main) | Jobs of the same run; download from the UI |

```quiz
q: Where should an API key used by a workflow be stored?
- In the YAML file
- In a .env file committed to the repo
- [x] In the repository's Actions secrets
why: Secrets are encrypted, masked in logs and never in the code.

q: You want to download the test report from a run's page. What do you use?
- actions/cache
- [x] actions/upload-artifact
why: Artifacts are kept and downloadable. Caches are for speeding up later runs.
```

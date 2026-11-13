---
title: The REST API with curl and gh api
minutes: 8
---

Everything you click on GitHub can be done through its **REST API** at `https://api.github.com`. That is how bots, dashboards, and scripts that "close all stale issues" work.

## With curl

```bash
curl -s https://api.github.com/repos/git/git | jq '.stargazers_count'      # public data, no login

curl -s -H "Authorization: Bearer $GITHUB_TOKEN" \
     -H "Accept: application/vnd.github+json" \
     -H "X-GitHub-Api-Version: 2022-11-28" \
     https://api.github.com/user/repos?per_page=100 | jq '.[].full_name'

curl -s -X POST -H "Authorization: Bearer $GITHUB_TOKEN" \
     https://api.github.com/repos/acme/shop/issues \
     -d '{"title":"Checkout is slow","labels":["bug"]}'
```

## With gh api (easier: auth and pagination included)

```bash
gh api repos/{owner}/{repo}/pulls --jq '.[] | "\(.number) \(.title)"'
gh api --paginate repos/{owner}/{repo}/issues -q '.[].title'
gh api -X POST repos/{owner}/{repo}/labels -f name=P0 -f color=ff0000
gh api repos/{owner}/{repo}/actions/runs --jq '.workflow_runs[0].conclusion'
```

`{owner}` and `{repo}` are filled in from the current folder's remote.

## Things that matter in production

| Topic | Detail |
|---|---|
| **Rate limits** | 60 requests/hour without a token, 5,000/hour with one, more for GitHub Apps. Check `gh api rate_limit`. |
| **Pagination** | Lists return 30 items by default (`per_page` up to 100). Follow the `Link` header, or use `--paginate`. |
| **Versioning** | Send `X-GitHub-Api-Version` so your script does not break. |
| **Conditional requests** | Send `If-None-Match` with the last `ETag`: a 304 reply does not count against the limit. |
| **Errors** | 401 bad token, 403 forbidden or rate limited, 404 also means "no access" (GitHub hides private repos), 422 invalid data. |

```quiz
q: Your script gets 404 for a private repo that exists. What is the likely cause?
- The repo was deleted
- [x] The token has no access, and GitHub hides private repos with 404
why: Returning 404 instead of 403 avoids revealing that the repo exists.

q: How many items does a list endpoint return by default?
- All of them
- [x] 30, with per_page up to 100 and pagination for more
why: You must paginate to get every item.
```

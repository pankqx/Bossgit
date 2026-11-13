---
title: "The GraphQL API: ask for exactly what you need"
minutes: 7
---

The REST API often needs many calls: one for the PRs, then one per PR for reviews, then one per PR for checks. The **GraphQL API** (`https://api.github.com/graphql`) gets all of it in **one** request, with exactly the fields you ask for.

```graphql
query {
  repository(owner: "acme", name: "shop") {
    pullRequests(states: OPEN, first: 10, orderBy: {field: UPDATED_AT, direction: DESC}) {
      nodes {
        number
        title
        author { login }
        reviewDecision
        commits(last: 1) { nodes { commit { statusCheckRollup { state } } } }
      }
    }
  }
}
```

```bash
gh api graphql -f query='
  query($owner:String!, $name:String!) {
    repository(owner:$owner, name:$name) { stargazerCount, issues(states:OPEN){ totalCount } }
  }' -F owner=git -F name=git
```

## REST or GraphQL?

| Use REST when | Use GraphQL when |
|---|---|
| a simple single call | you need nested data (PRs + reviews + checks) |
| uploading files, webhooks admin | you want to save rate limit and round trips |
| quick curl scripts | **GitHub Projects** (its API is GraphQL only) |

## Good to know

- Lists use **cursor pagination**: ask for `pageInfo { hasNextPage endCursor }` and pass `after: "<endCursor>"`.
- Rate limits are counted in **points** (based on query cost), 5,000 points per hour for users.
- **Mutations** change data: `addComment`, `mergePullRequest`, `updateProjectV2ItemFieldValue`.
- Explore the schema at **docs.github.com/graphql/overview/explorer**.

```quiz
q: Which API must you use to automate GitHub Projects fields?
- REST
- [x] GraphQL
why: Projects (v2) are only available through GraphQL.

q: What is the main advantage of GraphQL here?
- It is older
- [x] One request returns exactly the nested fields you ask for
why: It avoids many REST round trips and over-fetching.
```

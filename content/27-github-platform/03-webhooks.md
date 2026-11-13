---
title: "Webhooks: let GitHub call your server"
minutes: 8
---

Polling the API every minute ("any new PRs yet?") is slow and wasteful. A **webhook** turns it around: when something happens, **GitHub sends an HTTP POST to your server** with the details.

## Set one up

**Settings → Webhooks → Add webhook**: a payload URL (`https://bot.acme.dev/github`), content type `application/json`, a **secret**, and the events you want (`push`, `pull_request`, `issues`, `workflow_run`, `release`...).

## The payload

```json
{
  "action": "opened",
  "number": 42,
  "pull_request": { "title": "Add wishlist", "user": { "login": "riya" }, "head": { "sha": "a1b2..." } },
  "repository": { "full_name": "acme/shop" },
  "sender": { "login": "riya" }
}
```

Headers tell you the event (`X-GitHub-Event: pull_request`) and give a unique delivery id.

## Verify the signature. Always.

Anyone can POST to your URL. GitHub signs each payload with your secret in `X-Hub-Signature-256`. Check it before trusting anything:

```js
import crypto from 'node:crypto'
function isFromGitHub(rawBody, signature, secret) {
  const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}
```

## Production rules

- **Reply fast** (within 10 seconds) with `2xx`, then do slow work in a background queue.
- Deliveries can **repeat** or arrive **out of order**: use the delivery id to ignore duplicates.
- **Redeliver** failed deliveries from the webhook's "Recent deliveries" page while debugging.
- For local testing: `gh webhook forward --repo=acme/shop --events=pull_request --url=http://localhost:3000/github`.

```quiz
q: Why verify X-Hub-Signature-256?
- To speed up delivery
- [x] To prove the request really came from GitHub with your secret
why: Without it, anyone could send fake events to your server.

q: Your handler takes 30 seconds. What is the problem?
- None
- [x] GitHub times out after 10 seconds; reply quickly and process in the background
why: Slow handlers cause failed and repeated deliveries.
```

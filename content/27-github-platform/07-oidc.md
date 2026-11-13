---
title: "OIDC: deploy to the cloud with no stored secrets"
minutes: 8
---

The old way to deploy from CI: create a cloud access key, paste it into GitHub secrets, and hope it never leaks. Those keys live for years, and many breaches start with exactly one of them.

**OpenID Connect (OIDC)** removes the stored key. Each workflow run asks GitHub for a short-lived, signed **identity token** that says "I am a run of `acme/shop`, on branch `main`, environment `production`". The cloud provider checks the token and hands out **temporary** credentials for that one run.

```flow
sequenceDiagram
  participant Job as Workflow job
  participant GH as GitHub OIDC
  participant Cloud as AWS / Azure / GCP
  Job->>GH: request ID token (id-token: write)
  GH-->>Job: signed JWT (repo, ref, environment...)
  Job->>Cloud: exchange JWT for credentials
  Cloud-->>Job: temporary credentials (minutes to 1 hour)
```

## AWS example

```yaml
permissions:
  id-token: write      # allow requesting the OIDC token
  contents: read
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/github-deploy
          aws-region: ap-south-1
      - run: aws s3 sync dist/ s3://acme-shop-site
```

In AWS you create an IAM role that trusts `token.actions.githubusercontent.com` **only when** the token's `sub` claim is, for example, `repo:acme/shop:environment:production`.

```warn
The trust condition is everything. A role that trusts `repo:acme/*` lets **every** repo in the org (and every branch, including a PR branch) deploy to production. Match the exact repo **and** environment or branch.
```

```quiz
q: What does a workflow need to request an OIDC token?
- A stored cloud key
- [x] permissions: id-token: write
why: That permission lets the job ask GitHub for a signed ID token.

q: Why is OIDC safer than an access key in secrets?
- It is encrypted twice
- [x] Credentials are temporary and only issued to runs that match the trust rules
why: There is no long-lived key to leak.
```

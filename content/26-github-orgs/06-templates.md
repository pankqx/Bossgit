---
title: "Templates: issue forms, PR templates and repository templates"
minutes: 7
setup: mkdir dotgithub && cd dotgithub && git init -q
---

## Organization-wide defaults

Create a public repository called **`.github`** in the organization. Files in it become **defaults** for every repo that does not have its own:

```
.github/                         (the repository)
├── profile/README.md            ← the org's public profile page
├── ISSUE_TEMPLATE/bug.yml
├── ISSUE_TEMPLATE/config.yml
├── pull_request_template.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── SUPPORT.md
├── FUNDING.yml
└── workflow-templates/          ← starter workflows shown in every repo's Actions tab
```

## Issue form config

```yaml
# ISSUE_TEMPLATE/config.yml
blank_issues_enabled: false
contact_links:
  - name: Questions
    url: https://github.com/orgs/acme/discussions
    about: Ask and answer questions here
```

## Repository templates

Mark a repo as a **template** (Settings → Template repository). "Use this template" creates a new repo with the same files, **without** the history. Perfect for a company "service starter": CI, Dockerfile, linting, CODEOWNERS and README ready on day one.

```bash
gh repo create acme/new-service --template acme/service-template --private --clone
```

```try
mkdir ISSUE_TEMPLATE
echo "blank_issues_enabled: false" > ISSUE_TEMPLATE/config.yml
echo "## What" > pull_request_template.md
ls -R
```

```quiz
q: Where do organization-wide default templates live?
- In every repo's docs folder
- [x] In a repository named .github in the organization
why: GitHub uses it as a fallback for repos without their own files.

q: What does "Use this template" copy?
- The full history
- [x] The files, starting a fresh history
why: Template repos give a clean start without old commits.
```

```mission
title: One place for every repo
goal: In this `.github` repository, commit a `SECURITY.md` and a `pull_request_template.md` (it must contain `## How to test`) so every repo in the org inherits them.
setup: mkdir dotgithub && cd dotgithub && git init -q
check: tracked SECURITY.md
check: tracked pull_request_template.md
check: contains pull_request_template.md ## How to test
check: clean
solve: echo "# Security" > SECURITY.md
solve: echo "## What" > pull_request_template.md
solve: echo "## How to test" >> pull_request_template.md
solve: git add .
solve: git commit -m "chore: org defaults"
```

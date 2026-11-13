---
title: Discussions and templates
minutes: 7
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start"
---

## Discussions

Issues are for **work**: bugs and tasks that will be closed. **Discussions** (turn them on in Settings) are a forum for everything else: questions, ideas, announcements, show-and-tell. A question answered in Discussions can be marked as **the answer**, and stays searchable. Big projects send "how do I…?" there to keep issues clean.

## Issue templates and forms

Put files in `.github/ISSUE_TEMPLATE/`. When someone clicks **New issue**, GitHub offers a choice: "Bug report", "Feature request". **Issue forms** (YAML) give real input fields and dropdowns:

```yaml
# .github/ISSUE_TEMPLATE/bug.yml
name: Bug report
description: Something is broken
labels: [bug, needs-triage]
body:
  - type: textarea
    id: steps
    attributes:
      label: Steps to reproduce
    validations:
      required: true
  - type: dropdown
    id: browser
    attributes:
      label: Browser
      options: [Chrome, Firefox, Safari, Edge]
```

A `config.yml` in the same folder can turn off blank issues and link to Discussions for questions.

## Pull request template

```try
mkdir .github
echo "## What" > .github/pull_request_template.md
echo "## Why" >> .github/pull_request_template.md
echo "## How to test" >> .github/pull_request_template.md
cat .github/pull_request_template.md
```

Every new PR now starts with these headings.

```tip
A special repository called `.github` in your organization can hold default templates, a default `CONTRIBUTING.md` and `SECURITY.md` for **every** repo in the org (module 26).
```

```quiz
q: Where do you send "how do I install this?" questions in a big project?
- Issues
- [x] Discussions
why: Discussions are for questions and conversation. Issues are for actionable work.

q: Which folder holds issue templates?
- docs/templates/
- [x] .github/ISSUE_TEMPLATE/
why: GitHub looks in that exact folder.
```

```mission
title: Make it easy to help
goal: Add a pull request template at `.github/pull_request_template.md` that contains the headings `## What` and `## How to test`, and commit it.
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start"
check: tracked .github/pull_request_template.md
check: contains .github/pull_request_template.md ## What
check: contains .github/pull_request_template.md ## How to test
check: clean
hint: mkdir .github first.
hint: echo "## What" > .github/pull_request_template.md, then >> for the next line
solve: mkdir .github
solve: echo "## What" > .github/pull_request_template.md
solve: echo "## How to test" >> .github/pull_request_template.md
solve: git add .
solve: git commit -m "chore: add PR template"
```

---
title: Copilot and AI in the pull request flow
minutes: 9
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start" && mkdir .github && mkdir .github/workflows && echo "name: Label PRs" > .github/workflows/bot.yml && echo "on: pull_request_target" >> .github/workflows/bot.yml && echo "permissions: write-all" >> .github/workflows/bot.yml && echo "jobs:" >> .github/workflows/bot.yml && echo "  label:" >> .github/workflows/bot.yml && echo "    runs-on: ubuntu-latest" >> .github/workflows/bot.yml && echo "    steps:" >> .github/workflows/bot.yml && echo "      - uses: actions/checkout@v4" >> .github/workflows/bot.yml && echo "      - run: npm ci && npm run label" >> .github/workflows/bot.yml && git add . && git commit -q -m "Add label bot"
---

AI tools are now part of everyday Git and GitHub work. Used well, they save hours. Used badly, they ship bugs nobody understood.

## Where AI shows up

| Tool | What it does |
|---|---|
| **Copilot in the editor** | Suggests code and tests as you type; chat about the codebase |
| **Copilot code review** | Request "Copilot" as a reviewer on a PR; it leaves comments and suggestions |
| **PR summaries** | Generate a description from the diff |
| **Coding agents** | Assign an issue to an agent; it works in its own branch (often a worktree or a cloud runner) and opens a PR for you to review |
| **Commit message suggestions** | In editors and GitHub Desktop |

## Rules seniors follow

1. **You own every line you merge**, whoever or whatever wrote it. If you cannot explain it in review, it does not ship.
2. **Review AI PRs harder, not softer.** Check edge cases, security, licensing, and that tests really test something.
3. **Small tasks, clear instructions.** Agents do well on well-scoped issues with acceptance criteria, and badly on vague ones.
4. **Never paste secrets or customer data** into prompts. Use company-approved tools.
5. **Keep the human signals:** PR descriptions that explain *why*, and commits that tell a story.

## Security: bots with too much power

Automation that runs on pull requests is an attack surface. The `pull_request_target` trigger runs with **write permissions and secrets**, in the context of the base repo. If it then **checks out and runs the PR's code** (`npm ci` runs install scripts!), any stranger's PR can steal your secrets. This exact pattern has been used in real attacks on popular repos.

```quiz
q: An AI agent opened a PR that passes CI. What should you do?
- Merge it without reading
- [x] Review it like any other PR, and only merge code you understand
why: You are responsible for what you merge.

q: Why is pull_request_target + checking out the PR's code dangerous?
- It is slow
- [x] Untrusted PR code runs with write permissions and secrets
why: The trigger is privileged; running untrusted code there leaks secrets.
```

```mission
title: The Rogue Bot
boss: true
goal: `.github/workflows/bot.yml` is dangerous: it uses `pull_request_target` and `permissions: write-all` while running PR code. Rewrite it to use the `pull_request` trigger and `permissions:` with `contents: read` only. Keep the job. Commit.
setup: mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start" && mkdir .github && mkdir .github/workflows && echo "name: Label PRs" > .github/workflows/bot.yml && echo "on: pull_request_target" >> .github/workflows/bot.yml && echo "permissions: write-all" >> .github/workflows/bot.yml && echo "jobs:" >> .github/workflows/bot.yml && echo "  label:" >> .github/workflows/bot.yml && echo "    runs-on: ubuntu-latest" >> .github/workflows/bot.yml && echo "    steps:" >> .github/workflows/bot.yml && echo "      - uses: actions/checkout@v4" >> .github/workflows/bot.yml && echo "      - run: npm ci && npm run label" >> .github/workflows/bot.yml && git add . && git commit -q -m "Add label bot"
check: lacks .github/workflows/bot.yml pull_request_target
check: lacks .github/workflows/bot.yml write-all
check: contains .github/workflows/bot.yml on: pull_request
check: contains .github/workflows/bot.yml contents: read
check: contains .github/workflows/bot.yml npm run label
check: clean
hint: Write the file again with echo > and >>, line by line.
hint: "on: pull_request", then "permissions:" and "  contents: read"
solve: echo "name: Label PRs" > .github/workflows/bot.yml
solve: echo "on: pull_request" >> .github/workflows/bot.yml
solve: echo "permissions:" >> .github/workflows/bot.yml
solve: echo "  contents: read" >> .github/workflows/bot.yml
solve: echo "jobs:" >> .github/workflows/bot.yml
solve: echo "  label:" >> .github/workflows/bot.yml
solve: echo "    runs-on: ubuntu-latest" >> .github/workflows/bot.yml
solve: echo "    steps:" >> .github/workflows/bot.yml
solve: echo "      - uses: actions/checkout@v4" >> .github/workflows/bot.yml
solve: echo "      - run: npm ci && npm run label" >> .github/workflows/bot.yml
solve: git commit -am "ci: run the label bot without write access"
```

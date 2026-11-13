---
title: Finding a good first issue
minutes: 7
---

Open source is the best free work experience you can get. Real code, real reviews from experienced engineers, and a public record anyone can check. Here is how to start without getting lost.

## Where to look

- **github.com/topics** and **github.com/explore**: projects by topic.
- Search issues: `is:issue is:open label:"good first issue" language:TypeScript`.
- **github.com/contribute** and `https://github.com/OWNER/REPO/contribute` list beginner issues for a repo.
- Sites like **goodfirstissue.dev** and **up-for-grabs.net**.
- **Tools you already use.** You understand their bugs. That is your edge.

## How to pick a project

| Look for | Why |
|---|---|
| Commits in the last month | Someone will actually review your PR |
| Maintainers reply to issues within days | Your PR will not rot |
| A `CONTRIBUTING.md` | They want help and explain how |
| Tests and CI | You will learn good habits |
| A code of conduct | The community is managed |

## Your first contributions, from easiest

1. **Docs:** fix a confusing paragraph, a broken link, a missing example.
2. **Reproduce a bug** and post exact steps in the issue. Maintainers value this a lot.
3. **Add a test** for an untested function.
4. **Fix a labelled bug.** Comment "I'd like to work on this" first, and wait for a 👍.

```warn
Do not open PRs that only change one word in a README to get on a contributor list, or that come from an AI tool you did not check. Maintainers see hundreds of these and close them. One real fix is worth more than twenty spam PRs.
```

```tip
Hacktoberfest (every October) and Google Summer of Code are good structured ways to begin, and GSoC is paid.
```

```quiz
q: Which project is the best first choice?
- A huge project with 2,000 open PRs and no replies for months
- [x] An active project you use, with a CONTRIBUTING.md and quick maintainer replies
why: Activity and clear guidance mean your PR will be reviewed and you will learn.

q: You found an unassigned bug you want to fix. What do you do first?
- Open a huge PR immediately
- [x] Comment that you would like to work on it and check the approach
why: It avoids duplicate work and wasted effort on an unwanted fix.
```

---
title: How maintainers think
minutes: 6
---

Behind most open source projects are a few tired people working in their free time. Understanding them is the fastest way to get your PRs merged.

## What maintainers worry about

- **Every merged line is theirs to maintain forever.** A 2,000-line feature they did not ask for is a gift with a bill attached.
- **Review time is their scarcest resource.** A clear, small, tested PR takes 10 minutes. A messy one takes an evening, so it waits.
- **Scope.** "Does this belong in the project at all?"
- **Breaking users.** Thousands of people depend on the current behaviour.

## How to be a contributor they love

1. **Ask before big changes.** Open an issue: "I'd like to add X. Here is my plan. Would you accept it?"
2. **Follow the project's style**, even if you prefer another.
3. **Keep PRs small and focused.** Tests included, docs updated, CI green.
4. **Explain the why** in the description.
5. **Be patient.** A polite ping after one or two weeks is fine. Daily pings are not.
6. **Accept "no" gracefully.** It is not personal.
7. **Stick around.** Answer an issue, review someone else's PR. That is how people become maintainers.

```story
A student fixed one confusing error message in a popular CLI tool. The PR was 6 lines with a test. The maintainer merged it in a day and said thanks. Over a year the student sent 30 small fixes, was invited as a triager, and later as a maintainer. That line on the CV got them interviews at two of the companies that used the tool.
```

```fact
GitHub Sponsors and Open Collective let users fund maintainers. Many important libraries are kept alive by one or two sponsored people.
```

```quiz
q: Why might a maintainer reject a big, well-written feature PR?
- They do not like you
- [x] It adds code they must maintain forever and may not fit the project's scope
why: Every feature is a long-term cost.

q: What is the best thing to do before a big contribution?
- Write it all, then surprise them
- [x] Open an issue describing the plan and ask if they would accept it
why: You avoid wasting days on something they cannot merge.
```

---
title: "Case studies: Linux and big tech"
minutes: 8
---

## The Linux kernel

- Over **1.3 million commits**, about 40 million lines, thousands of contributors per release, a new release roughly every 9 to 10 weeks.
- **No pull requests on GitHub.** Patches are sent by email (`git format-patch`, `git send-email`) to mailing lists, reviewed there, and collected by **subsystem maintainers** in their own trees.
- Maintainers send **pull requests to Linus** as signed tags. Linus merges them during a two-week **merge window**, then only fixes are accepted for about 7 weekly release candidates (`-rc1` to `-rc7`).
- `Signed-off-by:` lines (DCO) on every patch.
- It is a **hierarchy of trust**: Linus trusts a few dozen lieutenants, who trust their own maintainers.

```bash
git format-patch -3          # turn the last 3 commits into email files
git am 0001-fix.patch        # apply a patch email as a commit
git request-pull v6.12 https://git.kernel.org/... for-linus   # write a "please pull" message
```

## Big tech

| Company | Approach |
|---|---|
| **Google** | Giant monorepo (Piper), trunk-based, every change reviewed, automated tests before submit, readability reviews for code style |
| **Meta** | Huge monorepo; built **Sapling**, a Git-compatible client, and stacked diffs as the normal way to work |
| **Microsoft** | Moved Windows to Git; built VFS for Git and then **scalar** to make it fast |
| **Shopify, GitHub** | Large Rails monoliths, many deploys a day, merge queues, feature flags |

## The patterns they share

1. **Small changes**, reviewed by at least one other engineer.
2. **Automated checks** before anything reaches main.
3. **Trunk-based** or close to it, with flags for unfinished work.
4. **Clear ownership** of every folder.
5. **Tools invested in Git performance**, because developer time is the most expensive resource.

```quiz
q: How do Linux kernel contributors usually submit changes?
- GitHub pull requests
- [x] Patches by email to mailing lists, collected by maintainers
why: The kernel uses git format-patch and send-email, reviewed on public lists.

q: What do most big companies have in common?
- Long-lived feature branches
- [x] Small reviewed changes, automated checks and clear code ownership
why: These practices scale to thousands of engineers.
```

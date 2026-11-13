---
title: Licenses in plain English
minutes: 8
---

Code on GitHub with **no license** is **not** free to use. By default, copyright law says only the author may copy it. A license gives everyone else permission, with conditions.

## The common ones

| License | Short version | Used by |
|---|---|---|
| **MIT** | Do anything, keep the copyright notice. No warranty. | React, Node.js, Rails, many npm packages |
| **Apache 2.0** | Like MIT, plus an explicit **patent grant**, and you must note changes. | Kubernetes, Android, TensorFlow |
| **BSD 2/3-Clause** | Like MIT. The 3-clause version adds "don't use our name to promote". | FreeBSD, parts of Go |
| **GPL v3** | **Copyleft**: if you distribute software that includes it, you must release your source under GPL too. | Bash, GIMP |
| **GPL v2** | Older copyleft version. | Linux kernel, **Git itself** |
| **LGPL** | Copyleft for the library, but apps can link to it without becoming GPL. | glibc |
| **AGPL v3** | GPL, plus: running it as a **web service** counts as distribution. | Some databases and SaaS tools |
| **MPL 2.0** | Copyleft per file only. | Firefox |
| **Unlicense / CC0** | Public domain. | Small snippets |

```flow
flowchart LR
  P[Permissive: MIT, Apache, BSD] --> W[Weak copyleft: LGPL, MPL] --> S[Strong copyleft: GPL] --> N[Network copyleft: AGPL]
```

## Why companies care

Legal teams track every dependency's license. Many companies **forbid AGPL** dependencies, because using one in a web product could force them to publish their source code. Permissive licenses are almost always fine.

## Adding a license

On GitHub: **Add file → Create new file**, name it `LICENSE`, and click **Choose a license template**. Or pick one when you create the repo. **choosealicense.com** (made by GitHub) explains them all.

```tip
For a portfolio project or a learning platform like BossGit, MIT is the usual choice if you want people to reuse it. If you plan to sell it, talk to someone first and consider keeping the repo private or "source available" with a custom license.
```

```warn
This is general information, not legal advice. For anything with money involved, ask a lawyer.
```

```quiz
q: A repository has no LICENSE file. Can you copy its code into your company's product?
- Yes, it is public
- [x] No, without a license you have no permission
why: Public does not mean free. No license means all rights reserved.

q: Which license makes running the software as a web service count as distribution?
- MIT
- GPL v2
- [x] AGPL v3
why: AGPL closes the "SaaS loophole" of the GPL.
```

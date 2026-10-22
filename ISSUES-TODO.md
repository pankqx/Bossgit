# 30 starter tasks

Small jobs for your first month, from tiny to a weekend. Do them in order: they start very easy so the daily habit forms before the topics get hard.

For each one: make a branch, do the task, run `npm run check`, commit, push, open a pull request, merge. That loop **is** the practice. After a month you will have done it 30 times.

You can turn this list into real GitHub issues so each pull request can say `Fixes #N`.

| # | Task | Size | Files |
|---|---|---|---|
| 1 | Read lesson M00 "What a terminal is" in the site. Fix one sentence you think could be clearer. | tiny | `content/00-terminal-basics/01-what-is-a-terminal.md` |
| 2 | Add a `fact` box to "Why Git exists" lesson 1 with a fact you looked up yourself. | tiny | `content/01-why-git/01-final-final.md` |
| 3 | Add 3 commands to the cheat sheet (ideas: `git log -n 3`, `git branch -v`, `git status -s`). | tiny | `src/content/cheatsheet.ts` |
| 4 | Add 2 quiz questions to "Where am I? pwd, ls and cd". | small | `content/00-terminal-basics/02-where-am-i.md` |
| 5 | Change the signal red colour slightly and see the whole site follow. Keep it if you like it. | tiny | `src/styles.css` |
| 6 | Add your name and a link to your GitHub profile in the footer. | tiny | `src/components/Layout.tsx` |
| 7 | Add 2 quiz questions to "git init makes a repository". | small | `content/03-first-repo/01-git-init.md` |
| 8 | Write M02 lesson 3: "Config levels: system, global and local". | lesson | `content/02-setup/03-config-levels.md` |
| 9 | Write M02 lesson 4: "Getting help from Git itself" (`git help`, `-h`). | lesson | `content/02-setup/04-getting-help.md` |
| 10 | Write M01 lesson 4: "Centralized and distributed version control". Add a `flow` diagram. | lesson | `content/01-why-git/04-centralized-vs-distributed.md` |
| 11 | Write M04 lesson 1: "git log and its most useful options". | lesson | `content/04-history/01-git-log.md` |
| 12 | Write M04 lesson 2: "git show: one commit up close". | lesson | `content/04-history/02-git-show.md` |
| 13 | Write M04 lesson 3: "git diff and git diff --staged". Add a mission. | lesson | `content/04-history/03-git-diff.md` |
| 14 | Add a new scene to the playground, like "Many branches". | small | `src/pages/Playground.tsx` |
| 15 | Write M04 lesson 4: "Reading a diff line by line". | lesson | `content/04-history/04-reading-a-diff.md` |
| 16 | Write M04 lesson 5: ".gitignore: files Git should never see". | lesson | `content/04-history/05-gitignore.md` |
| 17 | Write M04 lesson 6: "git blame" and the M04 boss fight "The Missing Line". | weekend | `content/04-history/06-git-blame.md` |
| 18 | Add a new path to the Rescue guide: "I deleted a file by accident". | small | `src/content/rescue.ts` |
| 19 | Tag your first release: `git tag -a v0.2.0 -m "Module 4"` and `git push --tags`. Then make a Release on GitHub. | small | none |
| 20 | Write M05 lesson 1: "git restore: throw away a change". | lesson | `content/05-undo/01-git-restore.md` |
| 21 | Write M05 lesson 2: "Unstage a file". | lesson | `content/05-undo/02-unstage.md` |
| 22 | Write M05 lesson 3: "Fix the last commit with --amend". | lesson | `content/05-undo/03-amend.md` |
| 23 | Write M05 lesson 4: "git revert: undo by adding a commit". | lesson | `content/05-undo/04-git-revert.md` |
| 24 | Write M05 lesson 5: "git reset: soft, mixed and hard". This one is hard to explain well, so take two days. | weekend | `content/05-undo/05-git-reset.md` |
| 25 | Write M05 lesson 6: "Which undo do I need?" as a big `flow` chart, plus the boss fight "The Wrong Commit". | weekend | `content/05-undo/06-which-undo.md` |
| 26 | Add 5 cheat sheet entries for commands you learned this month. | small | `src/content/cheatsheet.ts` |
| 27 | Add a "Badges" section to the progress page: first lesson, first mission, 7 day streak. | weekend | `src/pages/Me.tsx` |
| 28 | Write M06 lesson 4: "Listing, renaming and deleting branches". | lesson | `content/06-branches/04-manage-branches.md` |
| 29 | Write M06 lesson 5: "Detached HEAD, and how to get out", with the boss "The Detached Head Ghost". | weekend | `content/06-branches/05-detached-head.md` |
| 30 | Tag release v0.3.0, write a short CHANGELOG.md of what you added this month. | small | `CHANGELOG.md` |

Sizes: **tiny** is under 20 minutes, **small** is about 30 minutes, **lesson** is about an hour, **weekend** is 2 to 3 hours.

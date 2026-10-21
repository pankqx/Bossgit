# BossGit roadmap

This file lists everything still to build. Pick one item, make a branch, do it, open a pull request. One item a day keeps your streak green with real work.

## The course

Lessons marked ✅ are written. The rest are planned: each one is listed in its module's `module.md` under **Planned lessons**. When you write one, remove it from that list.

**19 lessons written, 119 planned.**

### M00 · Terminal basics (Before Git)

- ✅ What a terminal is
- ✅ Where am I? pwd, ls and cd
- ✅ Making folders and files
- ✅ Paths and hidden files

### M01 · Why Git exists (Foundations)

- ✅ final_v7_REALLY_final.docx
- ✅ Commits are save points
- ✅ Git is not GitHub
- [ ] Centralized and distributed version control

### M02 · Set up Git (Foundations)

- ✅ Installing Git on your computer
- ✅ Tell Git who you are
- [ ] Config levels: system, global and local
- [ ] Getting help from Git itself

### M03 · Your first repository (Foundations)

- ✅ git init makes a repository
- ✅ The three areas
- ✅ Reading git status
- ✅ git add, up close
- ✅ git commit and good messages
- ✅ The daily loop

### M04 · Reading history (Foundations)

- [ ] git log and its most useful options
- [ ] git show: one commit up close
- [ ] git diff and git diff --staged
- [ ] Reading a diff line by line
- [ ] .gitignore: files Git should never see
- [ ] git blame: who wrote this line?

### M05 · Undoing things safely (Foundations)

- [ ] git restore: throw away a change
- [ ] Unstage a file
- [ ] Fix the last commit with --amend
- [ ] git revert: undo by adding a commit
- [ ] git reset: soft, mixed and hard
- [ ] Which undo do I need?

### M06 · Branches (Branching)

- ✅ A branch is a sticky note
- ✅ HEAD means "you are here"
- ✅ Creating and switching branches
- [ ] Listing, renaming and deleting branches
- [ ] Detached HEAD, and how to get out
- [ ] Naming branches well

### M07 · Merging and conflicts (Branching)

- ✅ The simplest merge, fast-forward
- [ ] Three-way merges and merge commits
- [ ] Why conflicts happen
- [ ] Resolving a conflict step by step
- [ ] git merge --abort
- [ ] Merge strategies in plain words

### M08 · Rebase (Branching)

- [ ] Rebase vs merge, side by side
- [ ] git rebase main
- [ ] Conflicts during a rebase
- [ ] Interactive rebase: squash, fixup, reword, drop
- [ ] The golden rule: never rebase shared history
- [ ] Merge or rebase? A flowchart

### M09 · Stash, cherry-pick and tags (Branching)

- [ ] git stash: put work aside
- [ ] git cherry-pick: copy one commit
- [ ] Lightweight and annotated tags
- [ ] Semantic versioning
- [ ] Bring back an old file
- [ ] Scenario: the Friday hotfix

### M10 · GitHub and remotes (GitHub)

- [ ] Your GitHub account and profile
- [ ] SSH keys and HTTPS tokens
- [ ] git clone and origin
- [ ] git push and upstream
- [ ] fetch vs pull
- [ ] When a push is rejected

### M11 · Pull requests and code review (GitHub)

- [ ] Branch, push, open a pull request
- [ ] Writing a description people want to read
- [ ] Reviewing: comments, suggestions, approvals
- [ ] Draft pull requests
- [ ] Merge, squash or rebase?
- [ ] Taking feedback without stress

### M12 · Issues, projects and Markdown (GitHub)

- [ ] Writing a good issue
- [ ] Labels, milestones and assignees
- [ ] Closing issues from a pull request
- [ ] GitHub Projects boards
- [ ] Markdown you will actually use
- [ ] Discussions and templates

### M13 · Team workflows (GitHub)

- [ ] GitHub Flow
- [ ] Git Flow
- [ ] Trunk-based development
- [ ] Branch protection and rulesets
- [ ] CODEOWNERS
- [ ] Conventional Commits

### M14 · Open source (GitHub)

- [ ] Forks and upstream
- [ ] Keeping a fork in sync
- [ ] Finding a good first issue
- [ ] Reading CONTRIBUTING.md
- [ ] Licenses in plain English
- [ ] How maintainers think

### M15 · GitHub Actions (Automation)

- [ ] What CI is
- [ ] Workflow files: triggers, jobs and steps
- [ ] Run tests on every pull request
- [ ] Matrix builds
- [ ] Secrets, caching and artifacts
- [ ] Deploy to GitHub Pages

### M16 · The GitHub toolbox (Automation)

- [ ] GitHub Pages
- [ ] Releases and changelogs
- [ ] The gh command line tool
- [ ] Codespaces
- [ ] A profile README that stands out
- [ ] How the contribution graph counts

### M17 · Rescue and rewriting (Advanced)

- [ ] git reflog: Git's black box
- [ ] Recovering a deleted branch
- [ ] Undoing a bad reset --hard
- [ ] Force push and --force-with-lease
- [ ] Removing a secret from history
- [ ] git filter-repo

### M18 · Detective work (Advanced)

- [ ] git bisect by hand
- [ ] git bisect run
- [ ] Searching history with log -S and -G
- [ ] Blame that ignores moves and whitespace
- [ ] shortlog and statistics
- [ ] Case study: hunting a real bug

### M19 · Git internals (Advanced)

- [ ] A tour of the .git folder
- [ ] Blobs, trees, commits and tags
- [ ] Hashes and why they matter
- [ ] Plumbing commands
- [ ] Refs, the index and packfiles
- [ ] Make a commit without git commit

### M20 · Power tools (Advanced)

- [ ] Worktrees
- [ ] Submodules and subtrees
- [ ] Sparse checkout and partial clone
- [ ] Git LFS for big files
- [ ] Hooks
- [ ] Aliases and .gitattributes

### M21 · Security (Advanced)

- [ ] Two-factor authentication
- [ ] Signed commits and the Verified badge
- [ ] Secret scanning and push protection
- [ ] Dependabot
- [ ] SECURITY.md and responsible disclosure
- [ ] Supply chain basics

### M22 · Git at scale (Advanced)

- [ ] Monorepos vs many repositories
- [ ] Merge queues
- [ ] Release branches and hotfixes
- [ ] Automatic changelogs and versions
- [ ] Performance in huge repositories
- [ ] Case studies: Linux and big tech

### M23 · Boss Rush (Mastery)

- [ ] Ten disaster scenarios, timed
- [ ] Capstone: build a mini Git
- [ ] Fifty interview questions
- [ ] Teach it back
- [ ] Your BossGit certificate
- [ ] Where to go next

## Features to build

Bigger jobs, best for weekends. Each one teaches you something real about React or Git.

- [ ] **Interactive rebase planner**: a drag-and-drop list of commits with pick, squash, reword and drop, then run it in the lab (module 8).
- [ ] **git bisect** in the engine (`src/engine/shell.ts`), for module 18.
- [ ] **Certificate page**: when every module is done, show a certificate with the learner's name, ready to screenshot.
- [ ] **Daily review**: show 5 old quiz questions each day (spaced repetition).
- [ ] **Search**: find any lesson by a word in its title or text.
- [ ] **Sound effects** for a passed mission and a defeated boss, with an off switch.
- [ ] **Badges** on the progress page: first commit, first merge, first conflict solved, 7 day streak.
- [ ] **Offline mode** with a service worker, so the course works without internet.
- [ ] **Merge conflict editor**: a small editor in the lab to fix conflict markers without `echo`.
- [ ] **Pull request simulator** for module 11: a fake GitHub pull request page with a diff to review.
- [ ] **Actions YAML checker** for module 15: paste a workflow and see mistakes explained.
- [ ] **Mobile polish**: test every page on a phone and fix what feels cramped.

## Done

- [x] Real Git engine in the browser: init, add, commit, status, log, diff, show, branch, switch, checkout, merge with conflicts, rebase, cherry-pick, revert, reset, restore, stash, tag, reflog, blame, cat-file, remotes, push, pull, fetch, clone.
- [x] Terminal with history, Tab completion and paste.
- [x] Live commit graph and the three areas view.
- [x] Lessons from Markdown with try, quiz, mission, fact, tip, warn, story and flowchart blocks.
- [x] Missions checked against the real repository.
- [x] Landing page, course map, playground, cheat sheet, rescue guide, progress page with export and import.
- [x] XP, levels and a daily streak.
- [x] Deploy to GitHub Pages with Actions, and a content check on every pull request.

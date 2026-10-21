# How to add a lesson

A lesson is **one Markdown file**. You do not need to write any code.

## The steps

Do this every time. It is also great Git practice.

```bash
# 1. Get the newest version of main
git switch main
git pull

# 2. Make a branch for your lesson
git switch -c lesson/04-git-log

# 3. Start the site so you can see your lesson while you write
npm run dev
```

4. Create the file. Lessons live in `content/<module folder>/`. Name it with two digits, a dash, and a few lowercase words:

   ```
   content/04-history/01-git-log.md
   ```

   The number sets the order. `01-` comes before `02-`.

5. Copy the template below into the file and write your lesson. Open http://localhost:5173, go to the module, and your lesson is there. Every time you save, the page updates.

6. If the lesson was listed under **Planned lessons** in that module's `module.md`, delete that line from the list.

7. Check for mistakes, then commit and push:

   ```bash
   npm run check
   git add content/04-history
   git commit -m "content: add lesson on git log"
   git push -u origin lesson/04-git-log
   ```

8. On GitHub, open a pull request. Write `Fixes #12` in the description if there is an issue for it. Wait for the green check, then merge it. The site updates itself in about a minute.

## The template

````markdown
---
title: git log shows your history
minutes: 6
setup: mkdir project && cd project && git init -q && echo "hi" > a.txt && git add . && git commit -q -m "First commit"
---

One or two short paragraphs. Explain the idea in plain words,
like you are talking to a friend who has never used Git.

## A heading for the next part

```try
git log
git log --oneline
```

```tip
A short, useful tip.
```

```quiz
q: The question?
- A wrong answer
- [x] The right answer
- Another wrong answer
why: Why the right answer is right.
```

```mission
title: The mission name
goal: What the learner must do, in one or two sentences.
setup: mkdir project && cd project && git init -q
check: branch feature
check: head feature
hint: A small hint
hint: A bigger hint
```
````

## The top of the file

| Line | Needed? | What it does |
|---|---|---|
| `title:` | yes | The lesson's name. |
| `minutes:` | no | About how long the lesson takes. |
| `setup:` | no | Commands that prepare the lab before the lesson starts. Join several with `&&`. Add `-q` to Git commands to keep them quiet. |

The lab starts in the home folder `/home/learner` (written `~`), with the name "Learner" already set for commits. Use `bossgit identity off` in `setup:` if the lesson is about setting your name.

## Special blocks

Write normal Markdown for text. These fenced blocks are special:

| Block | What it shows |
|---|---|
| ` ```try ` | One command per line. Each line is a button that types the command into the lab. |
| ` ```quiz ` | Questions. Start each with `q:`. Mark the one right answer with `- [x]`. `why:` explains it. |
| ` ```mission ` | A goal that BossGit checks. See the checks below. Add `boss: true` for the boss fight at the end of a module. |
| ` ```fact ` | A "did you know" box. |
| ` ```tip ` | A green tip box. |
| ` ```warn ` | A red "careful" box. |
| ` ```story ` | A short story in italics. |
| ` ```flow ` | A flowchart written in [Mermaid](https://mermaid.js.org/syntax/flowchart.html). |

Normal code blocks like ` ```bash ` are shown as code and are not clickable.

## Mission checks

Each `check:` line is one thing that must be true. File paths are relative to the folder the learner is in. Start with `~/` for a path from the home folder.

| Check | Passes when |
|---|---|
| `repo` | there is a Git repository here |
| `branch NAME` | a branch called NAME exists |
| `nobranch NAME` | the branch NAME does not exist |
| `head NAME` | you are on branch NAME |
| `detached` | HEAD is detached |
| `commits N` | the current branch has at least N commits |
| `exactcommits N` | exactly N commits |
| `clean` | nothing to commit, nothing untracked |
| `staged FILE` | FILE is staged |
| `modified FILE` | FILE has changes that are not staged |
| `untracked FILE` | FILE is untracked |
| `tracked FILE` | FILE is in the last commit |
| `nottracked FILE` | FILE is not in the last commit |
| `branchhas BRANCH FILE` | FILE is in the newest commit of BRANCH |
| `file PATH` / `nofile PATH` | the file exists / does not exist |
| `dir PATH` | the folder exists |
| `contains PATH TEXT` | the file contains TEXT |
| `lacks PATH TEXT` | the file does not contain TEXT |
| `message TEXT` | the last commit message contains TEXT |
| `tag NAME` | a tag called NAME exists |
| `merged BRANCH` | BRANCH is merged into the current branch |
| `parents N` | the last commit has N parents (2 means a merge commit) |
| `linear` | no merge commits in the history |
| `nooperation` | no merge, rebase or cherry-pick is half-finished |
| `stash N` | the stash has N entries |
| `remote NAME` | a remote called NAME exists |
| `pushed BRANCH` | origin/BRANCH is the same commit as BRANCH |
| `config KEY [VALUE]` | a Git setting is set (to VALUE) |
| `same REV REV` | two names point at the same commit, like `same main origin/main` |
| `cwd FOLDER` | the learner is inside FOLDER |
| `run COMMAND => TEXT` | running COMMAND prints TEXT |

## Lab helpers for setup

| Command | What it does |
|---|---|
| `bossgit identity off` | Remove the name and email, like a brand new computer. |
| `bossgit identity NAME EMAIL` | Set a name and email. |
| `bossgit github URL` | Make an empty pretend GitHub repository at URL. |
| `bossgit teammate URL FILE TEXT` | A teammate called Sam adds TEXT to FILE and pushes it to main on URL. Good for practising pull and rejected pushes. |

`git push` to a remote that does not exist yet creates a pretend GitHub repository automatically.

## Writing style

- Simple English. Short sentences. Explain every new word the first time.
- One idea per lesson. 5 to 10 minutes.
- Show, then explain: a `try` block early, so the learner sees it happen.
- End with a quiz question. End the last lesson of a module with a `boss: true` mission.
- Write it yourself. You can ask an AI to explain a topic to you, but write the lesson in your own words. That is how you learn it.

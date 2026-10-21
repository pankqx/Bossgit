# BossGit

**Learn Git and GitHub from zero to mastery, with a real Git terminal in your browser.**

BossGit is a free course for people who have never used Git, all the way up to rebase, reflog and Git's internals. Every lesson has a lab beside it: a real Git repository running inside the browser tab, with a live picture of your commits. Missions check your work by reading that real repository.

- No account, no install, no server. Progress is saved in your browser, with export and import.
- 24 modules in 7 tracks: Before Git, Foundations, Branching, GitHub, Automation, Advanced, Mastery.
- Lessons are plain Markdown files. Anyone can add one.

## Run it on your computer

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
npm run dev
```

Open the address it prints (usually http://localhost:5173).

| Command | What it does |
|---|---|
| `npm run dev` | Start the site on your computer. Changes show up instantly. |
| `npm run check` | Check every lesson file for mistakes. |
| `npm run build` | Build the finished site into `dist/`. |

## Add a lesson

Read **[HOW-TO-ADD-A-LESSON.md](HOW-TO-ADD-A-LESSON.md)**. It is one Markdown file, and the guide has a template you can copy.

What to work on next is in **[ROADMAP.md](ROADMAP.md)** and **[ISSUES-TODO.md](ISSUES-TODO.md)**.

## How it works

| Folder | What is inside |
|---|---|
| `content/` | The course. One folder per module, one `.md` file per lesson. |
| `src/engine/shell.ts` | The terminal and every Git command. Uses [isomorphic-git](https://isomorphic-git.org) for real Git objects. |
| `src/engine/checker.ts` | Mission checks, like `branch feature` or `clean`. |
| `src/components/` | The terminal (xterm.js), the commit graph, lesson blocks. |
| `src/pages/` | Landing page, course map, lessons, playground, cheat sheet, rescue guide, progress. |
| `src/content/cheatsheet.ts` | The cheat sheet entries. |
| `src/styles.css` | Colours and fonts for the whole site. |

Built with React, Vite, TypeScript, Tailwind CSS, Framer Motion, isomorphic-git, LightningFS, xterm.js and Mermaid.

## Deploying

Every push to `main` builds the site and publishes it to GitHub Pages (see `.github/workflows/deploy.yml`). One-time setup: in the repository on GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions**.

---
title: A profile README that stands out
minutes: 7
setup: mkdir kspankaj && cd kspankaj && git init -q
---

Create a **public repository with exactly your username** as its name (for example `kspankaj/kspankaj`) and add a `README.md`. GitHub shows it at the top of your profile.

## What to put in it

Keep it short, honest and useful. A recruiter spends about 30 seconds.

```markdown
# Hi, I'm Pankaj 👋

Full-stack developer in Bengaluru. I build fast, accessible web apps with
React, Node.js and PostgreSQL.

- 🔭 Building **BossGit**: learn Git and GitHub with a real terminal in your browser
- 🌱 Learning: system design and Rust
- 📫 Reach me: [LinkedIn](https://linkedin.com/in/...) · [Portfolio](https://kspankaj.github.io)

### Featured projects
| Project | What | Stack |
|---|---|---|
| [BossGit](https://github.com/...) | Interactive Git course | React, TypeScript, isomorphic-git |
| [Shop](https://github.com/...) | E-commerce with payments | Next.js, Stripe |
```

## Do and don't

| Do | Don't |
|---|---|
| Say what you build and what you are good at | Paste 40 technology logos |
| Link live demos | Use five auto-generated stat cards |
| Pin your best 6 repos | Write "aspiring" everywhere |
| Update it every few months | Leave it at "Hello world" from 2021 |

```try
echo "# Hi, I'm Pankaj" > README.md
echo "Full-stack developer. I build fast web apps." >> README.md
cat README.md
```

```quiz
q: What must the repository be called for a profile README?
- profile
- readme
- [x] Exactly your GitHub username
why: GitHub only shows the README from the repo named like your account.

q: What do recruiters care about most on a profile?
- The number of badges
- [x] Clear real projects with live demos and good READMEs
why: They want proof you can build and explain things.
```

```mission
title: Say hello
goal: Write a `README.md` that starts with `# Hi, I'm` and mentions what you build, and commit it.
setup: mkdir kspankaj && cd kspankaj && git init -q
check: contains README.md # Hi, I'm
check: tracked README.md
check: clean
solve: echo "# Hi, I'm Pankaj" > README.md
solve: echo "I build web apps with React and Node." >> README.md
solve: git add .
solve: git commit -m "docs: profile README"
```

---
title: ".gitignore: files Git should never see"
minutes: 9
setup: mkdir app && cd app && git init -q && echo "console.log('hi')" > app.js && echo "debug line" > debug.log && echo "API_KEY=secret123" > .env && mkdir node_modules && echo "lib" > node_modules/lib.js
---

Some files must **never** go into a repository:

- **Secrets:** `.env` files, API keys, passwords.
- **Things you can rebuild:** `node_modules/`, `dist/`, `build/`, `__pycache__/`.
- **Noise:** `*.log` files, `.DS_Store` from macOS, editor folders like `.idea/`.

```try
git status
```

Git sees all of them as untracked. One `git add .` and your secret is in history forever. The fix is a file called `.gitignore`.

## Write a .gitignore

Each line is a pattern:

```try
echo "node_modules/" > .gitignore
echo "*.log" >> .gitignore
echo ".env" >> .gitignore
git status
```

Now Git only shows `app.js` and `.gitignore` itself. Commit the `.gitignore`, because the whole team needs the same rules.

## Pattern cheat sheet

| Pattern | Ignores |
|---|---|
| `*.log` | every file ending in .log, in any folder |
| `node_modules/` | that folder (the slash means "folder") |
| `/build` | `build` only at the top of the repo |
| `docs/*.pdf` | PDFs directly inside docs |
| `**/temp` | a `temp` folder at any depth |
| `!keep.log` | **do not** ignore keep.log, even though `*.log` matched it |
| `# comment` | a note for humans |

```warn
`.gitignore` only affects **untracked** files. If a file is already committed, adding it to `.gitignore` does nothing. You must also run `git rm --cached FILE` to stop tracking it (problem 33 practises this).
```

## Other places to ignore things

```bash
.git/info/exclude              # like .gitignore, but only on your machine, never shared
git config --global core.excludesFile ~/.gitignore_global   # your personal list for every repo
git check-ignore -v debug.log  # explains which rule ignores a file
```

```tip
GitHub keeps ready-made templates at github.com/github/gitignore. When you create a new repository on GitHub you can pick one, for example "Node" or "Python".
```

```quiz
q: Which line ignores every .log file except important.log?
- *.log and important.log
- [x] *.log followed by !important.log
- !*.log
why: ! makes an exception to an earlier pattern. Order matters: the exception must come after.

q: secrets.txt is already committed. You add it to .gitignore. What happens?
- Git deletes it from history
- [x] Nothing changes; Git still tracks it
- Git stops tracking it automatically
why: Ignore rules only apply to untracked files. Use git rm --cached to stop tracking.
```

```mission
title: Keep the repo clean
goal: Write a `.gitignore` that ignores `node_modules/`, every `.log` file and `.env`. Commit **only** `app.js` and `.gitignore`, so nothing is left to commit.
setup: mkdir app && cd app && git init -q && echo "console.log('hi')" > app.js && echo "debug" > debug.log && echo "API_KEY=secret123" > .env && mkdir node_modules && echo "lib" > node_modules/lib.js
check: tracked .gitignore
check: tracked app.js
check: nottracked .env
check: nottracked debug.log
check: clean
hint: echo "node_modules/" > .gitignore, then add the other two lines with >>
hint: git add . is safe once the .gitignore is written. Then commit.
solve: echo "node_modules/" > .gitignore
solve: echo "*.log" >> .gitignore
solve: echo ".env" >> .gitignore
solve: git add .
solve: git commit -m "Add app and ignore rules"
```

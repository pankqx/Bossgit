---
title: fetch vs pull
minutes: 8
setup: bossgit github https://github.com/team/app && mkdir app && cd app && git init -q && echo "app" > README.md && git add . && git commit -q -m "Start" && git remote add origin https://github.com/team/app && git push -q -u origin main && bossgit teammate https://github.com/team/app README.md Sam added docs
---

Sam just pushed a commit to GitHub. Your laptop does not know yet.

## fetch: download, but do not touch my work

```try
git status
git fetch
git status
git log --oneline --all
```

`fetch` downloads new commits and moves `origin/main`. **Your** `main` and your files stay exactly as they were. Now `git status` says you are **behind** by 1 commit. You can look before you decide:

```try
git log --oneline main..origin/main
git diff main origin/main
```

## pull: fetch, then merge (or rebase)

```try
git pull
git log --oneline
```

`git pull` = `git fetch` + `git merge origin/main`. With `--rebase` it is `fetch` + `rebase`.

```flow
flowchart LR
  F[git fetch] --> O[origin/main moves]
  O --> M{pull = fetch + ?}
  M -->|default| MG[merge into main]
  M -->|--rebase| RB[rebase main on top]
```

| | `git fetch` | `git pull` |
|---|---|---|
| Downloads commits | yes | yes |
| Changes your branch | **no** | yes |
| Can cause conflicts | never | yes |
| Safe to run any time | **yes** | mostly |

```tip
Many seniors run `git fetch` all day and only pull or rebase when they are ready. Set `git config --global fetch.prune true` so branches deleted on GitHub disappear from your list too.
```

```bash
git pull --rebase       # replay my local commits on top, no merge commit
git pull --ff-only      # refuse unless it is a clean fast-forward (very safe)
git config --global pull.ff only     # make --ff-only the default
```

```quiz
q: Which command can never change your files or create conflicts?
- git pull
- [x] git fetch
- git pull --rebase
why: fetch only updates remote-tracking branches like origin/main.

q: What does git pull do by default?
- Only downloads
- [x] Fetches and then merges the upstream branch into yours
why: pull is two commands in one. The second step is a merge unless you configure rebase.
```

```mission
title: Catch up
goal: A teammate pushed to `main` on GitHub. Bring your local `main` up to date so it matches `origin/main`.
setup: bossgit github https://github.com/team/site && mkdir site && cd site && git init -q && echo "site" > README.md && git add . && git commit -q -m "Start" && git remote add origin https://github.com/team/site && git push -q -u origin main && bossgit teammate https://github.com/team/site news.txt Big news
check: same main origin/main
check: tracked news.txt
check: exactcommits 2
hint: git pull
solve: git pull
```

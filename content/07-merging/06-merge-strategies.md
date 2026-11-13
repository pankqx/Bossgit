---
title: Merge strategies in plain words
minutes: 9
setup: mkdir api && cd api && git init -q && echo "v1" > api.txt && git add . && git commit -q -m "API v1" && git switch -q -c users && echo "users" > users.txt && git add . && git commit -q -m "Add users" && git switch -q main && echo "health" > health.txt && git add . && git commit -q -m "Add health check" && git switch -q -c orders && echo "orders" > orders.txt && git add . && git commit -q -m "Add orders" && git switch -q main
---

When you run `git merge`, Git picks a **strategy**: the algorithm that combines the histories. You rarely choose it, but you must understand the options, because interviewers love this topic and real conflicts depend on it.

## The strategies

| Strategy | When it is used | What it does |
|---|---|---|
| **Fast-forward** | Your branch has not moved | Just moves the pointer. No new commit. |
| **ort** | Default since Git 2.34 (2021) | The normal three-way merge. Fast and handles renames well. |
| **recursive** | Default before 2.34 | The older version of ort. |
| **octopus** | Merging 3 or more branches at once | Used for many simple branches with no conflicts. |
| **ours** | `git merge -s ours old` | Records a merge but **keeps only your side**, ignoring theirs entirely. |
| **subtree** | Merging a project into a subfolder | Rare, for subtree setups. |

```fact
"ort" stands for "Ostensibly Recursive's Twin". Elijah Newren rewrote the merge engine and made big merges up to hundreds of times faster.
```

## Options inside a strategy

Don't confuse the **strategy** `-s ours` with the **option** `-X ours`:

```bash
git merge -X ours feature     # merge normally, but on conflicts pick my side automatically
git merge -X theirs feature   # on conflicts pick their side
git merge -s ours feature     # ignore feature's changes completely, just record the merge
git merge --squash feature    # take all feature's changes as ONE staged change, no merge commit
```

## Try it

```try
git merge --no-ff users -m "Merge users"
git merge orders -m "Merge orders"
git log --oneline --graph --all
```

Both merges used **ort**, because both branches had split from `main`. Each made a merge commit with two parents. In a real terminal, `git merge users orders` would do both in one **octopus** merge commit with three parents.

```warn
`-X ours` and `-X theirs` silently throw away the other side's lines, but only where they conflict. Use them when you know one side is correct, for example a generated lockfile.
```

```quiz
q: What is Git's default merge strategy today?
- recursive
- [x] ort
- octopus
why: ort became the default in Git 2.34.

q: What is the difference between -s ours and -X ours?
- They are the same
- [x] -s ours ignores their changes entirely; -X ours merges normally and only picks your side on conflicts
- -X ours is for octopus merges
why: -s chooses the strategy. -X passes an option to the strategy.
```

```mission
title: The Conflict Hydra
boss: true
goal: Three heads to cut. Merge `logo`, `colors` and `fonts` into `main`. `colors` conflicts with `main` in `theme.txt`; the right answer keeps **both** `dark` and `blue`. End with all three merged, no markers, nothing left to commit.
setup: mkdir brand && cd brand && git init -q && echo "theme" > theme.txt && git add . && git commit -q -m "Start" && git switch -q -c logo && echo "logo" > logo.svg && git add . && git commit -q -m "Add logo" && git switch -q main && git switch -q -c fonts && echo "inter" > fonts.txt && git add . && git commit -q -m "Add fonts" && git switch -q main && git switch -q -c colors && echo "blue" > theme.txt && git commit -q -am "Blue theme" && git switch -q main && echo "dark" > theme.txt && git commit -q -am "Dark theme"
check: merged logo
check: merged colors
check: merged fonts
check: contains theme.txt dark
check: contains theme.txt blue
check: lacks theme.txt =======
check: nooperation
check: clean
hint: Merge the easy ones first: git merge logo, then git merge fonts.
hint: git merge colors conflicts. Write both lines into theme.txt, git add it, commit.
solve: git merge logo -m "Merge logo"
solve: git merge fonts -m "Merge fonts"
solve: git merge colors
solve: echo "dark" > theme.txt
solve: echo "blue" >> theme.txt
solve: git add theme.txt
solve: git commit -m "Merge colors"
```

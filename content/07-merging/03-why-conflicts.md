---
title: Why conflicts happen
minutes: 7
setup: mkdir band && cd band && git init -q && echo "Song: Blue Sky" > setlist.txt && git add . && git commit -q -m "First song" && git switch -q -c anna && echo "Song: Red Sun" > setlist.txt && git commit -q -am "Anna picks Red Sun" && git switch -q main && echo "Song: Green Sea" > setlist.txt && git commit -q -am "Main picks Green Sea"
---

A conflict is not an error. It is Git being honest: two people changed **the same lines** in different ways, and Git will not guess who is right.

```try
git merge anna
git status
cat setlist.txt
```

Git paused the merge. The file now holds **both** versions, wrapped in markers:

```
<<<<<<< HEAD
Song: Green Sea
=======
Song: Red Sun
>>>>>>> anna
```

| Marker | Meaning |
|---|---|
| `<<<<<<< HEAD` | Start of **your** version (the branch you are on) |
| `=======` | The line between the two versions |
| `>>>>>>> anna` | End of **their** version (the branch you are merging in) |

## What causes conflicts

- Two branches edit the **same line**, or lines right next to each other.
- One branch **edits** a file and the other **deletes** it.
- Both branches **add** a file with the same name and different contents.

## How to get fewer of them

- Keep branches **short-lived**. Merge or rebase onto `main` often, at least daily.
- Make **small** pull requests. 50 changed lines conflict far less than 2,000.
- Do not mix a big reformat with real changes.
- Talk to your team: "I am refactoring `checkout.js` today."

```tip
Conflicts are normal in every company. Being calm and fast at resolving them is one of the clearest signs of an experienced developer.
```

```fact
Git uses the **merge base** to decide. If only one side changed a line since the base, there is no conflict, even if the other side's line looks different from it.
```

```quiz
q: What is between <<<<<<< HEAD and =======?
- Their version
- [x] Your version, from the branch you are on
- The base version
why: HEAD is where you are, so that block is yours.

q: Which change will NOT conflict?
- Both branches edit line 5 of app.js
- One branch edits app.js and the other deletes it
- [x] One branch edits line 5 and the other edits line 80 of app.js
why: Changes far apart in the same file merge automatically.
```

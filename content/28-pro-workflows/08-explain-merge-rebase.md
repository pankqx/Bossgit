---
title: Explaining merge vs rebase to a junior developer
minutes: 7
---

Being able to **teach** is a senior skill. Interviewers ask "explain X to a junior" to see if you really understand it, and if you can communicate. Here is a model answer, in plain words.

## The explanation

> "Imagine you and a friend are writing a story in a shared notebook. You both made copies on Monday. You added chapters 5 and 6. Your friend added chapter 4 to the shared notebook.
>
> **Merging** is like stapling your pages in, with a note: 'Here is where my copy and the shared notebook came together.' Nothing is rewritten. You can see exactly what happened, but the notebook gets a bit messy with all those notes.
>
> **Rebasing** is like rewriting your chapters 5 and 6 *as if you had started after chapter 4 was already there*. The notebook reads in a clean line. But they are new copies of your pages. If your friend already photocopied your old pages, now there are two versions, and that gets confusing. So you only rebase pages nobody else has copied yet."

## Then the practical rules

1. Rebase **your own** branch onto `main` to stay up to date: `git pull --rebase`, `git rebase origin/main`.
2. **Never** rebase a branch others are using, and never rebase `main`.
3. Use interactive rebase to **clean up** before review.
4. If unsure, **merge**. It never destroys anything.

## What makes an explanation good

- Starts from something the person already knows (a notebook, not a DAG).
- Gives the **why** and the **trade-off**, not just commands.
- Ends with a **rule** they can follow tomorrow.
- Checks understanding: "So which one would you use on main?"

```quiz
q: In the notebook story, why is rebasing shared pages a problem?
- It deletes the notebook
- [x] Others have copies of the old pages, and now two versions exist
why: Rebasing makes new commits; anyone with the old ones gets duplicates.

q: What should a good "explain it to a junior" answer end with?
- A list of every flag
- [x] A simple rule they can apply, and a question to check understanding
why: Teaching is about what they can do next.
```

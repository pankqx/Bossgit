---
title: final_v7_REALLY_final.docx
minutes: 5
---

Look at this folder. You have probably made one like it.

```
essay.docx
essay_v2.docx
essay_v2_fixed.docx
essay_final.docx
essay_final_FINAL.docx
essay_final_FINAL_teacher_comments.docx
essay_USE_THIS_ONE.docx
```

Which one is the latest? What changed between `v2_fixed` and `final`? If you delete a paragraph today and want it back next week, which file has it? Nobody knows. Not even you.

Now imagine five people working on the same essay, emailing copies to each other. That was how a lot of software was built, not very long ago.

```story
In 2005 the people building Linux, one of the biggest programs in the world with thousands of contributors, lost the free tool they used to share their code. Linus Torvalds, who started Linux, was annoyed by every other option. So he wrote his own. The first version took about ten days. He called it Git.
```

## What version control does

A **version control system** keeps every version of your project for you, in one place, with a note about each change. You stop making copies. You just keep working, and every time you reach a good point you tell Git: *remember this*.

With Git you can always answer:

- What did this project look like last Tuesday?
- What exactly changed, line by line?
- Who changed it, and why?
- Can I undo that? (Almost always: yes.)

## And it is not only for code

Git tracks any text: websites, books, recipes, notes, settings files. Some people write their novels in Git. Governments publish laws in it. If it is text and it changes, Git can keep its history.

```quiz
q: What is the main job of a version control system?
- To make your code run faster
- To store files in the cloud
- [x] To remember every version of your project and what changed
why: Backups and speed are side effects at best. The job is history: every version, every change, with a note.

q: Who started Git, and when?
- Bill Gates, 1995
- [x] Linus Torvalds, 2005
- GitHub, 2008
why: Linus wrote Git in 2005 for the Linux project. GitHub came later, in 2008, as a website for Git repositories.
```

---
title: Reading a diff line by line
minutes: 8
setup: mkdir recipes && cd recipes && git init -q && echo "flour" > cake.txt && echo "sugar" >> cake.txt && echo "eggs" >> cake.txt && echo "butter" >> cake.txt && git add . && git commit -q -m "Cake recipe" && echo "flour" > cake.txt && echo "honey" >> cake.txt && echo "eggs" >> cake.txt && echo "butter" >> cake.txt && echo "vanilla" >> cake.txt
---

A diff looks scary the first time. It is only five kinds of line. Run this and keep it on screen:

```try
git diff
```

You see something like this:

```
diff --git a/cake.txt b/cake.txt
--- a/cake.txt
+++ b/cake.txt
@@ -1,4 +1,5 @@
 flour
-sugar
+honey
 eggs
 butter
+vanilla
```

## Line by line

| Line | Meaning |
|---|---|
| `diff --git a/cake.txt b/cake.txt` | This part is about `cake.txt`. `a` is the old version, `b` is the new one. |
| `--- a/...` and `+++ b/...` | Lines with `-` come from the old file, lines with `+` from the new one. |
| `@@ -1,4 +1,5 @@` | The **hunk header**. Old file: from line 1, 4 lines. New file: from line 1, 5 lines. |
| ` flour` (a space at the start) | **Context.** It did not change. It is there so you know where you are. |
| `-sugar` | This line was **removed**. |
| `+honey` | This line was **added**. |

There is no "changed line" in a diff. A change is always a `-` line followed by a `+` line. Here sugar was swapped for honey.

```tip
On GitHub the same diff is shown in red and green, with line numbers. In a pull request you can click a line number and leave a comment on that exact line.
```

```fact
By default Git shows 3 lines of context around each change. `git diff -U10` shows 10. `git diff -U0` shows none, which is handy for scripts.
```

```quiz
q: In @@ -10,3 +10,4 @@, how many lines does the new version of this hunk have?
- 3
- [x] 4
- 10
why: The numbers after + describe the new file: it starts at line 10 and has 4 lines.

q: A line starts with one space. What does it mean?
- It was added
- It was removed
- [x] It did not change; it is context
why: Only + and - mean a change. A space means "this line is the same in both versions".
```

```mission
title: Put the sugar back
goal: Someone swapped `sugar` for `honey`. Read the diff, then fix `cake.txt` so it contains `sugar` again and **not** `honey`. Keep `vanilla`. Then commit.
setup: mkdir recipes && cd recipes && git init -q && echo "flour" > cake.txt && echo "sugar" >> cake.txt && echo "eggs" >> cake.txt && git add . && git commit -q -m "Cake recipe" && echo "flour" > cake.txt && echo "honey" >> cake.txt && echo "eggs" >> cake.txt && echo "vanilla" >> cake.txt
check: contains cake.txt sugar
check: lacks cake.txt honey
check: contains cake.txt vanilla
check: clean
hint: You can write the file again with echo > and echo >>.
hint: echo "flour" > cake.txt, then add sugar, eggs and vanilla with >>, then git commit -am "Add vanilla"
solve: echo "flour" > cake.txt
solve: echo "sugar" >> cake.txt
solve: echo "eggs" >> cake.txt
solve: echo "vanilla" >> cake.txt
solve: git commit -am "Add vanilla"
```

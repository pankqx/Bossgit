---
title: git add, up close
minutes: 6
setup: mkdir site && cd site && git init -q && mkdir css && echo "<h1>Home</h1>" > index.html && echo "<h1>About</h1>" > about.html && echo "body { color: black }" > css/style.css && echo "temp" > scratch.txt
---

`git add` puts changes into the staging area. You can add in several ways.

| Command | Stages |
|---|---|
| `git add index.html` | one file |
| `git add index.html about.html` | several files |
| `git add css` | everything inside a folder |
| `git add .` | everything in the current folder and below |
| `git add -A` | everything in the whole repository |

```try
git add index.html
git status -s
git add css
git status -s
```

## Changed your mind?

Staging is not final. If you added something by mistake, take it back out with `git restore --staged`. Your file is not changed, it just leaves the box.

```try
git add scratch.txt
git status -s
git restore --staged scratch.txt
git status -s
```

## A common surprise

`git add` stages a file **as it is right now**. If you edit it again after adding, the new edit is **not** staged:

```try
echo "<p>Welcome</p>" >> index.html
git status
```

`index.html` is now in **both** sections: the first version is staged, the newer edit is not. Run `git add index.html` again to stage the latest version.

```warn
`git add .` is handy, but it adds everything, including junk files and secrets. Always run `git status` before you commit, so you know what is going in.
```

```quiz
q: You run `git add notes.txt`, then edit notes.txt again. What will `git commit` save?
- The newest version of notes.txt
- [x] The version from when you ran git add
- Nothing, Git gets confused
why: git add takes a snapshot of the file at that moment. Add again to stage newer edits.

q: How do you unstage a file without losing your changes?
- git delete --staged file
- [x] git restore --staged file
- rm file
why: restore --staged takes the file out of the staging area and leaves your edits on your desk.
```

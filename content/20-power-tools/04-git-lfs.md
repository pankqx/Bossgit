---
title: Git LFS for big files
minutes: 7
---

Git keeps **every version** of every file forever. Commit a 200 MB video ten times and your repo is 2 GB, for every clone, forever. GitHub also rejects single files over **100 MB**.

**Git LFS** (Large File Storage, git-lfs.com) fixes this. Big files are stored on a separate server. Your repository only holds a tiny **pointer file**.

```bash
git lfs install                    # once per computer
git lfs track "*.psd" "*.mp4" "assets/models/**"
git add .gitattributes             # the tracking rules live here, commit them!
git add design.psd
git commit -m "Add the design file"
git push
```

`.gitattributes` now contains:

```
*.psd filter=lfs diff=lfs merge=lfs -text
```

The commit stores something like this instead of the 300 MB file:

```
version https://git-lfs.github.com/spec/v1
oid sha256:4d7a214614ab2935c943f9e0ff69d22eadbb8f32b1258daaa5e2ca24d17e2393
size 312840211
```

## Good to know

- `git lfs ls-files` lists LFS files. `git lfs pull` downloads them if you cloned without.
- Already committed big files normally? `git lfs migrate import --include="*.psd" --everything` rewrites history to move them into LFS (then force-push and re-clone).
- GitHub gives a free LFS storage and bandwidth quota; game and media teams usually pay for more.
- Binary files cannot be merged. Use `git lfs lock design.psd` so two designers do not edit the same file.

```tip
Use LFS for: design files, videos, audio, 3D models, datasets, large binaries. Do **not** use it for `node_modules` or build output. Those should be in `.gitignore`.
```

```quiz
q: What does a Git LFS file look like inside a commit?
- The full file, compressed
- [x] A small pointer with the file's hash and size
why: The real content lives on the LFS server.

q: Which file must you commit so others' LFS setup knows what to track?
- .gitignore
- [x] .gitattributes
why: git lfs track writes the rules into .gitattributes.
```

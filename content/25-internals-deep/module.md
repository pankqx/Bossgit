---
title: Git internals II
tagline: Packfiles, the wire protocol and garbage collection.
track: Advanced
boss: The Corrupted Repository
---

Part one showed you blobs, trees and commits. Part two shows how Git stores millions of them in a tiny space and sends them across the internet.

## Planned lessons

- Loose objects vs packfiles
- Delta compression: how Git saves space
- git gc, prune and unreachable objects
- How fetch and push talk to a server
- Shallow clones and partial clones in depth
- The commit-graph and multi-pack index
- SHA-1, SHA-256 and the hash transition
- Repairing a corrupted repository with fsck

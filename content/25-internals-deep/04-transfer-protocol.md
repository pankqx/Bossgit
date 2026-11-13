---
title: How fetch and push talk to a server
minutes: 8
---

When you `git fetch`, your Git and the server's Git have a short conversation. Understanding it explains why Git is so fast over the network.

## Fetch, step by step (protocol v2)

```flow
sequenceDiagram
  participant You
  participant Server
  You->>Server: ls-refs (which branches and tags do you have?)
  Server-->>You: main = a1b2..., v2.0 = c3d4...
  You->>Server: want a1b2... / have 9f8e..., 7d6c... (what I already have)
  Server-->>You: ACK 9f8e... (common commit found)
  Server-->>You: packfile with only the missing objects
```

1. **Ref advertisement**: the server lists its refs. Protocol v2 (default since Git 2.26) lets you ask only for the refs you care about, which is much faster for repos with thousands of branches.
2. **Negotiation**: your Git says **want** (tips it needs) and **have** (commits it already has). They find the common ancestors.
3. The server builds a **packfile** with only the missing objects, already delta-compressed, and streams it.
4. Your Git indexes the pack and updates `refs/remotes/origin/*`.

## Push is the reverse

Your Git asks which refs the server has, works out what the server is missing, sends a pack, and asks the server to update refs: "move `main` from X to Y". The server refuses if Y is not a descendant of X (non-fast-forward), unless forced.

## Transports

| URL | Transport |
|---|---|
| `https://github.com/o/r.git` | smart HTTP (most common, works through proxies) |
| `git@github.com:o/r.git` | SSH |
| `/path/to/repo` or `file://` | local |
| `git://` | old, unauthenticated, read-only; avoid |

```bash
GIT_TRACE_PACKET=1 git fetch 2>&1 | head -30   # watch the conversation yourself
git ls-remote origin                            # ask the server for its refs, nothing else
```

```quiz
q: During fetch, what does your Git tell the server with "have" lines?
- Its password
- [x] Commits it already has, so the server sends only what is missing
why: Negotiation avoids sending objects you already own.

q: Why does a push get rejected as non-fast-forward?
- The network failed
- [x] The new commit does not contain the server's current commit in its history
why: Accepting it would drop commits from the server's branch.
```

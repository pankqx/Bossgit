---
title: What a terminal is
minutes: 4
---

You already use a computer by **clicking**. You click a folder to open it. You drag a file to move it. You right-click to make a new folder.

A **terminal** lets you do the same things by **typing**. Instead of double-clicking a folder, you type `cd photos`. Instead of opening a folder to see what is inside, you type `ls`.

That's it. A terminal is just another way to talk to your computer.

```story
The first computers had no mouse and no windows. Just a keyboard and a screen full of text. Programmers got so fast with typed commands that they never stopped using them, even after the mouse was invented. Fifty years later, every developer you admire still keeps a terminal open all day.
```

## Why developers use it

Clicking is easy to learn. Typing is faster once you know it, and it can do things clicking cannot:

- **Repeat** a command with one key (the up arrow).
- **Combine** steps: make a folder and move into it in one line.
- **Automate**: save a list of commands and run them again tomorrow.

Git was built for the terminal. There are buttons for Git in many apps, but they hide what is really happening. In BossGit you will type real commands, so you understand Git, not just one app.

## Your lab

On the right (or under the **Open lab** button on a phone) is your lab: a real terminal with a real Git inside it. It runs entirely in this browser tab. You cannot break your computer from here, so be brave.

The line that ends with `$` is the **prompt**. It means "I am ready, type something". The text before it tells you where you are. `~` is short for your **home folder**.

```try
echo "Hello, terminal"
whoami
help
```

Click a line above and it is typed into the lab for you. Then try typing one yourself. Press **Enter** to run it.

```tip
Press the **up arrow** to bring back your last command. Press **Tab** to finish a long name for you. These two keys will save you hours.
```

```quiz
q: What does a terminal let you do?
- Only run Git
- [x] Control your computer by typing commands
- Browse the internet faster
why: A terminal is a typed way to do what you normally do with clicks, and much more.

q: In the lab, what does the `$` at the end of the prompt mean?
- You owe money
- An error happened
- [x] The terminal is ready for your next command
why: The prompt is the terminal waiting for you.
```

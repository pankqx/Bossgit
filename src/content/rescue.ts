// The "I broke something" guide, as a small decision tree.
// Each node is either a question with choices, or an answer.
export type RescueNode =
  | { q: string; choices: [string, string][] } // [label, next node id]
  | { title: string; steps: string[]; note?: string }

export const RESCUE: Record<string, RescueNode> = {
  start: { q: 'What went wrong?', choices: [
    ['I changed a file and want the old version back', 'file'],
    ['My last commit is wrong', 'commit'],
    ['I committed to the wrong branch', 'wrongbranch'],
    ['I lost commits or a branch', 'lost'],
    ['I am stuck in a merge or rebase', 'stuck'],
    ['git push was rejected', 'rejected'],
    ['I committed a password or secret', 'secret'],
  ] },
  file: { q: 'Did you already git add the file?', choices: [['No, not staged', 'file-unstaged'], ['Yes, it is staged', 'file-staged'], ['It is in an old commit', 'file-old']] },
  'file-unstaged': { title: 'Throw away the change', steps: ['git restore <file>'], note: 'This deletes your unstaged edits to that file for good.' },
  'file-staged': { title: 'Unstage, then throw away', steps: ['git restore --staged <file>', 'git restore <file>'], note: 'Stop after the first line if you want to keep the edits.' },
  'file-old': { title: 'Bring a file back from an old commit', steps: ['git log --oneline -- <file>', 'git restore --source <commit> <file>'] },
  commit: { q: 'Have you pushed it to GitHub yet?', choices: [['No, it is only on my computer', 'commit-local'], ['Yes, it is pushed', 'commit-pushed']] },
  'commit-local': { q: 'What is wrong with it?', choices: [['Only the message', 'amend-msg'], ['I forgot a file', 'amend-file'], ['The whole commit should not exist', 'reset']] },
  'amend-msg': { title: 'Fix the message', steps: ['git commit --amend -m "Better message"'] },
  'amend-file': { title: 'Add the file to the last commit', steps: ['git add <file>', 'git commit --amend --no-edit'] },
  reset: { title: 'Undo the last commit', steps: ['git reset --soft HEAD~1'], note: 'Your changes stay staged. Use --hard only if you want them gone too.' },
  'commit-pushed': { title: 'Undo it with a new commit', steps: ['git revert <commit>', 'git push'], note: 'Never rewrite commits other people may already have. revert is the safe way.' },
  wrongbranch: { title: 'Move the commit to the right branch', steps: ['git switch -c right-branch', 'git switch -', 'git reset --hard HEAD~1', 'git switch right-branch'], note: 'The first line saves your commit on a new branch. Then you take it off the wrong one.' },
  lost: { title: 'Find it in the reflog', steps: ['git reflog', 'git switch -c rescued <commit-id>'], note: 'Git keeps every commit you made for weeks, even after reset or branch -D. The reflog lists where HEAD has been.' },
  stuck: { q: 'Which one?', choices: [['A merge', 'stuck-merge'], ['A rebase', 'stuck-rebase'], ['A cherry-pick', 'stuck-pick']] },
  'stuck-merge': { title: 'Finish or cancel the merge', steps: ['git status', '# fix each file, then:', 'git add <file>', 'git commit', '# or give up:', 'git merge --abort'] },
  'stuck-rebase': { title: 'Finish or cancel the rebase', steps: ['git status', '# fix each file, then:', 'git add <file>', 'git rebase --continue', '# or give up:', 'git rebase --abort'] },
  'stuck-pick': { title: 'Finish or cancel the cherry-pick', steps: ['git add <file>', 'git cherry-pick --continue', '# or give up:', 'git cherry-pick --abort'] },
  rejected: { title: 'Get the new work first', steps: ['git pull --rebase', 'git push'], note: 'Someone pushed before you. Pull their commits, then push again. Do not use --force on a shared branch.' },
  secret: { title: 'Treat the secret as stolen', steps: ['# 1. Change the password or revoke the key right now', '# 2. Remove it from your code and commit', '# 3. Remove it from history with git filter-repo (module 17)'], note: 'Once a secret is pushed, assume someone has it. Rotating it matters more than deleting it.' },
}

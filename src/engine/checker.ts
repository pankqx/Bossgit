// Mission checks. Each check is one short line in a lesson file, for example
//   check: branch feature        a branch called feature exists
//   check: head feature          you are on the feature branch
// The full list is in HOW-TO-ADD-A-LESSON.md.
import { Shell, stripAnsi } from './shell'

export type CheckResult = { check: string; ok: boolean; label: string }

export async function runChecks(shell: Shell, checks: string[]): Promise<CheckResult[]> {
  const snap = await shell.snapshot()
  const dir = await shell.findRepo()
  const out: CheckResult[] = []
  for (const check of checks) {
    const [kind, ...rest] = check.trim().split(/\s+/)
    const arg = rest.join(' ')
    let ok = false
    let label = check
    try {
      switch (kind) {
        case 'repo': ok = snap.repo; label = 'There is a Git repository'; break
        case 'norepo': ok = !snap.repo; label = 'There is no Git repository here'; break
        case 'cwd': ok = shell.cwd.endsWith('/' + arg) || shell.cwd === arg; label = `You are inside the ${arg} folder`; break
        case 'branch': ok = arg in snap.branches; label = `A branch called ${arg} exists`; break
        case 'nobranch': ok = !(arg in snap.branches); label = `The branch ${arg} is gone`; break
        case 'head': ok = snap.head.branch === arg; label = `You are on the ${arg} branch`; break
        case 'detached': ok = !snap.head.branch && !!snap.head.oid; label = 'HEAD is detached'; break
        case 'attached': ok = !!snap.head.branch; label = 'HEAD is on a branch'; break
        case 'commits': {
          const n = Number(rest[0])
          const count = snap.head.oid ? (await shell.commitsFrom(dir!, [snap.head.oid])).length : 0
          ok = count >= n; label = `At least ${n} commit${n > 1 ? 's' : ''} on this branch (you have ${count})`; break
        }
        case 'exactcommits': {
          const n = Number(rest[0])
          const count = snap.head.oid ? (await shell.commitsFrom(dir!, [snap.head.oid])).length : 0
          ok = count === n; label = `Exactly ${n} commits on this branch (you have ${count})`; break
        }
        case 'clean': ok = snap.repo && !snap.staged.length && !snap.modified.length && !snap.untracked.length && !snap.conflicts.length; label = 'Nothing left to commit'; break
        case 'staged': ok = snap.staged.includes(arg); label = `${arg} is staged`; break
        case 'notstaged': ok = !snap.staged.includes(arg); label = `${arg} is not staged`; break
        case 'modified': ok = snap.modified.includes(arg); label = `${arg} has changes that are not staged`; break
        case 'untracked': ok = snap.untracked.includes(arg); label = `${arg} is untracked`; break
        case 'tracked': {
          const files = await shell.treeFiles(dir!, snap.head.oid ?? null)
          ok = files.has(arg); label = `${arg} is saved in the last commit`; break
        }
        case 'nottracked': {
          const files = await shell.treeFiles(dir!, snap.head.oid ?? null)
          ok = !files.has(arg); label = `${arg} is not in the last commit`; break
        }
        case 'branchhas': {
          // branchhas <branch> <file>: the file is saved in that branch's newest commit
          const [b, f] = rest
          const files = await shell.treeFiles(dir!, await shell.resolve(dir!, b))
          ok = files.has(f); label = `${f} is saved on the ${b} branch`; break
        }
        case 'branchlacks': {
          const [b, f] = rest
          const files = await shell.treeFiles(dir!, await shell.resolve(dir!, b))
          ok = !files.has(f); label = `${f} is not on the ${b} branch`; break
        }
        case 'neverin': {
          // neverin <file>: no commit in the current history contains the file
          const list = snap.head.oid ? await shell.commitsFrom(dir!, [snap.head.oid]) : []
          let found = false
          for (const c of list) if ((await shell.treeFiles(dir!, c.oid)).has(arg)) { found = true; break }
          ok = !found; label = `${arg} does not appear in any commit of your history`; break
        }
        case 'file': ok = await shell.exists(shell.abs(arg)); label = `${arg} exists`; break
        case 'nofile': ok = !(await shell.exists(shell.abs(arg))); label = `${arg} does not exist`; break
        case 'dir': ok = await shell.isDir(shell.abs(arg)); label = `The folder ${arg} exists`; break
        case 'contains': {
          const [file, ...words] = rest
          const text = words.join(' ')
          const content = await shell.readText(shell.abs(file)).catch(() => '')
          ok = content.includes(text); label = `${file} contains "${text}"`; break
        }
        case 'lacks': {
          const [file, ...words] = rest
          const text = words.join(' ')
          const content = await shell.readText(shell.abs(file)).catch(() => '')
          ok = !content.includes(text); label = `${file} no longer contains "${text}"`; break
        }
        case 'message': {
          const c = snap.commits.find(x => x.oid === snap.head.oid)
          ok = !!c && c.message.toLowerCase().includes(arg.toLowerCase()); label = `The last commit message mentions "${arg}"`; break
        }
        case 'tag': ok = arg in snap.tags; label = `A tag called ${arg} exists`; break
        case 'merged': {
          const tip = snap.branches[arg]
          ok = !!tip && !!snap.head.oid && (await shell.commitsFrom(dir!, [snap.head.oid])).some(c => c.oid === tip)
          label = `${arg} is merged into your branch`; break
        }
        case 'parents': {
          const c = snap.commits.find(x => x.oid === snap.head.oid)
          ok = !!c && c.parents.length === Number(arg); label = Number(arg) === 2 ? 'The last commit is a merge commit' : `The last commit has ${arg} parent(s)`; break
        }
        case 'linear': {
          const list = snap.head.oid ? await shell.commitsFrom(dir!, [snap.head.oid]) : []
          ok = list.every(c => c.commit.parent.length < 2); label = 'The history is a straight line (no merge commits)'; break
        }
        case 'nooperation': ok = !snap.op && !snap.conflicts.length; label = 'No merge, rebase or cherry-pick is half-finished'; break
        case 'stash': ok = snap.stash === Number(arg); label = `The stash has ${arg} entr${arg === '1' ? 'y' : 'ies'}`; break
        case 'remote': {
          const out = stripAnsi(await shell.run('git remote'))
          ok = out.split('\n').includes(arg); label = `A remote called ${arg} exists`; break
        }
        case 'pushed': {
          ok = !!snap.branches[arg] && snap.remotes[`origin/${arg}`] === snap.branches[arg]
          label = `origin/${arg} matches your ${arg} branch`; break
        }
        case 'config': {
          const [key, ...val] = rest
          const v = stripAnsi(await shell.run(`git config ${key}`)).trim()
          ok = val.length ? v === val.join(' ') : !!v; label = val.length ? `${key} is "${val.join(' ')}"` : `${key} is set`; break
        }
        case 'same': {
          // same <rev> <rev>: two names point at the same commit
          const [a, b] = rest
          ok = (await shell.resolve(dir!, a)) === (await shell.resolve(dir!, b)); label = `${a} and ${b} point at the same commit`; break
        }
        case 'run': {
          // run <command> => <text the output must contain>
          const [cmd, expect] = arg.split('=>').map(s => s.trim())
          const outText = stripAnsi(await shell.run(cmd))
          ok = outText.includes(expect); label = `"${cmd}" shows "${expect}"`; break
        }
        default: label = `Unknown check "${kind}"`
      }
    } catch { ok = false }
    out.push({ check, ok, label })
  }
  return out
}

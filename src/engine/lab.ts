// A lab is one terminal + repository the learner plays with. Each lab has
// its own disk in the browser (IndexedDB), so the playground survives a reload.
import LightningFS from '@isomorphic-git/lightning-fs'
import { Shell } from './shell'

export class Lab {
  readonly name: string
  readonly shell: Shell
  ready: Promise<void>
  private typer?: (cmd: string) => Promise<void>
  private resetListeners = new Set<() => void>()

  constructor(name: string, setup: string[] = [], keep = false) {
    this.name = name
    this.shell = new Shell(new LightningFS(`bossgit-${name}`, { wipe: !keep } as any) as any)
    this.ready = this.prepare(setup, keep)
  }

  private async prepare(setup: string[], keep: boolean) {
    const sh = this.shell
    const fresh = !(await sh.exists('/.bossgit/global.json'))
    await sh.boot()
    if (!keep || fresh) {
      await sh.run('bossgit identity')
      await sh.script(setup)
    } else {
      const repo = await sh.findRepo(sh.cwd + '/project')
      if (repo) sh.cwd = repo
    }
    sh.history = []
  }

  /** wipe the disk and run the setup again */
  async reset(setup: string[] = []) {
    this.shell.useFs(new LightningFS(`bossgit-${this.name}`, { wipe: true } as any) as any)
    this.ready = this.prepare(setup, false)
    await this.ready
    this.resetListeners.forEach(f => f())
  }

  onReset(fn: () => void) { this.resetListeners.add(fn); return () => { this.resetListeners.delete(fn) } }

  /** the terminal registers itself so lesson buttons can type into it */
  attachTyper(fn: (cmd: string) => Promise<void>) { this.typer = fn; return () => { if (this.typer === fn) this.typer = undefined } }

  private typeListeners = new Set<() => void>()
  onType(fn: () => void) { this.typeListeners.add(fn); return () => { this.typeListeners.delete(fn) } }

  async type(cmd: string) {
    this.typeListeners.forEach(f => f())
    await this.ready
    if (this.typer) await this.typer(cmd)
    else await this.shell.run(cmd)
  }
}

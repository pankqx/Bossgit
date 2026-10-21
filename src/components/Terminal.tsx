import { useEffect, useRef } from 'react'
import { Terminal as XTerm } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import type { Lab } from '../engine/lab'

const COMMANDS = ['git', 'ls', 'cd', 'pwd', 'cat', 'echo', 'mkdir', 'touch', 'rm', 'mv', 'cp', 'tree', 'clear', 'help', 'history']
const GIT_SUBS = ['init', 'status', 'add', 'commit', 'log', 'show', 'diff', 'branch', 'switch', 'checkout', 'restore', 'reset', 'merge', 'rebase', 'cherry-pick', 'revert', 'stash', 'tag', 'reflog', 'remote', 'push', 'pull', 'fetch', 'clone', 'config', 'blame', 'cat-file', 'rev-parse', 'rm', 'mv', 'shortlog', 'help']

const theme = {
  background: '#1c1916', foreground: '#e8e1d7', cursor: '#e8664a', cursorAccent: '#1c1916',
  selectionBackground: '#e8664a55',
  black: '#2a2622', red: '#e8664a', green: '#9cc28a', yellow: '#e0b25a', blue: '#86a7c9', magenta: '#c99ac0', cyan: '#7cc4bd', white: '#e8e1d7',
  brightBlack: '#6f665d', brightRed: '#f08a70', brightGreen: '#b4d6a3', brightYellow: '#ecc77c', brightBlue: '#a5c0dc', brightMagenta: '#dcb5d4', brightCyan: '#9dd8d1', brightWhite: '#ffffff',
}

export default function Terminal({ lab, height = 320, welcome }: { lab: Lab; height?: number; welcome?: string }) {
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const term = new XTerm({
      fontFamily: '"JetBrains Mono", ui-monospace, Menlo, monospace',
      fontSize: 13.5, lineHeight: 1.35, cursorBlink: true, theme, scrollback: 3000, allowProposedApi: true,
      convertEol: false,
    })
    const fit = new FitAddon()
    term.loadAddon(fit)
    term.open(host.current!)
    const doFit = () => { try { fit.fit() } catch {} }
    doFit()
    const ro = new ResizeObserver(doFit)
    ro.observe(host.current!)

    const sh = lab.shell
    let buf = ''
    let pos = 0
    let busy = true
    let hIndex = -1
    let prompt = ''
    let disposed = false
    const write = (s: string) => new Promise<void>(r => term.write(s.replace(/\r?\n/g, '\r\n'), r))

    const redraw = () => {
      term.write('\r\x1b[K' + prompt + buf)
      const back = buf.length - pos
      if (back > 0) term.write(`\x1b[${back}D`)
    }
    const showPrompt = async () => {
      prompt = await sh.prompt()
      buf = ''; pos = 0; hIndex = -1
      await write(prompt)
      busy = false
    }
    const execute = async (line: string) => {
      busy = true
      await write('\r\n')
      if (line.trim() === 'clear') term.clear()
      else {
        const out = await sh.run(line)
        if (disposed) return
        if (out.includes('\x1b[2J')) term.clear()
        else if (out) await write(out.endsWith('\n') ? out : out + '\n')
      }
      await showPrompt()
    }

    const complete = async () => {
      const before = buf.slice(0, pos)
      const parts = before.split(/\s+/)
      const word = parts[parts.length - 1]
      let options: string[] = []
      if (parts.length === 1) options = COMMANDS.filter(c => c.startsWith(word))
      else if (parts[0] === 'git' && parts.length === 2) options = GIT_SUBS.filter(c => c.startsWith(word))
      else {
        const snap = await sh.snapshot()
        const refs = parts[0] === 'git' && ['switch', 'checkout', 'merge', 'rebase', 'branch', 'cherry-pick', 'reset', 'log', 'diff', 'show', 'push', 'pull'].includes(parts[1])
          ? [...Object.keys(snap.branches), ...Object.keys(snap.remotes), ...Object.keys(snap.tags)].filter(b => b.startsWith(word))
          : []
        options = [...new Set([...refs, ...(await sh.complete(word))])]
      }
      if (options.length === 1) {
        const add = options[0].slice(word.length) + (options[0].endsWith('/') ? '' : ' ')
        buf = buf.slice(0, pos) + add + buf.slice(pos); pos += add.length; redraw()
      } else if (options.length > 1) {
        let common = options[0]
        for (const o of options) while (!o.startsWith(common)) common = common.slice(0, -1)
        if (common.length > word.length) {
          const add = common.slice(word.length)
          buf = buf.slice(0, pos) + add + buf.slice(pos); pos += add.length; redraw()
        } else { await write('\r\n' + options.join('  ') + '\r\n'); redraw() }
      }
    }

    const onData = term.onData(async data => {
      if (busy) return
      if (data.length > 1 && !data.startsWith('\x1b')) {
        // pasted text: run line by line
        const lines = data.replace(/\r\n?/g, '\n').split('\n')
        for (let i = 0; i < lines.length; i++) {
          const piece = lines[i]
          buf = buf.slice(0, pos) + piece + buf.slice(pos); pos += piece.length
          if (i < lines.length - 1) { redraw(); const l = buf; await execute(l) } else redraw()
        }
        return
      }
      switch (data) {
        case '\r': await execute(buf); return
        case '\x7f': case '\b': if (pos > 0) { buf = buf.slice(0, pos - 1) + buf.slice(pos); pos--; redraw() } return
        case '\x1b[3~': if (pos < buf.length) { buf = buf.slice(0, pos) + buf.slice(pos + 1); redraw() } return
        case '\x1b[D': if (pos > 0) { pos--; term.write(data) } return
        case '\x1b[C': if (pos < buf.length) { pos++; term.write(data) } return
        case '\x1b[H': case '\x01': pos = 0; redraw(); return
        case '\x1b[F': case '\x05': pos = buf.length; redraw(); return
        case '\x1b[A': case '\x1b[B': {
          const h = sh.history
          if (!h.length) return
          if (data === '\x1b[A') hIndex = hIndex < 0 ? h.length - 1 : Math.max(0, hIndex - 1)
          else hIndex = hIndex < 0 ? -1 : hIndex + 1
          if (hIndex >= h.length) hIndex = -1
          buf = hIndex < 0 ? '' : h[hIndex]; pos = buf.length; redraw(); return
        }
        case '\t': await complete(); return
        case '\x03': await write('^C\r\n'); await showPrompt(); return
        case '\x0c': term.clear(); redraw(); return
        case '\x15': buf = buf.slice(pos); pos = 0; redraw(); return
      }
      if (data >= ' ' && !data.startsWith('\x1b')) { buf = buf.slice(0, pos) + data + buf.slice(pos); pos += data.length; redraw() }
    })

    const detach = lab.attachTyper(async (cmd: string) => {
      while (busy) await new Promise(r => setTimeout(r, 30))
      busy = true
      buf = ''; pos = 0; redraw()
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      for (const ch of cmd) {
        buf += ch; pos++; term.write(ch)
        if (!reduce) await new Promise(r => setTimeout(r, 14))
      }
      await execute(cmd)
      term.focus()
    })

    let generation = 0
    const start = async () => {
      const mine = ++generation
      await lab.ready
      if (disposed || mine !== generation) return
      term.reset()
      if (welcome) await write(welcome + '\n')
      await showPrompt()
    }
    const offReset = lab.onReset(() => { busy = true; start() })
    start()

    return () => { disposed = true; onData.dispose(); detach(); offReset(); ro.disconnect(); term.dispose() }
  }, [lab, welcome])

  return (
    <div className="term-shell rounded-xl overflow-hidden" style={{ background: theme.background }} onClick={() => host.current?.querySelector('textarea')?.focus()}>
      <div ref={host} style={{ height }} />
    </div>
  )
}

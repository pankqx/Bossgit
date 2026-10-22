// Turns the Markdown files in /content into modules and lessons.
// A lesson is plain Markdown plus a few special fenced blocks:
//   ```try      commands the reader can run in the lab with one click
//   ```quiz     multiple choice questions
//   ```mission  a goal in the lab that BossGit checks for you
//   ```fact  ```tip  ```warn  ```story   coloured boxes
//   ```flow     a Mermaid flowchart

export type Block =
  | { type: 'md'; text: string }
  | { type: 'try'; commands: string[] }
  | { type: 'quiz'; questions: Question[] }
  | { type: 'mission'; mission: Mission }
  | { type: 'box'; kind: 'fact' | 'tip' | 'warn' | 'story'; text: string }
  | { type: 'flow'; code: string }
  | { type: 'solution'; text: string }

export type Question = { id: string; q: string; options: string[]; answer: number; why: string }
export type Mission = { id: string; title: string; goal: string; setup: string[]; checks: string[]; hints: string[]; boss: boolean }

export function frontmatter(src: string): { data: Record<string, string>; body: string } {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!m) return { data: {}, body: src }
  const data: Record<string, string> = {}
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([\w-]+):\s*(.*)$/)
    if (kv) data[kv[1]] = kv[2].replace(/^["']|["']$/g, '')
  }
  return { data, body: src.slice(m[0].length) }
}

const BOXES = ['fact', 'tip', 'warn', 'story']

export function parseBlocks(body: string, lessonId: string): Block[] {
  const blocks: Block[] = []
  const re = /^```(\w+)[^\n]*\n([\s\S]*?)^```[ \t]*$/gm
  let last = 0
  let quizCount = 0
  let missionCount = 0
  let m: RegExpExecArray | null
  const pushMd = (text: string) => { if (text.trim()) blocks.push({ type: 'md', text }) }
  while ((m = re.exec(body))) {
    const [whole, kind, inner] = m
    const known = ['try', 'quiz', 'mission', 'flow', 'solution', ...BOXES].includes(kind)
    if (!known) continue
    pushMd(body.slice(last, m.index))
    last = m.index + whole.length
    if (kind === 'try') blocks.push({ type: 'try', commands: inner.split('\n').map(s => s.trim()).filter(Boolean) })
    else if (kind === 'flow') blocks.push({ type: 'flow', code: inner })
    else if (kind === 'solution') blocks.push({ type: 'solution', text: inner })
    else if (kind === 'quiz') blocks.push({ type: 'quiz', questions: parseQuiz(inner, `${lessonId}/q${++quizCount}`) })
    else if (kind === 'mission') blocks.push({ type: 'mission', mission: parseMission(inner, `${lessonId}/m${++missionCount}`) })
    else blocks.push({ type: 'box', kind: kind as 'fact', text: inner })
  }
  pushMd(body.slice(last))
  return blocks
}

function parseQuiz(src: string, id: string): Question[] {
  const out: Question[] = []
  let cur: Question | null = null
  for (const raw of src.split('\n')) {
    const line = raw.trim()
    if (!line) continue
    if (line.startsWith('q:')) {
      cur = { id: `${id}-${out.length + 1}`, q: line.slice(2).trim(), options: [], answer: -1, why: '' }
      out.push(cur)
    } else if (cur && line.startsWith('- ')) {
      let opt = line.slice(2).trim()
      if (/^\[x\]\s*/i.test(opt)) { cur.answer = cur.options.length; opt = opt.replace(/^\[x\]\s*/i, '') }
      cur.options.push(opt)
    } else if (cur && line.startsWith('why:')) cur.why = line.slice(4).trim()
    else if (cur && cur.why) cur.why += ' ' + line
  }
  return out
}

function parseMission(src: string, id: string): Mission {
  const m: Mission = { id, title: 'Mission', goal: '', setup: [], checks: [], hints: [], boss: false }
  for (const raw of src.split('\n')) {
    const line = raw.trim()
    const kv = line.match(/^(\w+):\s*(.*)$/)
    if (!kv) { if (line && m.goal) m.goal += ' ' + line; continue }
    const [, k, v] = kv
    if (k === 'title') m.title = v
    else if (k === 'goal') m.goal = v
    else if (k === 'setup') m.setup.push(v)
    else if (k === 'check') m.checks.push(v)
    else if (k === 'hint') m.hints.push(v)
    else if (k === 'boss') m.boss = v === 'true' || v === 'yes'
  }
  return m
}

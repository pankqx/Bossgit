// Practice problems: one Markdown file each in /problems.
import { frontmatter, parseBlocks, type Block, type Mission } from './parse'

export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type Problem = {
  slug: string
  number: number
  title: string
  difficulty: Difficulty
  tags: string[]
  statement: Block[]
  mission: Mission
  solution?: string
}

const files = import.meta.glob('../../problems/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

export const problems: Problem[] = Object.entries(files)
  .map(([path, src]): Problem | null => {
    const slug = path.match(/problems\/([^/]+)\.md$/)?.[1]
    if (!slug) return null
    const { data, body } = frontmatter(src)
    const blocks = parseBlocks(body, `problem/${slug}`)
    const m = blocks.find(b => b.type === 'mission')
    if (!m || m.type !== 'mission') return null
    const sol = blocks.find(b => b.type === 'solution')
    return {
      slug,
      number: Number(slug.match(/^\d+/)?.[0] ?? 0),
      title: data.title ?? slug,
      difficulty: (['Easy', 'Medium', 'Hard'].includes(data.difficulty) ? data.difficulty : 'Easy') as Difficulty,
      tags: (data.tags ?? '').split(',').map(t => t.trim()).filter(Boolean),
      statement: blocks.filter(b => b.type !== 'mission' && b.type !== 'solution'),
      mission: m.mission,
      solution: sol && sol.type === 'solution' ? sol.text : undefined,
    }
  })
  .filter((p): p is Problem => !!p)
  .sort((a, b) => a.number - b.number)

export const findProblem = (slug?: string) => problems.find(p => p.slug === slug)
export const allTags = [...new Set(problems.flatMap(p => p.tags))].sort()

/** the same problem for everyone on a given day, preferring ones you have not solved */
export function problemOfTheDay(solved: Record<string, string>): Problem | undefined {
  const day = Math.floor(Date.now() / 86400000)
  const pool = problems.filter(p => !solved[p.slug])
  const list = pool.length ? pool : problems
  return list[day % Math.max(1, list.length)]
}

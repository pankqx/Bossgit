// Small line-based diff tools: an LCS diff for `git diff`, and a diff3
// three-way merge for merge, cherry-pick, revert and rebase.

export type DiffLine = { op: ' ' | '+' | '-'; text: string }

export function splitLines(text: string): string[] {
  if (text === '') return []
  const lines = text.split('\n')
  if (lines[lines.length - 1] === '') lines.pop()
  return lines
}

// Pairs of matching indexes [ai, bi] from the longest common subsequence.
function lcsPairs(a: string[], b: string[]): [number, number][] {
  const n = a.length, m = b.length
  const dp: Uint32Array[] = []
  for (let i = 0; i <= n; i++) dp.push(new Uint32Array(m + 1))
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
  const pairs: [number, number][] = []
  let i = 0, j = 0
  while (i < n && j < m) {
    if (a[i] === b[j]) { pairs.push([i, j]); i++; j++ }
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++
    else j++
  }
  return pairs
}

export function diffLines(a: string[], b: string[]): DiffLine[] {
  const out: DiffLine[] = []
  let i = 0, j = 0
  for (const [pi, pj] of [...lcsPairs(a, b), [a.length, b.length] as [number, number]]) {
    while (i < pi) out.push({ op: '-', text: a[i++] })
    while (j < pj) out.push({ op: '+', text: b[j++] })
    if (pi < a.length) { out.push({ op: ' ', text: a[pi] }); i++; j++ }
  }
  return out
}

// Unified diff hunks with 3 lines of context, like `git diff`.
export function unifiedHunks(oldText: string, newText: string, context = 3): string[] {
  const a = splitLines(oldText), b = splitLines(newText)
  const lines = diffLines(a, b)
  const out: string[] = []
  let k = 0
  while (k < lines.length) {
    if (lines[k].op === ' ') { k++; continue }
    let start = Math.max(0, k - context)
    let end = k
    // extend the hunk while changes are close together
    while (end < lines.length) {
      if (lines[end].op !== ' ') { end++; continue }
      let run = 0
      while (end + run < lines.length && lines[end + run].op === ' ') run++
      if (end + run >= lines.length || run > context * 2) { end = Math.min(lines.length, end + context); break }
      end += run
    }
    let oldStart = 1, newStart = 1
    for (let x = 0; x < start; x++) { if (lines[x].op !== '+') oldStart++; if (lines[x].op !== '-') newStart++ }
    const slice = lines.slice(start, end)
    const oldLen = slice.filter(l => l.op !== '+').length
    const newLen = slice.filter(l => l.op !== '-').length
    out.push(`@@ -${oldLen ? oldStart : oldStart - 1},${oldLen} +${newLen ? newStart : newStart - 1},${newLen} @@`)
    for (const l of slice) out.push(l.op + l.text)
    k = end
  }
  return out
}

export type Merge3 = { text: string; conflict: boolean }

// diff3: anchors are base lines kept by both sides. Between anchors, take
// whichever side changed; if both changed differently, write conflict markers.
export function merge3(base: string, ours: string, theirs: string, oursLabel: string, theirsLabel: string): Merge3 {
  if (ours === theirs) return { text: ours, conflict: false }
  if (base === ours) return { text: theirs, conflict: false }
  if (base === theirs) return { text: ours, conflict: false }
  const b = splitLines(base), o = splitLines(ours), t = splitLines(theirs)
  const mo = new Map(lcsPairs(b, o)), mt = new Map(lcsPairs(b, t))
  const anchors: [number, number, number][] = []
  for (let i = 0; i < b.length; i++) if (mo.has(i) && mt.has(i)) anchors.push([i, mo.get(i)!, mt.get(i)!])
  anchors.push([b.length, o.length, t.length])
  const out: string[] = []
  let conflict = false
  let bi = 0, oi = 0, ti = 0
  const same = (x: string[], y: string[]) => x.length === y.length && x.every((v, i) => v === y[i])
  for (const [ab, ao, at] of anchors) {
    const bc = b.slice(bi, ab), oc = o.slice(oi, ao), tc = t.slice(ti, at)
    if (same(oc, tc) || same(bc, tc)) out.push(...oc)
    else if (same(bc, oc)) out.push(...tc)
    else {
      conflict = true
      out.push(`<<<<<<< ${oursLabel}`, ...oc, '=======', ...tc, `>>>>>>> ${theirsLabel}`)
    }
    if (ab < b.length) out.push(b[ab])
    bi = ab + 1; oi = ao + 1; ti = at + 1
  }
  return { text: out.length ? out.join('\n') + '\n' : '', conflict }
}

import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="gutter max-w-[900px] mx-auto py-28">
      <pre className="font-mono text-sm text-signal mb-8">fatal: ambiguous argument 'this-page': unknown revision or path not in the working tree.</pre>
      <h1 className="font-display font-extrabold text-6xl tracking-tight">Detached from reality.</h1>
      <p className="mt-4 font-serif text-xl text-ink-2">This page does not exist. Let's switch back to a branch that does.</p>
      <Link to="/" className="inline-block mt-8 px-6 py-3 rounded-full bg-ink text-paper font-semibold">git switch home</Link>
    </div>
  )
}

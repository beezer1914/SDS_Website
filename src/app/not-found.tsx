import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="font-display text-4xl text-sigma-dark">Page not found</h1>
      <p className="mt-3 text-muted">That page may have moved when we rebuilt the site.</p>
      <Link href="/" className="mt-8 inline-block font-semibold text-sigma">← Back to home</Link>
    </div>
  );
}

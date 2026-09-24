import Link from "next/link";

export const metadata = { title: "Message sent", robots: { index: false } };

export default function ThanksPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="font-display text-4xl text-sigma-dark">Thank you</h1>
      <p className="mt-3 text-muted">Your message was sent. A brother will get back to you soon.</p>
      <Link href="/" className="mt-8 inline-block font-semibold text-sigma">← Back to home</Link>
    </div>
  );
}

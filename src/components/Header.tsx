"use client";

import Link from "next/link";
import { useState } from "react";
import { CHAPTEROPS_URL } from "@/lib/site";

export type NavGroup = { label: string; links: { title: string; href: string }[] };

export default function Header({ groups }: { groups: NavGroup[] }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-sigma-light bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3" onClick={close}>
          <span className="grid h-11 w-11 place-items-center rounded-full bg-sigma font-display text-lg text-white">
            ΣΔΣ
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg text-sigma-dark">Sigma Delta Sigma</span>
            <span className="block text-xs text-muted">Phi Beta Sigma Fraternity, Inc.</span>
          </span>
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {groups.map((g) => (
            <div key={g.label} className="group relative">
              <button className="rounded px-3 py-2 text-sm font-medium hover:text-sigma" aria-haspopup="true">
                {g.label} <span aria-hidden>▾</span>
              </button>
              <div className="invisible absolute left-0 top-full w-60 rounded-lg border border-sigma-light bg-white py-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                {g.links.map((l) => (
                  <Link key={l.href} href={l.href} className="block px-4 py-2 text-sm hover:bg-sigma-light">
                    {l.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <Link href="/events/" className="rounded px-3 py-2 text-sm font-medium hover:text-sigma">Events</Link>
          <Link href="/contact/" className="rounded px-3 py-2 text-sm font-medium hover:text-sigma">Contact</Link>
          <a href={CHAPTEROPS_URL} className="ml-2 rounded-full bg-sigma px-4 py-2 text-sm font-semibold text-white hover:bg-sigma-dark">
            Members
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          className="rounded p-2 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span className="block h-0.5 w-6 bg-ink" />
          <span className="mt-1.5 block h-0.5 w-6 bg-ink" />
          <span className="mt-1.5 block h-0.5 w-6 bg-ink" />
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t border-sigma-light px-4 pb-6 lg:hidden" aria-label="Mobile">
          {groups.map((g) => (
            <div key={g.label} className="border-b border-sigma-light py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">{g.label}</p>
              {g.links.map((l) => (
                <Link key={l.href} href={l.href} onClick={close} className="block py-1.5">
                  {l.title}
                </Link>
              ))}
            </div>
          ))}
          <Link href="/events/" onClick={close} className="block border-b border-sigma-light py-3">Events</Link>
          <Link href="/contact/" onClick={close} className="block border-b border-sigma-light py-3">Contact</Link>
          <a href={CHAPTEROPS_URL} className="mt-4 block rounded-full bg-sigma py-3 text-center font-semibold text-white">
            Members (ChapterOps)
          </a>
        </nav>
      )}
    </header>
  );
}

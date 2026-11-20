// Demo mode (no Sanity project connected): render the starter content that
// editors import into Sanity, so there is one source of sample content.
import { readFileSync } from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import type { Page, Section, SiteSettings } from "@/lib/content";

type SeedDoc = Record<string, unknown> & { _type: string; slug?: { current: string } };

const docs: SeedDoc[] = readFileSync(path.join(process.cwd(), "studio/seed/starter-content.ndjson"), "utf8")
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line));

export const sampleSettings = (docs.find((d) => d._type === "siteSettings") ?? {}) as SiteSettings;

export const samplePages: Page[] = docs
  .filter((d) => d._type === "page")
  .map((d) => ({ ...d, slug: d.slug!.current, section: d.section ?? "none" }) as unknown as Page);

// Only replace fields that exactly match a previously shipped starter value.
const originals: Pick<Page, "slug" | "sections" | "summary">[] = readFileSync(
  path.join(process.cwd(), "studio/seed/original-sections.ndjson"), "utf8",
).trim().split("\n").map((line) => JSON.parse(line));

export function refreshStarterSummary<T extends Pick<Page, "slug" | "summary">>(page: T): T {
  if (!page.summary || !originals.some((p) => p.slug === page.slug && p.summary === page.summary)) return page;
  const current = samplePages.find((p) => p.slug === page.slug);
  return current ? { ...page, summary: current.summary } : page;
}

export function refreshStarterFields(page: Page): Page {
  const previous = originals.filter((p) => p.slug === page.slug).flatMap((p) => p.sections ?? []);
  const current = samplePages.find((p) => p.slug === page.slug);
  if (!previous.length || !current || !page.sections) return page;
  return { ...page, sections: page.sections.map((section) => {
    const matches = (s: Section) => s._key === section._key && s._type === section._type;
    const candidates = previous.filter(matches);
    const revised = current.sections?.find((s) => s._key === section._key);
    if (!candidates.length || !revised) return section;
    if (section._type !== revised._type) return candidates.some((old) => isDeepStrictEqual(section, old)) ? revised : section;
    const fields = Object.fromEntries(Object.entries(revised).filter(([key]) =>
      candidates.some((old) => Object.hasOwn(old, key) && isDeepStrictEqual(Reflect.get(section, key), Reflect.get(old, key))),
    ));
    return { ...section, ...fields };
  }) };
}

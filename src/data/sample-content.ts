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

// Existing projects may have imported the original starter text. Apply revised
// defaults only to fields that still exactly match that first import.
const originals: Pick<Page, "slug" | "sections" | "summary">[] = readFileSync(
  path.join(process.cwd(), "studio/seed/original-sections.ndjson"), "utf8",
).trim().split("\n").map((line) => JSON.parse(line));

export function refreshStarterSummary<T extends Pick<Page, "slug" | "summary">>(page: T): T {
  const original = originals.find((p) => p.slug === page.slug);
  if (!original?.summary || page.summary !== original.summary) return page;
  const current = samplePages.find((p) => p.slug === page.slug);
  return current ? { ...page, summary: current.summary } : page;
}

export function refreshStarterFields(page: Page): Page {
  const original = originals.find((p) => p.slug === page.slug);
  const current = samplePages.find((p) => p.slug === page.slug);
  if (!original || !current || !page.sections) return page;
  return { ...page, sections: page.sections.map((section) => {
    const matches = (s: Section) => s._key === section._key && s._type === section._type;
    const old = original.sections?.find(matches);
    const revised = current.sections?.find((s) => s._key === section._key);
    if (!old || !revised) return section;
    if (old._type !== revised._type) return isDeepStrictEqual(section, old) ? revised : section;
    const fields = Object.fromEntries(Object.entries(old).filter(([key, value]) =>
      Object.hasOwn(revised, key) && isDeepStrictEqual(Reflect.get(section, key), value),
    ).map(([key]) => [key, Reflect.get(revised, key)]));
    return { ...section, ...fields };
  }) };
}

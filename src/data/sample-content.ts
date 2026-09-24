// Demo mode (no Sanity project connected): render the starter content that
// editors import into Sanity, so there is one source of sample content.
import { readFileSync } from "node:fs";
import path from "node:path";
import type { Page, SiteSettings } from "@/lib/content";

type SeedDoc = Record<string, unknown> & { _type: string; slug?: { current: string } };

const docs: SeedDoc[] = readFileSync(path.join(process.cwd(), "studio/seed/starter-content.ndjson"), "utf8")
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line));

export const sampleSettings = (docs.find((d) => d._type === "siteSettings") ?? {}) as SiteSettings;

export const samplePages: Page[] = docs
  .filter((d) => d._type === "page")
  .map((d) => ({ ...d, slug: d.slug!.current, section: d.section ?? "none" }) as unknown as Page);

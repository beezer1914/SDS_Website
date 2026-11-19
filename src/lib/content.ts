import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { SectionKey } from "./site";
import type { Page as PageDoc, SiteSettings as SettingsDoc } from "@/sanity.types";
import { refreshStarterFields, refreshStarterSummary, samplePages, sampleSettings } from "@/data/sample-content";

export type SiteSettings = Omit<SettingsDoc, "_id" | "_type" | "_createdAt" | "_updatedAt" | "_rev">;
export type Section = NonNullable<PageDoc["sections"]>[number];

export type PageSummary = {
  title: string;
  slug: string;
  section: SectionKey | "none";
  summary?: string;
};

export type Page = PageSummary & Pick<PageDoc, "sections" | "body" | "hideTitle">;

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// Until a Sanity project is connected, the site renders the starter content in studio/seed/.
const client = projectId
  ? createClient({ projectId, dataset, apiVersion: "2025-01-01", useCdn: false })
  : null;

const imageBuilder = projectId ? createImageUrlBuilder({ projectId, dataset }) : null;

export function imageUrl(source: unknown, width = 1200): string | null {
  return imageBuilder && source ? imageBuilder.image(source as never).width(width).auto("format").url() : null;
}

export async function getSettings(): Promise<SiteSettings> {
  if (!client) return sampleSettings;
  return (await client.fetch(`*[_type == "siteSettings"][0]`)) ?? {};
}

export async function getAllPages(): Promise<PageSummary[]> {
  if (!client) return samplePages;
  const pages = await client.fetch<PageSummary[]>(
    `*[_type == "page" && defined(slug.current)] | order(navOrder asc, title asc){
      title, "slug": slug.current, "section": coalesce(section, "none"), summary
    }`,
  );
  return pages.map(refreshStarterSummary);
}

export async function getPage(slug: string): Promise<Page | null> {
  if (!client) return samplePages.find((p) => p.slug === slug) ?? null;
  const page = await client.fetch<Page | null>(
    `*[_type == "page" && slug.current == $slug][0]{
      title, "slug": slug.current, "section": coalesce(section, "none"), summary, hideTitle, sections, body
    }`,
    { slug },
  );
  return page ? refreshStarterFields(refreshStarterSummary(page)) : null;
}

export async function getHomePage(): Promise<Page | null> {
  const [home, pages] = await Promise.all([getPage("home"), getAllPages()]);
  if (!home?.sections) return home;

  const programs = new Map(pages.filter((p) => p.section === "programs").map((p) => [`/${p.slug}`, p]));
  const sections = home.sections.map((section) => {
    if (section._type !== "cardGrid" || !section.cards) return section;
    const cards = section.cards.map((card) => {
      const path = card.link?.split(/[?#]/, 1)[0].replace(/\/$/, "");
      const program = path && programs.get(path);
      return program ? { ...card, title: program.title, text: program.summary } : card;
    });
    return { ...section, cards };
  });
  return { ...home, sections };
}

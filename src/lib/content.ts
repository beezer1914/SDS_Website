import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { SectionKey } from "./site";
import type { Page as PageDoc, SiteSettings as SettingsDoc } from "@/sanity.types";
import { samplePages, sampleSettings } from "@/data/sample-content";

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
  return client.fetch(
    `*[_type == "page" && defined(slug.current)] | order(navOrder asc, title asc){
      title, "slug": slug.current, "section": coalesce(section, "none"), summary
    }`,
  );
}

export async function getPage(slug: string): Promise<Page | null> {
  if (!client) return samplePages.find((p) => p.slug === slug) ?? null;
  return client.fetch(
    `*[_type == "page" && slug.current == $slug][0]{
      title, "slug": slug.current, "section": coalesce(section, "none"), summary, hideTitle, sections, body
    }`,
    { slug },
  );
}

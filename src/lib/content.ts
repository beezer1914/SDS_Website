import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { PortableTextBlock } from "@portabletext/react";
import type { SectionKey } from "./site";
import { samplePages, sampleSettings } from "@/data/sample-content";

export type SiteSettings = {
  heroTitle: string;
  heroSubtitle: string;
  welcomeMessage: PortableTextBlock[];
  presidentName: string;
  contactEmail: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
};

export type PageSummary = {
  title: string;
  slug: string;
  section: SectionKey | "none";
  summary?: string;
};

export type Page = PageSummary & {
  body: PortableTextBlock[];
};

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// Until a Sanity project is connected, the site renders from src/data/sample-content.ts.
const client = projectId
  ? createClient({ projectId, dataset, apiVersion: "2025-01-01", useCdn: false })
  : null;

const imageBuilder = projectId ? createImageUrlBuilder({ projectId, dataset }) : null;

export function imageUrl(source: unknown, width = 1200): string | null {
  return imageBuilder ? imageBuilder.image(source as never).width(width).auto("format").url() : null;
}

export async function getSettings(): Promise<SiteSettings> {
  if (!client) return sampleSettings;
  return client.fetch(`*[_type == "siteSettings"][0]`);
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
      title, "slug": slug.current, "section": coalesce(section, "none"), summary, body
    }`,
    { slug },
  );
}

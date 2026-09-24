// Placeholder content so the site builds before Sanity is connected.
// Slugs match the current WordPress URLs so old links keep working.
import type { Page, SiteSettings } from "@/lib/content";

const text = (s: string) => [
  { _type: "block", _key: s.slice(0, 8), style: "normal", markDefs: [], children: [{ _type: "span", _key: "s", text: s, marks: [] }] },
];

const placeholder = text("Placeholder content. This page will be filled in during the content migration.");

export const sampleSettings: SiteSettings = {
  heroTitle: "A Brotherhood Like No Other",
  heroSubtitle: "Am I My Brother's Keeper? | Matthew 25:35-40",
  welcomeMessage: text(
    "Welcome to the home page of the Sigma Delta Sigma chapter of Phi Beta Sigma Fraternity Inc. Woodstock, GA is our base of operation, but we are dedicated to providing services in the name of Sigma where we are needed.",
  ),
  presidentName: "Sam Mitchell",
  contactEmail: "sigmadeltasigma@sds1914.com",
  facebookUrl: "https://www.facebook.com/groups/2342842425761621/",
  instagramUrl: "https://instagram.com/sdssigmas",
  youtubeUrl: "https://www.youtube.com/channel/UCp2-YDx5vgBD2AsEx5QBl_w",
};

export const samplePages: Page[] = [
  { title: "History and Mission", slug: "history", section: "about", body: placeholder },
  { title: "The Founders", slug: "the-founders", section: "about", body: placeholder },
  { title: "President's Message", slug: "message", section: "about", body: placeholder },
  { title: "Chapter History", slug: "chapter-history", section: "about", body: placeholder },
  { title: "Bigger & Better Business", slug: "bigger-better-business", section: "programs", summary: "Supporting Black-owned businesses and entrepreneurship.", body: placeholder },
  { title: "Education", slug: "education", section: "programs", summary: "Scholarships and mentorship for the next generation.", body: placeholder },
  { title: "Social Action", slug: "social-action", section: "programs", summary: "Civic engagement, health, and service in our community.", body: placeholder },
  { title: "Men's Health", slug: "mens-health", section: "webinars", body: placeholder },
];

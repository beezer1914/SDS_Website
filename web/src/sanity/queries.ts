import { defineQuery } from "next-sanity";

export const SITE_SETTINGS_QUERY = defineQuery(
  `*[_type == "siteSettings"][0]{ heroTitle, heroSubtitle, welcomeMessage, presidentName, contactEmail, facebookUrl, instagramUrl, youtubeUrl }`
);

export const NAV_PAGES_QUERY = defineQuery(
  `*[_type == "page" && section != "none" && defined(slug.current)] | order(navOrder asc){ title, "slug": slug.current, section }`
);

export const PAGE_QUERY = defineQuery(
  `*[_type == "page" && slug.current == $slug][0]{ title, summary, body }`
);

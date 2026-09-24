// Fixed site facts that aren't worth putting in the CMS.

export const CHAPTEROPS_URL = "https://chapterops.bluecolumnsystems.com/";

// Nav dropdowns. Editors put a page in a menu by picking its "section" in Sanity.
export const NAV_SECTIONS = [
  { key: "about", label: "About" },
  { key: "programs", label: "Programs" },
  { key: "webinars", label: "Webinars" },
] as const;

export type SectionKey = (typeof NAV_SECTIONS)[number]["key"];

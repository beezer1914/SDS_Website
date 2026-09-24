import { defineArrayMember, defineField, defineType } from "sanity";
import { button, richText } from "./shared";
import { sectionTypes } from "./sections";

// White text must stay readable on the brand color (WCAG AA needs 4.5:1).
function contrastWithWhite(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 1.05 / (0.2126 * r + 0.7152 * g + 0.0722 * b + 0.05);
}

const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "look", title: "Look & feel", default: true },
    { name: "contact", title: "Contact & social" },
  ],
  fields: [
    defineField({
      name: "logo",
      title: "Logo / chapter seal",
      description: "Shown in the top-left corner. A square image works best.",
      type: "image",
      group: "look",
    }),
    defineField({
      name: "brandColor",
      title: "Brand color",
      description: "Used for buttons, banners, and the footer. Leave empty for Sigma royal blue.",
      type: "color",
      options: { disableAlpha: true },
      group: "look",
      validation: (r) =>
        r.custom((v: { hex?: string } | undefined) =>
          !v?.hex || contrastWithWhite(v.hex) >= 4.5
            ? true
            : "White text will be hard to read on this color. Try a darker shade.",
        ).warning(),
    }),
    defineField({
      name: "headingFont",
      title: "Heading font",
      type: "string",
      options: {
        list: [
          { title: "Classic serif (Playfair)", value: "serif" },
          { title: "Modern (Inter)", value: "sans" },
          { title: "Bold & strong (Montserrat)", value: "bold" },
        ],
        layout: "radio",
      },
      initialValue: "serif",
      group: "look",
    }),
    defineField({ name: "contactEmail", title: "Contact email", type: "string", group: "contact", validation: (r) => r.required().email() }),
    defineField({ name: "facebookUrl", title: "Facebook link", type: "url", group: "contact" }),
    defineField({ name: "instagramUrl", title: "Instagram link", type: "url", group: "contact" }),
    defineField({ name: "youtubeUrl", title: "YouTube link", type: "url", group: "contact" }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});

const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "settings", title: "Page settings" },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: ["content", "settings"], validation: (r) => r.required() }),
    defineField({
      name: "sections",
      title: "Page sections",
      description: "Build the page from sections. Add, drag to reorder, or remove them.",
      type: "array",
      group: "content",
      of: sectionTypes.map((t) => defineArrayMember({ type: t.name })),
    }),
    // Pages created before the page builder keep their text here until it's moved into sections.
    {
      ...richText("body", "Old page text"),
      description: "From before sections existed. Move this text into a Text section, then clear it.",
      group: "content",
      hidden: ({ document }) => !(document?.body as unknown[] | undefined)?.length,
    },
    defineField({
      name: "slug",
      title: "Web address",
      description: 'The end of the page\'s link, e.g. sds1914.com/the-founders. Click Generate to create it from the title. The page with web address "home" is the home page.',
      type: "slug",
      group: "settings",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "section",
      title: "Show in menu",
      type: "string",
      group: "settings",
      options: {
        list: [
          { title: "About", value: "about" },
          { title: "Programs", value: "programs" },
          { title: "Webinars", value: "webinars" },
          { title: "Not in menu", value: "none" },
        ],
        layout: "radio",
      },
      initialValue: "none",
    }),
    defineField({ name: "navOrder", title: "Menu position", description: "Lower numbers appear first.", type: "number", group: "settings", initialValue: 10 }),
    defineField({
      name: "summary",
      title: "Short summary",
      description: "One or two sentences. Shown under the page title and in search results.",
      type: "text",
      rows: 2,
      group: "settings",
    }),
    defineField({
      name: "hideTitle",
      title: "Hide the title banner",
      description: "Turn on if the page starts with its own Banner section.",
      type: "boolean",
      group: "settings",
      initialValue: false,
    }),
  ],
  preview: { select: { title: "title", slug: "slug.current", section: "section" }, prepare: ({ title, slug, section }) => ({ title, subtitle: slug === "home" ? "Home page" : section }) },
});

export const schemaTypes = [siteSettings, page, button, ...sectionTypes];

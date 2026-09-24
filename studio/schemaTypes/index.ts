import { defineArrayMember, defineField, defineType } from "sanity";

// Rich text used for page bodies and the welcome message.
const richText = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "array",
    of: [
      defineArrayMember({ type: "block" }),
      defineArrayMember({
        type: "image",
        options: { hotspot: true },
        fields: [defineField({ name: "alt", title: "Describe the image (for screen readers)", type: "string" })],
      }),
      defineArrayMember({
        name: "youtube",
        title: "YouTube video",
        type: "object",
        fields: [
          defineField({ name: "url", title: "YouTube link", type: "url", validation: (r) => r.required() }),
          defineField({ name: "title", type: "string" }),
        ],
        preview: { select: { title: "title", subtitle: "url" }, prepare: (v) => ({ title: v.title || "YouTube video", subtitle: v.subtitle }) },
      }),
    ],
  });

const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "heroTitle", title: "Home page headline", type: "string", validation: (r) => r.required() }),
    defineField({ name: "heroSubtitle", title: "Home page tagline", type: "string" }),
    richText("welcomeMessage", "Welcome message"),
    defineField({ name: "presidentName", title: "Chapter president", type: "string" }),
    defineField({ name: "contactEmail", title: "Contact email", type: "string", validation: (r) => r.required().email() }),
    defineField({ name: "facebookUrl", title: "Facebook link", type: "url" }),
    defineField({ name: "instagramUrl", title: "Instagram link", type: "url" }),
    defineField({ name: "youtubeUrl", title: "YouTube link", type: "url" }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});

const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Web address",
      description: "The end of the page's link, e.g. sds1914.com/the-founders. Click Generate to create it from the title.",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "section",
      title: "Show in menu",
      type: "string",
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
    defineField({ name: "navOrder", title: "Menu position", description: "Lower numbers appear first.", type: "number", initialValue: 10 }),
    defineField({ name: "summary", title: "Short summary", description: "One or two sentences. Shown on program cards and in search results.", type: "text", rows: 2 }),
    richText("body", "Page content"),
  ],
  preview: { select: { title: "title", subtitle: "section" } },
});

export const schemaTypes = [siteSettings, page];

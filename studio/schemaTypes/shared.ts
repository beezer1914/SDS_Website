import { defineArrayMember, defineField, defineType } from "sanity";

// Rich text used inside sections (and the legacy page body).
export const richText = (name: string, title: string) =>
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

// A link can be a page on this site ("/events/") or a full web address ("https://...").
export const linkField = (name = "link", title = "Link") =>
  defineField({
    name,
    title,
    type: "string",
    description: 'A page on this site like "/events/", or a full web address starting with https://',
    validation: (r) =>
      r.custom((v) => !v || /^(\/|https?:\/\/|mailto:)/.test(v) || 'Start with "/" for a page on this site, or "https://"'),
  });

export const imageWithAlt = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [defineField({ name: "alt", title: "Describe the image (for screen readers)", type: "string" })],
  });

export const button = defineType({
  name: "button",
  title: "Button",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Button text", type: "string", validation: (r) => r.required() }),
    { ...linkField(), validation: (r) => r.required() },
    defineField({
      name: "style",
      type: "string",
      options: { list: [{ title: "Filled", value: "solid" }, { title: "Outline", value: "outline" }], layout: "radio", direction: "horizontal" },
      initialValue: "solid",
    }),
  ],
  preview: { select: { title: "label", subtitle: "link" } },
});

// Look-and-feel options every section gets, tucked in a collapsible group.
export const styleFields = [
  defineField({
    name: "background",
    type: "string",
    fieldset: "style",
    options: {
      list: [
        { title: "White", value: "white" },
        { title: "Light tint", value: "light" },
        { title: "Brand color", value: "brand" },
        { title: "Dark", value: "dark" },
      ],
      layout: "radio",
      direction: "horizontal",
    },
    initialValue: "white",
  }),
  defineField({
    name: "spacing",
    title: "Space above and below",
    type: "string",
    fieldset: "style",
    options: {
      list: [
        { title: "Compact", value: "compact" },
        { title: "Normal", value: "normal" },
        { title: "Spacious", value: "spacious" },
      ],
      layout: "radio",
      direction: "horizontal",
    },
    initialValue: "normal",
  }),
];

export const styleFieldset = { name: "style", title: "Style (background & spacing)", options: { collapsible: true, collapsed: true } };

export const columnsField = (initial = 3) =>
  defineField({
    name: "columns",
    title: "Columns on large screens",
    type: "number",
    options: { list: [2, 3, 4], layout: "radio", direction: "horizontal" },
    initialValue: initial,
  });

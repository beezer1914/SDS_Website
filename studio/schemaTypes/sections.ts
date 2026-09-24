import { defineArrayMember, defineField, defineType } from "sanity";
import { BlockContentIcon } from "@sanity/icons/BlockContent";
import { BlockquoteIcon } from "@sanity/icons/Blockquote";
import { BulbOutlineIcon } from "@sanity/icons/BulbOutline";
import { CalendarIcon } from "@sanity/icons/Calendar";
import { ImageIcon } from "@sanity/icons/Image";
import { ImagesIcon } from "@sanity/icons/Images";
import { PlayIcon } from "@sanity/icons/Play";
import { StarIcon } from "@sanity/icons/Star";
import { ThLargeIcon } from "@sanity/icons/ThLarge";
import { columnsField, imageWithAlt, linkField, richText, styleFieldset, styleFields } from "./shared";

const heading = defineField({ name: "heading", type: "string" });
const buttons = defineField({ name: "buttons", type: "array", of: [defineArrayMember({ type: "button" })], validation: (r) => r.max(2) });
const firstText = (blocks?: { children?: { text?: string }[] }[]) =>
  blocks?.[0]?.children?.map((c) => c.text).join("") ?? "";

export const hero = defineType({
  name: "hero",
  title: "Banner (big headline)",
  type: "object",
  icon: StarIcon,
  fieldsets: [styleFieldset],
  fields: [
    { ...heading, validation: (r) => r.required() },
    defineField({ name: "subheading", type: "string" }),
    imageWithAlt("image", "Background photo (optional)"),
    buttons,
    defineField({
      name: "align",
      title: "Text alignment",
      type: "string",
      options: { list: ["left", "center"], layout: "radio", direction: "horizontal" },
      initialValue: "left",
    }),
    defineField({
      name: "size",
      type: "string",
      options: { list: [{ title: "Compact", value: "compact" }, { title: "Tall", value: "tall" }], layout: "radio", direction: "horizontal" },
      initialValue: "tall",
    }),
    ...styleFields,
  ],
  initialValue: { background: "brand" },
  preview: { select: { title: "heading", media: "image" }, prepare: ({ title, media }) => ({ title, subtitle: "Banner", media }) },
});

export const textSection = defineType({
  name: "textSection",
  title: "Text",
  type: "object",
  icon: BlockContentIcon,
  fieldsets: [styleFieldset],
  fields: [
    heading,
    richText("body", "Text"),
    defineField({
      name: "width",
      type: "string",
      options: { list: [{ title: "Narrow (easy reading)", value: "narrow" }, { title: "Wide", value: "wide" }], layout: "radio", direction: "horizontal" },
      initialValue: "narrow",
    }),
    defineField({
      name: "align",
      title: "Text alignment",
      type: "string",
      options: { list: ["left", "center"], layout: "radio", direction: "horizontal" },
      initialValue: "left",
    }),
    ...styleFields,
  ],
  preview: {
    select: { title: "heading", body: "body" },
    prepare: ({ title, body }) => ({ title: title || firstText(body) || "Text", subtitle: "Text" }),
  },
});

export const imageText = defineType({
  name: "imageText",
  title: "Image + text",
  type: "object",
  icon: ImageIcon,
  fieldsets: [styleFieldset],
  fields: [
    { ...imageWithAlt("image", "Image"), validation: (r) => r.required() },
    heading,
    richText("body", "Text"),
    buttons,
    defineField({
      name: "imageSide",
      title: "Image on the",
      type: "string",
      options: { list: ["left", "right"], layout: "radio", direction: "horizontal" },
      initialValue: "left",
    }),
    ...styleFields,
  ],
  preview: { select: { title: "heading", media: "image" }, prepare: ({ title, media }) => ({ title: title || "Image + text", subtitle: "Image + text", media }) },
});

export const cardGrid = defineType({
  name: "cardGrid",
  title: "Cards",
  type: "object",
  icon: ThLargeIcon,
  fieldsets: [styleFieldset],
  fields: [
    heading,
    defineField({ name: "intro", type: "text", rows: 2 }),
    defineField({
      name: "cards",
      type: "array",
      of: [
        defineArrayMember({
          name: "card",
          type: "object",
          fields: [
            imageWithAlt("image", "Image (optional)"),
            defineField({ name: "title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "text", type: "text", rows: 3 }),
            linkField("link", "Link (optional)"),
          ],
          preview: { select: { title: "title", subtitle: "text", media: "image" } },
        }),
      ],
    }),
    columnsField(3),
    ...styleFields,
  ],
  preview: { select: { title: "heading", cards: "cards" }, prepare: ({ title, cards }) => ({ title: title || "Cards", subtitle: `Cards · ${cards?.length ?? 0}` }) },
});

export const gallery = defineType({
  name: "gallery",
  title: "Photo gallery",
  type: "object",
  icon: ImagesIcon,
  fieldsets: [styleFieldset],
  fields: [
    heading,
    defineField({
      name: "images",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Describe the image (for screen readers)", type: "string" }),
            defineField({ name: "caption", type: "string" }),
          ],
        }),
      ],
      options: { layout: "grid" },
    }),
    columnsField(3),
    ...styleFields,
  ],
  preview: { select: { title: "heading", images: "images", media: "images.0" }, prepare: ({ title, images, media }) => ({ title: title || "Photo gallery", subtitle: `Gallery · ${images?.length ?? 0} photos`, media }) },
});

export const video = defineType({
  name: "video",
  title: "Video",
  type: "object",
  icon: PlayIcon,
  fieldsets: [styleFieldset],
  fields: [
    heading,
    defineField({ name: "url", title: "YouTube link", type: "url", validation: (r) => r.required() }),
    defineField({ name: "caption", type: "string" }),
    ...styleFields,
  ],
  preview: { select: { title: "heading", subtitle: "url" }, prepare: ({ title, subtitle }) => ({ title: title || "Video", subtitle }) },
});

export const callToAction = defineType({
  name: "callToAction",
  title: "Call to action",
  type: "object",
  icon: BulbOutlineIcon,
  fieldsets: [styleFieldset],
  fields: [{ ...heading, validation: (r) => r.required() }, defineField({ name: "text", type: "text", rows: 2 }), buttons, ...styleFields],
  initialValue: { background: "brand" },
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title, subtitle: "Call to action" }) },
});

export const quote = defineType({
  name: "quote",
  title: "Quote",
  type: "object",
  icon: BlockquoteIcon,
  fieldsets: [styleFieldset],
  fields: [
    defineField({ name: "quote", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "name", title: "Who said it", type: "string" }),
    defineField({ name: "role", title: "Their title (optional)", type: "string" }),
    imageWithAlt("photo", "Photo (optional)"),
    ...styleFields,
  ],
  initialValue: { background: "light" },
  preview: { select: { title: "quote", subtitle: "name", media: "photo" } },
});

export const eventList = defineType({
  name: "eventList",
  title: "Upcoming events",
  type: "object",
  icon: CalendarIcon,
  description: "Shows the next public events from ChapterOps automatically.",
  fieldsets: [styleFieldset],
  fields: [
    { ...heading, initialValue: "Upcoming Events" },
    defineField({ name: "limit", title: "How many events to show", type: "number", initialValue: 3, validation: (r) => r.min(1).max(12) }),
    ...styleFields,
  ],
  preview: { select: { title: "heading", limit: "limit" }, prepare: ({ title, limit }) => ({ title: title || "Upcoming events", subtitle: `Next ${limit ?? 3} events from ChapterOps` }) },
});

export const sectionTypes = [hero, textSection, imageText, cardGrid, gallery, video, callToAction, quote, eventList];

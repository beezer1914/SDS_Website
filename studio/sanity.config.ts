import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { colorInput } from "@sanity/color-input";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
  name: "sds",
  title: "Sigma Delta Sigma Website",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  plugins: [
    structureTool({
      // "Site Settings" is a single document, so editors open it directly instead of a list.
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Home page")
              .id("homePage")
              .child(S.document().schemaType("page").documentId("page-home")),
            S.listItem()
              .title("Site Settings (logo, colors, contact)")
              .id("siteSettings")
              .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.divider(),
            S.documentTypeListItem("page").title("All pages"),
          ]),
    }),
    colorInput(),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter((t) => t.schemaType !== "siteSettings"),
  },
  document: {
    actions: (actions, ctx) =>
      ctx.schemaType === "siteSettings" ? actions.filter((a) => !["delete", "duplicate"].includes(a.action ?? "")) : actions,
  },
});

# Sigma Delta Sigma Chapter Website

Replacement for the WordPress site at sds1914.com.

| Piece | What it does |
|---|---|
| **Next.js + Tailwind** (`src/`) | Static site, exported to plain HTML (`out/`) |
| **Sanity Studio** (`studio/`) | Where the brothers edit pages and home-page content |
| **ChapterOps** | Member login, dues, directory, documents, and the source of public events |
| **Netlify** | Hosting, contact form, redirects, rebuilds |

```
Brother edits in Sanity ──publish──┐
                                   ├──> Netlify build hook ──> rebuild ──> sds1914.com
ChapterOps public event change ────┘
```

## Local development

```bash
npm install
npm run dev          # http://localhost:3000, uses sample content until Sanity is connected
npm run build        # static export to out/
npm run check        # verifies old URLs still resolve / redirect (run after build)
```

## One-time setup (Brandon)

### 1. Sanity project
1. `cd studio && npm install`
2. `npx sanity login`, then `npx sanity projects create "SDS Website"` and note the **project ID**.
3. Create the dataset if prompted: `npx sanity datasets create production --visibility public`.
4. Deploy the Studio: `SANITY_STUDIO_PROJECT_ID=<id> npm run deploy` → **https://sds1914.sanity.studio**
5. In sanity.io/manage → project → **API → CORS origins**, add `https://sds1914.sanity.studio`.
6. **Members → Invite** the two brothers with the **Editor** role. They sign in with Google or email; no GitHub or code needed.

### 2. Netlify
1. New site from this Git repo. `netlify.toml` already sets the build.
2. Environment variables:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` = the Sanity project ID
   - `NEXT_PUBLIC_SANITY_DATASET` = `production`
   - `CHAPTEROPS_EVENTS_URL` = the ChapterOps public feed (once it exists, see `docs/chapterops-events-feed.md`)
3. **Site configuration → Build hooks**: create one called "Content publish".
4. In Sanity (sanity.io/manage → **API → Webhooks**): add that build hook URL, trigger on create/update/delete, filter `_type in ["page", "siteSettings"]`.
5. **Forms**: enable form detection, then set a notification to email `sigmadeltasigma@sds1914.com`.

### 3. Cutover (later)
- Before touching DNS, write down the current **MX records** so `@sds1914.com` email keeps working.
- Point the domain to Netlify; keep WordPress around for about 30 days as a fallback.

## How editors build pages
- **Home page:** Studio → **Home page**.
- **New page:** Studio → **All pages** → **+**. Under **Page settings**, fill in the title, click **Generate** for the web address, and pick a menu.
- **Content** tab: **Add item** to add sections (Banner, Text, Image + text, Cards, Photo gallery, Video, Call to action, Quote, Upcoming events). Drag to reorder. Each section's **Style** group sets its background and spacing.
- **Site Settings → Look & feel:** logo/seal, brand color, and heading font for the whole site.
- **Publish.** The live site updates in about a minute.
- The hidden page `/section-examples/` shows every section type.

## Where things live
- Menu sections: `src/lib/site.ts` (`NAV_SECTIONS`)
- Page and settings fields: `studio/schemaTypes/index.ts`; section types: `studio/schemaTypes/sections.ts`
- How sections render: `src/components/PageSections.tsx`
- Old-URL redirects: `public/_redirects`
- Starter content: `studio/seed/starter-content.ndjson` (also what the site shows when Sanity isn't connected)

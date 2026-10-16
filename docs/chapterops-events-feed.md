# ChapterOps → Website: Public Events Feed

The website shows events that ChapterOps marks as **public**. ChapterOps stays the single place officers create events; the website only reads them.

## What ChapterOps needs to provide

### 1. Read-only JSON endpoint (no auth)

```
GET https://chapterops.bluecolumnsystems.com/api/events/public/chapters/<chapter-id>/events
```

Response `200 application/json`:

```json
{
  "events": [
    {
      "id": "evt_123",
      "title": "Rhapsody in Blue",
      "start": "2027-06-19T19:00:00-04:00",
      "end": "2027-06-19T23:00:00-04:00",
      "location": "Boxwood Social Hall, Marietta, GA",
      "description": "Plain text, 1–3 sentences.",
      "url": "https://chapterops.bluecolumnsystems.com/e/evt_123",
      "imageUrl": "https://…/flyer.jpg"
    }
  ]
}
```

| Field | Required | Notes |
|---|---|---|
| `id` | yes | Stable, unique |
| `title` | yes | |
| `start` | yes | ISO 8601 **with UTC offset** |
| `end` | no | `null` if open-ended |
| `location`, `description`, `imageUrl` | no | `description` is plain text, no HTML |
| `url` | no | Public ticket/RSVP page in ChapterOps; shown as a "Details & RSVP" button |

Rules:
- Include **only** chapter-owned events with audience `public`, `is_public=true`, status `published`, and a public slug. Filter by the exact owner chapter UUID. Drafts, cancellations, private audiences, and region/organization-owned events are excluded.
- Include upcoming or ongoing events (end or start ≥ now), sorted by start time.
- Return **no member data**: no attendee counts, names, prices tied to members, or internal notes.
- Revalidate on every build (`Cache-Control: public, max-age=0, must-revalidate`) so an immediate rebuild cannot use a cached copy from before an edit or cancellation.

### 2. A rebuild trigger

The site is static, so it needs a rebuild to pick up changes. ChapterOps requests one Netlify rebuild after a successful chapter event create, edit, or cancellation, including recurring series changes. Rebuild requests happen after the event transaction commits. RSVP and ticket changes do not trigger rebuilds.

The existing daily `flask extend-event-series` job also refreshes configured websites after generating new occurrences. This removes events that have passed and recovers notifications missed during temporary outages. No additional scheduled service is needed.

Build hook failures are logged without secret URLs and do not undo saved events. The nightly job reports failed refreshes as a job failure. A failure may leave the website showing its last successful calendar until a later rebuild succeeds.

## Connect SDS in production

1. Deploy the ChapterOps public events integration first. Verify the feed returns `200` with an `events` array:
   `https://chapterops.bluecolumnsystems.com/api/events/public/chapters/65a2397f-3f82-4fd1-8aca-f66ad9839b9d/events`.
2. In Netlify project **sds1914**, open **Project configuration → Build & deploy → Build hooks**. Create **ChapterOps events** for branch **main**.
3. Set `PUBLIC_EVENTS_BUILD_HOOKS` on **both** the ChapterOps production web service and the existing **extend-event-series** cron. Its value is a JSON object mapping the SDS chapter ID to the generated hook URL:
   `{"65a2397f-3f82-4fd1-8aca-f66ad9839b9d":"https://api.netlify.com/build_hooks/REPLACE_WITH_SECRET"}`.
   Keep that value in Render environment settings, never in git or chapter-readable configuration. Redeploy both services to load it. Testing config pins it to `{}` to prevent test runs from calling real hooks.
4. Deploy the website. `netlify.toml` already sets `CHAPTEROPS_EVENTS_URL` to the SDS feed. Check Netlify's environment settings for an older override if a different feed is being fetched.
5. In ChapterOps, publish an upcoming chapter event with **Public** audience and its public page enabled. Confirm the Netlify build starts and that the event appears on `/events/`. Edit or cancel it and confirm the website updates again. Private/draft events must remain absent.

Only SDS-owned events are included. Public regional and organization events do not automatically appear on the chapter website.

## Website side (already built)

- `src/lib/events.ts` fetches `CHAPTEROPS_EVENTS_URL` at build time.
- The Events page and every Sanity **Upcoming events** section use the same feed.
- If the feed errors or has invalid data, the **build fails** and Netlify keeps the previous site live, so a ChapterOps outage never publishes an empty calendar.
- If `CHAPTEROPS_EVENTS_URL` is unset, a connected real site shows no events. Only local demo mode (no Sanity project configured either) shows sample events.
- Run `npm test` to check feed validation, time-zone sorting, and ongoing/past-event filtering.

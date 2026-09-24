# ChapterOps → Website: Public Events Feed

The website shows events that ChapterOps marks as **public**. ChapterOps stays the single place officers create events; the website only reads them.

## What ChapterOps needs to provide

### 1. A read-only JSON endpoint (no auth)

```
GET https://chapterops.bluecolumnsystems.com/api/public/chapters/<chapter-slug>/events
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
- Include **only** events flagged public, and only upcoming ones (end or start ≥ now) or recently past ones. The site filters past events too.
- Return **no member data**: no attendee counts, names, prices tied to members, or internal notes.
- Keep it cacheable (`Cache-Control: public, max-age=300`).

### 2. A rebuild trigger

The site is static, so it needs a rebuild to pick up changes. ChapterOps should `POST` to the Netlify build hook URL (stored as a ChapterOps setting, not in code) when:
- a public event is created, edited, unpublished, or deleted, **and**
- once nightly, so events that have passed drop off the site.

## Website side (already built)

- `src/lib/events.ts` fetches `CHAPTEROPS_EVENTS_URL` at build time.
- If the feed errors, the **build fails** and Netlify keeps the previous site live, so a ChapterOps outage never publishes an empty calendar.
- If `CHAPTEROPS_EVENTS_URL` is unset, sample events from `src/data/sample-events.json` are shown.

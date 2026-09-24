// Public events come from ChapterOps. Contract: docs/chapterops-events-feed.md
import sampleFeed from "@/data/sample-events.json";

export type ChapterEvent = {
  id: string;
  title: string;
  start: string; // ISO 8601 with offset
  end?: string | null;
  location?: string | null;
  description?: string | null;
  url?: string | null; // ChapterOps page for tickets/RSVP
  imageUrl?: string | null;
};

export async function getUpcomingEvents(): Promise<ChapterEvent[]> {
  const feedUrl = process.env.CHAPTEROPS_EVENTS_URL;
  let events: ChapterEvent[];

  if (feedUrl) {
    const res = await fetch(feedUrl);
    // Fail the build rather than publish an empty calendar; Netlify keeps the last good deploy live.
    if (!res.ok) throw new Error(`ChapterOps events feed returned ${res.status}`);
    events = (await res.json()).events;
  } else {
    events = sampleFeed.events;
  }

  const now = Date.now();
  return events
    .filter((e) => new Date(e.end ?? e.start).getTime() >= now)
    .sort((a, b) => a.start.localeCompare(b.start));
}

export function formatEventDate(e: ChapterEvent): string {
  const opts: Intl.DateTimeFormatOptions = {
    weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/New_York",
  };
  return new Date(e.start).toLocaleString("en-US", opts);
}

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

function parseEventsFeed(value: unknown): ChapterEvent[] {
  const invalid = () => new Error("Invalid ChapterOps events feed");
  if (!value || typeof value !== "object" || !("events" in value) || !Array.isArray(value.events)) {
    throw invalid();
  }
  const ids = new Set<string>();
  const validDate = (date: unknown): date is string =>
    typeof date === "string" && /T.*(?:Z|[+-]\d{2}:\d{2})$/i.test(date) && Number.isFinite(Date.parse(date));
  const validUrl = (url: string) => {
    try {
      return ["http:", "https:"].includes(new URL(url).protocol);
    } catch {
      return false;
    }
  };
  return value.events.map((event: unknown) => {
    if (!event || typeof event !== "object") throw invalid();
    const e = event as Record<string, unknown>;
    if (typeof e.id !== "string" || !e.id.trim() || ids.has(e.id) ||
        typeof e.title !== "string" || !e.title.trim() || !validDate(e.start) ||
        (e.end != null && (!validDate(e.end) || Date.parse(e.end) < Date.parse(e.start)))) {
      throw invalid();
    }
    for (const key of ["location", "description", "url", "imageUrl"]) {
      if (e[key] != null && typeof e[key] !== "string") throw invalid();
    }
    for (const key of ["url", "imageUrl"]) {
      if (typeof e[key] === "string" && e[key] && !validUrl(e[key])) throw invalid();
    }
    ids.add(e.id);
    return e as ChapterEvent;
  });
}

export async function getUpcomingEvents(): Promise<ChapterEvent[]> {
  const feedUrl = process.env.CHAPTEROPS_EVENTS_URL;
  let events: ChapterEvent[];

  if (feedUrl) {
    // The default fetch mode runs at build time for static exports. Explicit
    // no-store opts into dynamic rendering, which this site cannot serve.
    const res = await fetch(feedUrl, {
      headers: { "Cache-Control": "no-cache" },
      signal: AbortSignal.timeout(15_000),
    });
    // Fail the build rather than publish an empty calendar; Netlify keeps the last good deploy live.
    if (!res.ok) throw new Error(`ChapterOps events feed returned ${res.status}`);
    events = parseEventsFeed(await res.json());
  } else if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    // Local demo mode (no Sanity either): show sample events.
    events = sampleFeed.events;
  } else {
    // Real site, ChapterOps feed not connected yet: show no events rather than fake ones.
    events = [];
  }

  const now = Date.now();
  return events
    .filter((e) => new Date(e.end ?? e.start).getTime() >= now)
    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
}

export function formatEventDate(e: ChapterEvent): string {
  const opts: Intl.DateTimeFormatOptions = {
    weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/New_York",
  };
  return new Date(e.start).toLocaleString("en-US", opts);
}

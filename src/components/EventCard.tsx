import { formatEventDate, type ChapterEvent } from "@/lib/events";

export default function EventCard({ event }: { event: ChapterEvent }) {
  return (
    <article className="flex flex-col rounded-xl border border-sigma-light bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-sigma">{formatEventDate(event)}</p>
      <h3 className="mt-1 font-display text-xl text-sigma-dark">{event.title}</h3>
      {event.location && <p className="mt-1 text-sm text-muted">{event.location}</p>}
      {event.description && <p className="mt-3 text-sm leading-relaxed">{event.description}</p>}
      {event.url && (
        <a href={event.url} className="mt-4 self-start rounded-full bg-sigma px-4 py-2 text-sm font-semibold text-white hover:bg-sigma-dark">
          Details &amp; RSVP
        </a>
      )}
    </article>
  );
}

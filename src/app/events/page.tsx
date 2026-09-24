import type { Metadata } from "next";
import EventCard from "@/components/EventCard";
import { getUpcomingEvents } from "@/lib/events";

export const metadata: Metadata = { title: "Events" };

export default async function EventsPage() {
  const events = await getUpcomingEvents();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="font-display text-4xl text-sigma-dark">Chapter Events</h1>
      <p className="mt-3 max-w-2xl text-muted">Public events hosted by the Sigma Delta Sigma chapter.</p>
      {events.length > 0 ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      ) : (
        <p className="mt-10 text-muted">No upcoming public events right now. Check back soon.</p>
      )}
    </div>
  );
}

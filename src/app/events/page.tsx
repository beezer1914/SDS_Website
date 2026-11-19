import type { Metadata } from "next";
import EventCard from "@/components/EventCard";
import { getUpcomingEvents } from "@/lib/events";

export const metadata: Metadata = { title: "Events" };

export default async function EventsPage() {
  const events = await getUpcomingEvents();

  return (
    <div className="chapter-container py-16 md:py-24">
      <div className="interior-intro">
        <p className="story-label">Cherokee &amp; Cobb counties</p>
        <h1>Public events</h1>
        <p>Meet the brothers of Sigma Delta Sigma and join our neighbors at an upcoming gathering.</p>
      </div>
      {events.length > 0 ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      ) : (
        <div className="mt-10 border-l-4 border-sigma bg-sigma-light p-7">
          <h2 className="font-display text-2xl text-sigma-dark">No public dates are listed yet.</h2>
          <a href="/contact/" className="story-link mt-3 inline-block">Ask about the next event</a>
        </div>
      )}
    </div>
  );
}

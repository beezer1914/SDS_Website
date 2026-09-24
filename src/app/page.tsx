import Link from "next/link";
import RichText from "@/components/RichText";
import EventCard from "@/components/EventCard";
import { getAllPages, getSettings } from "@/lib/content";
import { getUpcomingEvents } from "@/lib/events";

export default async function Home() {
  const [settings, pages, events] = await Promise.all([getSettings(), getAllPages(), getUpcomingEvents()]);
  const programs = pages.filter((p) => p.section === "programs");

  return (
    <>
      <section className="bg-gradient-to-br from-sigma-dark to-sigma text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <h1 className="max-w-3xl font-display text-4xl leading-tight md:text-6xl">{settings.heroTitle}</h1>
          <p className="mt-4 text-lg text-white/85">{settings.heroSubtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/history/" className="rounded-full bg-white px-5 py-2.5 font-semibold text-sigma-dark hover:bg-sigma-light">
              Fraternity History
            </Link>
            <Link href="/events/" className="rounded-full border border-white/60 px-5 py-2.5 font-semibold hover:bg-white/10">
              Upcoming Events
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="font-display text-3xl text-sigma-dark">Welcome</h2>
        <div className="mt-4">
          <RichText value={settings.welcomeMessage} />
        </div>
        <p className="font-semibold">{settings.presidentName}</p>
        <p className="text-sm text-muted">President</p>
      </section>

      {programs.length > 0 && (
        <section className="bg-sigma-light/50 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="font-display text-3xl text-sigma-dark">Our Programs</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {programs.map((p) => (
                <Link key={p.slug} href={`/${p.slug}/`} className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md">
                  <h3 className="font-display text-xl text-sigma-dark">{p.title}</h3>
                  {p.summary && <p className="mt-2 text-sm text-muted">{p.summary}</p>}
                  <span className="mt-4 inline-block text-sm font-semibold text-sigma">Learn more →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl text-sigma-dark">Upcoming Events</h2>
          <Link href="/events/" className="text-sm font-semibold text-sigma">All events →</Link>
        </div>
        {events.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {events.slice(0, 3).map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        ) : (
          <p className="mt-6 text-muted">No upcoming public events right now. Check back soon.</p>
        )}
      </section>
    </>
  );
}

import Link from "next/link";
import type { PortableTextBlock } from "@portabletext/react";
import RichText, { youtubeId } from "@/components/RichText";
import EventCard from "@/components/EventCard";
import { imageUrl, type Section } from "@/lib/content";
import { getUpcomingEvents } from "@/lib/events";
import type { Button } from "@/sanity.types";

type Background = "white" | "light" | "brand" | "dark";
type Style = { background?: Background; spacing?: "compact" | "normal" | "spacious" };
type Img = { alt?: string } | undefined;

const BG: Record<Background, string> = {
  white: "bg-white",
  light: "bg-sigma-light",
  brand: "bg-sigma text-white on-dark",
  dark: "bg-sigma-dark text-white on-dark",
};
const PAD = { compact: "py-8", normal: "py-16", spacious: "py-24" };
// Full class names so Tailwind picks them up.
const COLS = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" };

const isDark = (bg?: Background) => bg === "brand" || bg === "dark";

function Wrap({ s, children, className = "", width = "max-w-6xl" }: { s: Style; children: React.ReactNode; className?: string; width?: string }) {
  return (
    <section className={`${BG[s.background ?? "white"]} ${PAD[s.spacing ?? "normal"]}`}>
      <div className={`mx-auto px-4 ${width} ${className}`}>{children}</div>
    </section>
  );
}

function Heading({ text, center }: { text?: string; center?: boolean }) {
  return text ? <h2 className={`mb-6 font-display text-3xl text-sigma-dark md:text-4xl ${center ? "text-center" : ""}`}>{text}</h2> : null;
}

function SmartLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return href.startsWith("/") ? (
    <Link href={href} className={className}>{children}</Link>
  ) : (
    <a href={href} className={className}>{children}</a>
  );
}

function Buttons({ buttons, dark, center }: { buttons?: Button[]; dark: boolean; center?: boolean }) {
  if (!buttons?.length) return null;
  return (
    <div className={`mt-8 flex flex-wrap gap-3 ${center ? "justify-center" : ""}`}>
      {buttons.map((b, i) => {
        const solid = (b.style ?? "solid") === "solid";
        const cls = solid
          ? dark ? "bg-white text-sigma-dark hover:bg-sigma-light" : "bg-sigma text-white hover:bg-sigma-dark"
          : dark ? "border border-white/70 hover:bg-white/10" : "border border-sigma text-sigma hover:bg-sigma-light";
        return (
          <SmartLink key={i} href={b.link ?? "/"} className={`rounded-full px-5 py-2.5 font-semibold transition ${cls}`}>
            {b.label}
          </SmartLink>
        );
      })}
    </div>
  );
}

function Picture({ image, width, className }: { image: unknown; width: number; className?: string }) {
  const src = imageUrl(image, width);
  // eslint-disable-next-line @next/next/no-img-element
  return src ? <img src={src} alt={(image as Img)?.alt ?? ""} loading="lazy" className={className} /> : null;
}

async function SectionView({ s }: { s: Section }) {
  const dark = isDark(s.background);

  switch (s._type) {
    case "hero": {
      const bg = imageUrl(s.image, 2000);
      const center = s.align === "center";
      const size = s.size === "compact" ? "py-14 md:py-20" : "py-24 md:py-36";
      return (
        <section
          className={`relative ${bg ? "bg-cover bg-center text-white on-dark" : BG[s.background ?? "brand"]}`}
          style={bg ? { backgroundImage: `url(${bg})` } : undefined}
        >
          {bg && <div className="absolute inset-0 bg-black/55" aria-hidden />}
          <div className={`relative mx-auto max-w-6xl px-4 ${size} ${center ? "text-center" : ""}`}>
            <h1 className={`font-display text-4xl leading-tight text-sigma-dark md:text-6xl ${center ? "mx-auto" : ""} max-w-3xl`}>{s.heading}</h1>
            {s.subheading && <p className="mt-4 text-lg opacity-90">{s.subheading}</p>}
            <Buttons buttons={s.buttons} dark={Boolean(bg) || dark} center={center} />
          </div>
        </section>
      );
    }

    case "textSection": {
      const center = s.align === "center";
      return (
        <Wrap s={s} width={s.width === "wide" ? "max-w-6xl" : "max-w-3xl"} className={center ? "text-center" : ""}>
          <Heading text={s.heading} center={center} />
          <RichText value={(s.body ?? []) as PortableTextBlock[]} />
        </Wrap>
      );
    }

    case "imageText":
      return (
        <Wrap s={s} className="grid items-center gap-10 md:grid-cols-2">
          <div className={s.imageSide === "right" ? "md:order-2" : ""}>
            <Picture image={s.image} width={1000} className="w-full rounded-xl object-cover" />
          </div>
          <div>
            <Heading text={s.heading} />
            <RichText value={(s.body ?? []) as PortableTextBlock[]} />
            <Buttons buttons={s.buttons} dark={dark} />
          </div>
        </Wrap>
      );

    case "cardGrid":
      return (
        <Wrap s={s}>
          <Heading text={s.heading} />
          {s.intro && <p className="-mt-2 mb-8 max-w-2xl opacity-80">{s.intro}</p>}
          <div className={`grid gap-6 ${COLS[s.columns ?? 3]}`}>
            {s.cards?.map((c, i) => {
              const inner = (
                <>
                  <Picture image={c.image} width={800} className="aspect-video w-full object-cover" />
                  <div className="p-6">
                    <h3 className="font-display text-xl text-sigma-dark">{c.title}</h3>
                    {c.text && <p className="mt-2 text-sm text-muted">{c.text}</p>}
                    {c.link && <span className="mt-4 inline-block text-sm font-semibold text-sigma">Learn more →</span>}
                  </div>
                </>
              );
              const cls = "overflow-hidden rounded-xl bg-white text-ink shadow-sm transition hover:shadow-md";
              return c.link ? (
                <SmartLink key={i} href={c.link} className={cls}>{inner}</SmartLink>
              ) : (
                <div key={i} className={cls}>{inner}</div>
              );
            })}
          </div>
        </Wrap>
      );

    case "gallery":
      return (
        <Wrap s={s}>
          <Heading text={s.heading} />
          <div className={`grid grid-cols-2 gap-4 ${COLS[s.columns ?? 3]}`}>
            {s.images?.map((img, i) => (
              <figure key={i}>
                <Picture image={img} width={900} className="aspect-[4/3] w-full rounded-lg object-cover" />
                {img.caption && <figcaption className="mt-2 text-sm opacity-80">{img.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </Wrap>
      );

    case "video": {
      const id = youtubeId(s.url ?? "");
      return (
        <Wrap s={s} width="max-w-4xl">
          <Heading text={s.heading} />
          {id && (
            <div className="aspect-video">
              <iframe
                className="h-full w-full rounded-xl"
                src={`https://www.youtube-nocookie.com/embed/${id}`}
                title={s.heading ?? "YouTube video"}
                allowFullScreen
              />
            </div>
          )}
          {s.caption && <p className="mt-3 text-sm opacity-80">{s.caption}</p>}
        </Wrap>
      );
    }

    case "callToAction":
      return (
        <Wrap s={s} width="max-w-3xl" className="text-center">
          <h2 className="font-display text-3xl text-sigma-dark md:text-4xl">{s.heading}</h2>
          {s.text && <p className="mt-4 text-lg opacity-90">{s.text}</p>}
          <Buttons buttons={s.buttons} dark={dark} center />
        </Wrap>
      );

    case "quote":
      return (
        <Wrap s={s} width="max-w-3xl" className="text-center">
          <blockquote className="font-display text-2xl leading-snug text-sigma-dark md:text-3xl">“{s.quote}”</blockquote>
          {(s.name || s.photo) && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <Picture image={s.photo} width={120} className="h-12 w-12 rounded-full object-cover" />
              <div className="text-left">
                {s.name && <p className="font-semibold">{s.name}</p>}
                {s.role && <p className="text-sm opacity-75">{s.role}</p>}
              </div>
            </div>
          )}
        </Wrap>
      );

    case "eventList": {
      const events = (await getUpcomingEvents()).slice(0, s.limit ?? 3);
      return (
        <Wrap s={s}>
          <div className="flex items-end justify-between">
            <Heading text={s.heading} />
            <Link href="/events/" className="mb-6 text-sm font-semibold">All events →</Link>
          </div>
          {events.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {events.map((e) => <EventCard key={e.id} event={e} />)}
            </div>
          ) : (
            <p className="opacity-80">No upcoming public events right now. Check back soon.</p>
          )}
        </Wrap>
      );
    }
  }
}

export default function PageSections({ sections }: { sections?: Section[] }) {
  return <>{sections?.map((s) => <SectionView key={s._key} s={s} />)}</>;
}

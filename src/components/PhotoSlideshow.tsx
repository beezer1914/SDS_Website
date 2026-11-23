"use client";

import { useEffect, useRef, useState } from "react";

type Slide = {
  id: string;
  src: string;
  smallSrc?: string;
  alt: string;
  caption?: string;
};

const control = "min-h-11 rounded border border-current px-3 text-sm font-semibold hover:underline sm:px-4";

export default function PhotoSlideshow({
  slides,
  label,
  sizes = "(max-width: 1024px) calc(100vw - 2rem), 992px",
}: { slides: Slide[]; label: string; sizes?: string }) {
  const track = useRef<HTMLDivElement>(null);
  const settle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [index, setIndex] = useState(0);
  const count = slides.length;

  useEffect(() => () => clearTimeout(settle.current), []);

  function step(direction: number) {
    const scroller = track.current;
    if (!scroller) return;
    const current = Math.round(scroller.scrollLeft / scroller.clientWidth);
    const next = (current + direction + count) % count;
    const slide = scroller.children[next] as HTMLElement;
    scroller.scrollTo({ left: slide.offsetLeft });
  }

  function updatePosition(scroller: HTMLDivElement) {
    clearTimeout(settle.current);
    settle.current = setTimeout(() => {
      setIndex(Math.min(count - 1, Math.max(0, Math.round(scroller.scrollLeft / scroller.clientWidth))));
    }, 120);
  }

  return (
    <div role={count > 1 ? "region" : undefined} aria-roledescription={count > 1 ? "carousel" : undefined} aria-label={count > 1 ? label : undefined}>
      {count > 1 && (
        <div className="mb-3 flex items-center justify-end gap-3">
          <button type="button" className={control} onClick={() => step(-1)} aria-label="Previous photo">Previous</button>
          <p role="status" className="min-w-12 text-center text-sm tabular-nums">
            <span className="sr-only">Photo </span>{index + 1} of {count}
          </p>
          <button type="button" className={control} onClick={() => step(1)} aria-label="Next photo">Next</button>
        </div>
      )}
      <div
        ref={track}
        className="relative flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
        tabIndex={count > 1 ? 0 : undefined}
        role={count > 1 ? "group" : undefined}
        aria-label={count > 1 ? "Photos" : undefined}
        onScroll={count > 1 ? (event) => updatePosition(event.currentTarget) : undefined}
      >
        {slides.map((slide, i) => (
          <figure key={slide.id} className="w-full shrink-0 snap-start" aria-label={count > 1 ? `${i + 1} of ${count}` : undefined} aria-roledescription={count > 1 ? "slide" : undefined}>
            {/* Sanity supplies sized variants for the static export. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.src}
              srcSet={slide.smallSrc ? `${slide.smallSrc} 720w, ${slide.src} 1440w` : undefined}
              sizes={sizes}
              alt={slide.alt}
              loading="lazy"
              className="aspect-[4/3] max-h-[34rem] w-full rounded-lg bg-sigma-dark object-contain sm:aspect-video"
            />
            {slide.caption && <figcaption className="mt-2 text-sm opacity-80">{slide.caption}</figcaption>}
          </figure>
        ))}
      </div>
    </div>
  );
}

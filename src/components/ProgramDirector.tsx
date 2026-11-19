const directors = new Map([
  ["/bigger-better-business", { name: "Bro. Angelo Hill", photo: "/images/angelo-hill.webp" }],
  ["/education", { name: "Bro. Ben Green", photo: "/images/ben-green.webp" }],
  ["/social-action", { name: "Bro. Tyler Gibbs", photo: "/images/tyler-gibbs.webp" }],
]);

export default function ProgramDirector({ programPath, compact = false }: { programPath?: string; compact?: boolean }) {
  const path = programPath?.split(/[?#]/, 1)[0].replace(/\/$/, "");
  const director = path && directors.get(path);
  if (!director) return null;

  return (
    <figure className={`flex items-center gap-4 ${compact ? "mt-5 border-t border-sigma-light pt-4" : "mb-6"}`}>
      {/* The adjacent caption identifies the person in the photograph. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={director.photo} alt="" width={338} height={389} loading="lazy"
        className={`h-auto shrink-0 rounded-md ${compact ? "w-20" : "w-28 sm:w-36"}`} />
      <figcaption>
        <span className="block text-sm text-muted">Committee director</span>
        <span className={`block font-display text-sigma-dark ${compact ? "text-lg" : "text-2xl"}`}>{director.name}</span>
      </figcaption>
    </figure>
  );
}

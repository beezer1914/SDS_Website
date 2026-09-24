import type { SiteSettings } from "@/lib/content";
import { CHAPTEROPS_URL } from "@/lib/site";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const socials = [
    { label: "Facebook", href: settings.facebookUrl },
    { label: "Instagram", href: settings.instagramUrl },
    { label: "YouTube", href: settings.youtubeUrl },
  ].filter((s) => s.href);

  return (
    <footer className="mt-auto bg-sigma-dark text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-xl">Sigma Delta Sigma Chapter</p>
          <p className="mt-1 text-sm text-white/70">Phi Beta Sigma Fraternity, Inc. · Woodstock, GA</p>
          <p className="mt-4 text-sm italic text-white/80">
            A Brotherhood of Conscious Men Actively Serving Our Communities.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Get in touch</p>
          <a href={`mailto:${settings.contactEmail}`} className="mt-2 block text-white/80 hover:text-white">
            {settings.contactEmail}
          </a>
          <div className="mt-3 flex gap-4">
            {socials.map((s) => (
              <a key={s.label} href={s.href} className="text-white/80 hover:text-white" rel="noopener">
                {s.label}
              </a>
            ))}
          </div>
          <a href={CHAPTEROPS_URL} className="mt-3 block text-white/80 hover:text-white">Member login (ChapterOps)</a>
        </div>
        <div className="text-xs leading-relaxed text-white/70">
          <p>
            <strong className="text-white">Statement on Hazing:</strong> Phi Beta Sigma Fraternity, Inc. takes any form of
            reported hazing very seriously. Hazing has not and does not represent the traditions of the over 100 years of
            history of our fraternity.
          </p>
          <p className="mt-2">
            <strong className="text-white">Georgia Hazing Law 16-5-61.</strong> It shall be unlawful for any person to
            haze any student in connection with or as a condition or precondition of gaining acceptance, membership,
            office, or other status in a school organization. Any person who violates this Code section shall be guilty
            of a misdemeanor of a high and aggravated nature.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Sigma Delta Sigma Chapter of Phi Beta Sigma Fraternity, Inc.
      </div>
    </footer>
  );
}

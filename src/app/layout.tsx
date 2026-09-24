import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/playfair-display";
import "@fontsource-variable/montserrat";
import "./globals.css";
import Header, { type NavGroup } from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllPages, getSettings, imageUrl } from "@/lib/content";
import { NAV_SECTIONS } from "@/lib/site";

export const metadata: Metadata = {
  title: { default: "Sigma Delta Sigma Chapter – Phi Beta Sigma Fraternity, Inc.", template: "%s | Sigma Delta Sigma" },
  description: "The Sigma Delta Sigma chapter of Phi Beta Sigma Fraternity, Inc., serving Woodstock, GA and beyond.",
};

// Heading fonts editors can pick in Site Settings.
const HEADING_FONTS = {
  serif: '"Playfair Display Variable", Georgia, serif',
  sans: '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
  bold: '"Montserrat Variable", ui-sans-serif, system-ui, sans-serif',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, pages] = await Promise.all([getSettings(), getAllPages()]);

  const groups: NavGroup[] = NAV_SECTIONS.map((s) => ({
    label: s.label,
    links: pages.filter((p) => p.section === s.key && p.slug !== "home").map((p) => ({ title: p.title, href: `/${p.slug}/` })),
  })).filter((g) => g.links.length > 0);

  // Theme from Site Settings; globals.css derives the dark and light tints from --color-sigma.
  const theme = {
    ...(settings.brandColor?.hex && { "--color-sigma": settings.brandColor.hex }),
    "--font-display": HEADING_FONTS[settings.headingFont ?? "serif"],
  } as React.CSSProperties;

  return (
    <html lang="en" className="h-full antialiased" style={theme}>
      <body className="flex min-h-full flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:p-3">Skip to content</a>
        <Header groups={groups} logoUrl={imageUrl(settings.logo, 160)} />
        <main id="main" className="flex-1">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}

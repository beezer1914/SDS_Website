import Link from "next/link";
import { client } from "@/sanity/client";
import { NAV_PAGES_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/queries";

const options = { next: { revalidate: 30 } };

export default async function Home() {
  const [settings, pages] = await Promise.all([
    client.fetch(SITE_SETTINGS_QUERY, {}, options),
    client.fetch(NAV_PAGES_QUERY, {}, options),
  ]);

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col gap-6 py-32 px-16">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          {settings?.heroTitle ?? "Connected to Sanity"}
        </h1>
        {settings?.heroSubtitle && (
          <p className="text-lg text-zinc-600 dark:text-zinc-400">{settings.heroSubtitle}</p>
        )}
        {pages.length === 0 ? (
          <p className="text-zinc-500">
            No pages published yet. Add content in the Studio, then reload this page.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {pages.map((page) => (
              <li key={page.slug}>
                <Link className="underline" href={`/${page.slug}`}>
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

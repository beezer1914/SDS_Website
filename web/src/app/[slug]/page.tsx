import { PortableText } from "next-sanity";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { PAGE_QUERY } from "@/sanity/queries";

const options = { next: { revalidate: 30 } };

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await client.fetch(PAGE_QUERY, { slug }, options);

  if (!page) return notFound();

  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-16 py-32">
      <h1 className="text-3xl font-semibold tracking-tight">{page.title}</h1>
      {page.summary && <p className="text-lg text-zinc-600 dark:text-zinc-400">{page.summary}</p>}
      {Array.isArray(page.body) && <PortableText value={page.body} />}
    </article>
  );
}

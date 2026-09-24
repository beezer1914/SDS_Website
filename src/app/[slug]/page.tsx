import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RichText from "@/components/RichText";
import { getAllPages, getPage } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllPages()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPage((await params).slug);
  return { title: page?.title, description: page?.summary };
}

export default async function ContentPage({ params }: Props) {
  const page = await getPage((await params).slug);
  if (!page) notFound();

  return (
    <>
      <div className="bg-sigma-dark text-white">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <h1 className="font-display text-4xl">{page.title}</h1>
          {page.summary && <p className="mt-3 text-white/80">{page.summary}</p>}
        </div>
      </div>
      <article className="mx-auto max-w-3xl px-4 py-12">
        <RichText value={page.body ?? []} />
      </article>
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { PortableTextBlock } from "@portabletext/react";
import PageSections from "@/components/PageSections";
import ProgramDirector from "@/components/ProgramDirector";
import RichText from "@/components/RichText";
import { getAllPages, getPage } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  // "home" is served at "/", not "/home/".
  return (await getAllPages()).filter((p) => p.slug !== "home").map((p) => ({ slug: p.slug }));
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
      {!page.hideTitle && (
        <div className="bg-sigma-dark text-white">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h1 className="font-display text-4xl">{page.title}</h1>
            {page.summary && <p className="mt-3 max-w-3xl text-white/80">{page.summary}</p>}
          </div>
        </div>
      )}
      {/* Text from before the page builder, shown until an editor moves it into sections. */}
      {page.body?.length ? (
        <article className="mx-auto max-w-3xl px-4 py-12">
          <RichText value={page.body as PortableTextBlock[]} />
        </article>
      ) : null}
      <PageSections sections={page.sections} />
      {page.slug === "chapter-history" && (
        <figure className="chapter-container pb-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/chapter-portrait.webp" width={1080} height={720} alt="Brothers of Sigma Delta Sigma gathered for a chapter portrait." loading="lazy" className="mx-auto w-full max-w-3xl" />
        </figure>
      )}
      {page.section === "programs" && (
        <div className="mx-auto max-w-3xl px-4 pb-16">
          <ProgramDirector programPath={`/${page.slug}`} />
          <a href="/partner/" className="primary-link">Partner on a community project</a>
        </div>
      )}
    </>
  );
}

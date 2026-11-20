import PageSections from "@/components/PageSections";
import { samplePages } from "@/data/sample-content";
import { getPage } from "@/lib/content";

export const metadata = {
  title: "Chapter scholarships",
  description: "Explore Sigma Delta Sigma scholarships, past recipients and application information.",
};

export default async function ScholarshipsPage() {
  const slug = "education/scholarships";
  const page = await getPage(slug) ?? samplePages.find((entry) => entry.slug === slug);

  return (
    <>
      <header className="bg-sigma-light">
        <div className="chapter-container grid items-center gap-8 py-10 md:grid-cols-2 md:py-14">
          <div className="interior-intro">
            <a href="/education/" className="story-link">Back to Education</a>
            <h1 className="mt-5">{page?.title}</h1>
            <p>{page?.summary}</p>
          </div>
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/scholarship-presentation.webp"
              srcSet="/images/scholarship-presentation-small.webp 720w, /images/scholarship-presentation.webp 1400w"
              sizes="(min-width: 768px) 45vw, 92vw" width={1400} height={933}
              className="h-auto w-full"
              alt="Donovan J. Sutton holds his scholarship check alongside two chapter members." />
            <figcaption className="mt-2 text-sm text-muted">2025 Bishop Stephen Hall Sr. Scholarship presentation</figcaption>
          </figure>
        </div>
      </header>
      <PageSections sections={page?.sections} />
    </>
  );
}

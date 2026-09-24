import PageSections from "@/components/PageSections";
import { getPage } from "@/lib/content";

// The home page is the Studio page whose web address is "home".
export default async function Home() {
  const page = await getPage("home");

  if (!page) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-sigma-dark">Welcome</h1>
        <p className="mt-3 text-muted">
          The home page hasn&apos;t been set up yet. In the Studio, open <strong>Home page</strong> and add some sections.
        </p>
      </div>
    );
  }

  return <PageSections sections={page.sections} />;
}

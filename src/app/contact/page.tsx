import InquiryForm from "@/components/InquiryForm";
import { getSettings } from "@/lib/content";

export const metadata = { title: "Contact the chapter" };

export default async function ContactPage() {
  const { contactEmail } = await getSettings();
  return (
    <div className="chapter-container inquiry-layout">
      <div className="interior-intro">
        <h1>Contact the chapter</h1>
        <p>Ask about a public event, a program, or how to get involved in Cherokee and Cobb counties.</p>
        {contactEmail && <a className="story-link" href={`mailto:${contactEmail}`}>{contactEmail}</a>}
        <p>Have a project in mind? <a href="/partner/" className="story-link">Partner with us</a>.</p>
      </div>
      <InquiryForm />
    </div>
  );
}

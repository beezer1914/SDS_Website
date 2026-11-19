import InquiryForm from "@/components/InquiryForm";
import { getSettings } from "@/lib/content";

export const metadata = { title: "Partner with Sigma Delta Sigma", description: "Connect your school, business, church or neighborhood group with Sigma Delta Sigma in Cherokee and Cobb counties." };

export default async function PartnerPage() {
  const { contactEmail } = await getSettings();
  return (
    <div className="chapter-container inquiry-layout">
      <div className="interior-intro">
        <p className="story-label">Community partnerships</p>
        <h1>Partner with us</h1>
        <p>Tell us where you’re working, who you hope to reach, and how our brothers can help. We welcome ideas from residents, schools, churches, businesses and nonprofits in Cherokee and Cobb counties.</p>
        {contactEmail && <a className="story-link" href={`mailto:${contactEmail}?subject=Community%20partnership`}>{contactEmail}</a>}
      </div>
      <InquiryForm partnership />
    </div>
  );
}

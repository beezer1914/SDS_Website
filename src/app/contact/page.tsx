import type { Metadata } from "next";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = { title: "Contact" };

const field = "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sigma focus:outline-none focus:ring-2 focus:ring-sigma/30";

// Plain HTML form handled by Netlify Forms (detected from the built HTML at deploy time).
export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="font-display text-4xl text-sigma-dark">Contact Us</h1>
      <p className="mt-3 text-muted">
        Questions about the chapter? Send us a message, or email{" "}
        <a className="text-sigma underline" href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>.
      </p>

      <form name="contact" method="POST" action="/contact/thanks/" data-netlify="true" netlify-honeypot="company" className="mt-8 space-y-5">
        <input type="hidden" name="form-name" value="contact" />
        <p className="hidden"><label>Leave this empty: <input name="company" /></label></p>
        <label className="block">
          <span className="text-sm font-medium">Name</span>
          <input name="name" required className={field} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input name="email" type="email" required className={field} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Message</span>
          <textarea name="message" rows={6} required className={field} />
        </label>
        <button type="submit" className="rounded-full bg-sigma px-6 py-2.5 font-semibold text-white hover:bg-sigma-dark">
          Send message
        </button>
      </form>
    </div>
  );
}

const field = "mt-1.5 w-full rounded border border-slate-300 bg-white px-3 py-2.5 focus:border-sigma focus:outline-2 focus:outline-sigma";

export default function InquiryForm({ partnership = false }: { partnership?: boolean }) {
  return (
    <form name="contact" method="POST" action="/contact/thanks/" data-netlify="true" netlify-honeypot="company" className="inquiry-form">
      <input type="hidden" name="form-name" value="contact" />
      <input type="hidden" name="inquiry-type" value={partnership ? "Community partnership" : "General inquiry"} />
      <p hidden><label>Leave this empty <input name="company" tabIndex={-1} autoComplete="off" /></label></p>
      <div className="grid gap-5 sm:grid-cols-2">
        <label>Your name<input name="name" autoComplete="name" required className={field} /></label>
        <label>Email address<input name="email" type="email" autoComplete="email" required className={field} /></label>
      </div>
      <label>Organization <span className="font-normal text-muted">(optional)</span>
        <input name="organization" autoComplete="organization" className={field} />
      </label>
      <label>{partnership ? "What would you like to work on together?" : "Your message"}
        <textarea name="message" rows={5} required className={field} />
      </label>
      <button type="submit" className="primary-link">{partnership ? "Send partnership inquiry" : "Send message"}</button>
    </form>
  );
}

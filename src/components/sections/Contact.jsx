import { useState } from "react";
import { Mail, Send } from "lucide-react";

const Contact = ({ content }) => {
  const fields = Object.fromEntries(
    content.map(({ setting_key, setting_value }) => [setting_key, setting_value]),
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState({ email: false, phone: false });
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: "", message: "" });
    setFieldError({ email: false, phone: false });

    if (!supabaseUrl || !supabaseAnonKey) {
      setFormStatus({ type: "error", message: fields.configuration_error });
      setIsSubmitting(false);
      return;
    }
    if (!formData.email && !formData.phone) {
      setFieldError({ email: true, phone: true });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone || null,
          message: formData.message,
          created_at: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error(`Contact submission failed (${response.status})`);
      setFormStatus({ type: "success", message: fields.success_message });
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error("Contact form submission failed.", error);
      setFormStatus({ type: "error", message: fields.send_error });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative scroll-mt-28 px-6 py-24 sm:py-28">
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="mb-8 border-b border-slate-800 pb-4 text-3xl font-black tracking-tight text-slate-100 sm:text-4xl">
          <span className="font-mono">
            {fields.heading}
          </span>
        </h2>
        <p className="mb-12 max-w-2xl text-slate-400 sm:mb-16 sm:text-lg">{fields.intro}</p>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-6 transition-colors duration-300 hover:border-emerald-500/50">
              <div className="flex items-center gap-4 mb-4">
                <Mail className="text-emerald-400" size={24} />
                <div>
                  <p className="text-sm text-slate-400">{fields.email_label}</p>
                  <a href={`mailto:${fields.email}`} className="text-slate-200 transition-colors hover:text-emerald-400">
                    {fields.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-slate-800/80 bg-slate-900/60 p-5 sm:p-6">
              <div className="space-y-2">
                <label htmlFor="contact-name" className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder={fields.name_placeholder}
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  required
                  autoComplete="name"
                  className="w-full rounded border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-slate-200 placeholder-slate-600 transition-colors focus:border-emerald-500/60 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="contact-email" className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder={fields.email_placeholder}
                  value={formData.email}
                  onChange={(event) => {
                    setFormData({ ...formData, email: event.target.value });
                    setFieldError((current) => ({ ...current, email: false }));
                  }}
                  autoComplete="email"
                  aria-describedby={fieldError.email ? "contact-method-error" : undefined}
                  className={`w-full rounded border bg-slate-950/80 px-4 py-3 text-slate-200 placeholder-slate-600 transition-colors focus:outline-none ${
                    fieldError.email ? "border-red-500/50" : "border-slate-700/80 focus:border-emerald-500/60"
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="contact-phone" className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
                  Phone Number
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  placeholder={fields.phone_placeholder}
                  value={formData.phone}
                  onChange={(event) => {
                    setFormData({ ...formData, phone: event.target.value });
                    setFieldError((current) => ({ ...current, phone: false }));
                  }}
                  autoComplete="tel"
                  aria-describedby={fieldError.phone ? "contact-method-error" : undefined}
                  className={`w-full rounded border bg-slate-950/80 px-4 py-3 text-slate-200 placeholder-slate-600 transition-colors focus:outline-none ${
                    fieldError.phone ? "border-red-500/50" : "border-slate-700/80 focus:border-emerald-500/60"
                  }`}
                />
              </div>
              {(fieldError.email || fieldError.phone) && (
                <p id="contact-method-error" className="text-sm text-red-400">{fields.phone_validation}</p>
              )}
              <div className="space-y-2">
                <label htmlFor="contact-message" className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  placeholder={fields.message_placeholder}
                  rows="5"
                  value={formData.message}
                  onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                  required
                  className="w-full resize-y rounded border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-slate-200 placeholder-slate-600 transition-colors focus:border-emerald-500/60 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded bg-emerald-500 px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={20} />
                {isSubmitting ? fields.submitting_label : fields.submit_label}
              </button>
              {formStatus.message && (
                <div className={`p-4 rounded-lg ${
                  formStatus.type === "success"
                    ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    : "border border-red-500/20 bg-red-500/10 text-red-400"
                }`}>
                  {formStatus.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

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
    <section id="contact" className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-5xl font-black mb-8 text-center">
          <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            {fields.heading}
          </span>
        </h2>
        <p className="text-center text-slate-400 text-lg mb-16">{fields.intro}</p>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <Mail className="text-cyan-400" size={24} />
                <div>
                  <p className="text-sm text-slate-400">{fields.email_label}</p>
                  <a href={`mailto:${fields.email}`} className="text-slate-200 hover:text-cyan-400 transition-colors">
                    {fields.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                placeholder={fields.name_placeholder}
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
              />
              <input
                type="email"
                placeholder={fields.email_placeholder}
                value={formData.email}
                onChange={(event) => {
                  setFormData({ ...formData, email: event.target.value });
                  setFieldError((current) => ({ ...current, email: false }));
                }}
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none transition-all ${
                  fieldError.email ? "border-red-500/50" : "border-slate-700/50 focus:border-cyan-500/50"
                }`}
              />
              <input
                type="tel"
                placeholder={fields.phone_placeholder}
                value={formData.phone}
                onChange={(event) => {
                  setFormData({ ...formData, phone: event.target.value });
                  setFieldError((current) => ({ ...current, phone: false }));
                }}
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none transition-all ${
                  fieldError.phone ? "border-red-500/50" : "border-slate-700/50 focus:border-cyan-500/50"
                }`}
              />
              {(fieldError.email || fieldError.phone) && (
                <p className="text-red-400 text-sm -mt-3">{fields.phone_validation}</p>
              )}
              <textarea
                placeholder={fields.message_placeholder}
                rows="5"
                value={formData.message}
                onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all resize-none"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send size={20} />
                {isSubmitting ? fields.submitting_label : fields.submit_label}
              </button>
              {formStatus.message && (
                <div className={`p-4 rounded-lg ${
                  formStatus.type === "success"
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                    : "bg-red-500/10 border border-red-500/20 text-red-400"
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

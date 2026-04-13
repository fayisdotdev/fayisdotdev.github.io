import {
  Mail,
  Github,
  Linkedin,
  MapPin,
  Phone,
  Download,
  Send,
  Code,
  Database,
  BarChart3,
  Smartphone,
  Brain,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

import React, { useState } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState({
    email: false,
    phone: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: "", message: "" });
    setFieldError({ email: false, phone: false });

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      setFormStatus({
        type: "error",
        message: "Configuration error. Please check Supabase credentials.",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.email && !formData.phone) {
      setFieldError({
        email: true,
        phone: true,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
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

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setFormStatus({
        type: "success",
        message: "Message sent successfully! I'll get back to you soon.",
      });

      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      setFormStatus({
        type: "error",
        message: "Failed to send message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-5xl font-black mb-8 text-center">
          <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Let's Work Together
          </span>
        </h2>
        <p className="text-center text-slate-400 text-lg mb-16">
          Currently open to new opportunities and exciting projects
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <Mail className="text-cyan-400" size={24} />
                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  <a
                    href="mailto:muhammadfayiskmofficial@gmail.com"
                    className="text-slate-200 hover:text-cyan-400 transition-colors"
                  >
                    muhammadfayiskmofficial@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300"> */}
                {/* <div className="flex items-center gap-4 mb-4"> */}
                  {/* <MapPin className="text-emerald-400" size={24} />
                  <div>
                    <p className="text-sm text-slate-400">Current Location</p>
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                      <span className="text-slate-200 font-semibold">
                        Dubai, UAE
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <MapPin className="text-cyan-400" size={24} />
                  <div>
                    <p className="text-sm text-slate-400">Home</p>
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full"></span>
                      <span className="text-slate-200">Kerala, India</span>
                    </div>
                  </div> */}
                {/* </div> */}
              {/* </div> */}
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setFieldError((prev) => ({ ...prev, email: false }));
                  }}
                  className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none transition-all ${
                    fieldError.email
                      ? "border-red-500/50 focus:border-red-500/50"
                      : "border-slate-700/50 focus:border-cyan-500/50"
                  }`}
                />
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="Your whatsapp number. (Optional)"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    setFieldError((prev) => ({ ...prev, phone: false }));
                  }}
                  className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none transition-all ${
                    fieldError.phone
                      ? "border-red-500/50 focus:border-red-500/50"
                      : "border-slate-700/50 focus:border-cyan-500/50"
                  }`}
                />
              </div>

              {(fieldError.email || fieldError.phone) && (
                <p className="text-red-400 text-sm -mt-3">
                  Please provide either email or phone number.
                </p>
              )}

              <div>
                <textarea
                  placeholder="Your Message"
                  rows="5"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </button>

              {formStatus.message && (
                <div
                  className={`p-4 rounded-lg ${
                    formStatus.type === "success"
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                      : "bg-red-500/10 border border-red-500/20 text-red-400"
                  }`}
                >
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

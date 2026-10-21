import { Github, Linkedin, Mail, ChevronDown } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinktree } from "@fortawesome/free-brands-svg-icons";

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
  linktree: null,
};

const Hero = ({ scrollToSection, content, actions, socialLinks }) => {
  const fields = Object.fromEntries(
    content.map(({ content_key, field_value }) => [content_key, field_value]),
  );
  const highlightedTagline = (fields.tagline || "").split(
    /(Flutter and Raact|Power BI|Python|ML)/g,
  );
  return (
    <section
      id="home"
      className="relative flex min-h-screen scroll-mt-28 items-center justify-center px-6 pb-12 pt-28"
    >
      <div className="relative z-10 mx-auto max-w-5xl space-y-8 border-l-2 border-slate-800/80 py-4 pl-6 text-left sm:pl-10">
        <div className="space-y-4 animate-fadeIn">
          <p className="font-mono text-sm font-bold uppercase tracking-widest text-emerald-400">
            {fields.greeting}
          </p>
          <h1 className="break-words font-mono text-4xl font-black uppercase leading-tight tracking-tighter text-slate-100 sm:text-6xl md:text-7xl">
            {fields.name}
          </h1>
          <p className="font-mono text-lg font-bold tracking-tight text-emerald-400 md:text-2xl">
            {fields.role}
          </p>
        </div>

        <p className="max-w-3xl text-sm leading-relaxed text-slate-400 sm:text-base">
          {highlightedTagline.map((part, index) =>
            ["Flutter and Raact", "Power BI", "Python", "ML"].includes(part) ? (
              <span
                key={`${part}-${index}`}
                className={
                  part === "Flutter and Raact"
                    ? "text-cyan-400 font-semibold"
                    : "text-emerald-400 font-semibold"
                }
              >
                {part}
              </span>
            ) : part,
          )}
        </p>

        <div className="flex flex-wrap gap-4 text-slate-300">
          {/* <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50"> */}
            {/* <MapPin size={18} className="text-cyan-400" /> */}
            {/* <span>Dubai, UAE</span> */}
          {/* </div> */}
          {/* <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50"> */}
            {/* <span className="text-emerald-400">●</span> */}
            {/* <span>Available Immediately</span> */}
          {/* </div> */}
        </div>

        <div className="flex flex-wrap gap-3 pt-4">
          {actions.map((action, index) => (
            <button
              key={action.id || action.content_key}
              onClick={() => scrollToSection(action.section_id)}
              className={`flex items-center gap-2 rounded px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                index === 0
                  ? "bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:bg-emerald-400"
                  : "border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-emerald-500/50 hover:text-slate-100"
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>

        <div className="flex gap-5 pt-4">
          {socialLinks.map((item) => {
            const Icon = socialIcons[item.platform];
            return (
              <a
                key={item.content_key || item.id}
                href={item.url}
                target={item.url.startsWith("mailto:") ? undefined : "_blank"}
                rel={item.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                aria-label={item.label}
                className="text-slate-500 transition-colors hover:text-emerald-400"
              >
                {item.platform === "linktree" ? (
                  <FontAwesomeIcon icon={faLinktree} size="2x" />
                ) : Icon ? (
                  <Icon size={28} />
                ) : null}
              </a>
            );
          })}
        </div>

        <div className="pt-4">
          <ChevronDown size={24} className="text-emerald-500/50" />
        </div>
      </div>
    </section>
  );
};
export default Hero;

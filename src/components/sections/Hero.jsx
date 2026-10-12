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
      className="relative min-h-screen flex items-center justify-center px-6 pt-20"
    >
      <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
        <div className="space-y-4 animate-fadeIn">
          <p className="text-cyan-400 text-lg font-medium tracking-wide">
            {fields.greeting}
          </p>
          <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent leading-tight">
            {fields.name}
          </h1>
          <p className="text-2xl md:text-3xl text-slate-300 font-light">
            {fields.role}
          </p>
        </div>

        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
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

        <div className="flex flex-wrap justify-center gap-4 text-slate-300">
          {/* <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50"> */}
            {/* <MapPin size={18} className="text-cyan-400" /> */}
            {/* <span>Dubai, UAE</span> */}
          {/* </div> */}
          {/* <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50"> */}
            {/* <span className="text-emerald-400">●</span> */}
            {/* <span>Available Immediately</span> */}
          {/* </div> */}
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          {actions.map((action, index) => (
            <button
              key={action.id || action.content_key}
              onClick={() => scrollToSection(action.section_id)}
              className={`px-8 py-4 font-semibold rounded-lg hover:scale-105 transition-all duration-300 ${
                index === 0
                  ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/20"
                  : "bg-slate-800/50 text-slate-200 border border-slate-700/50 hover:bg-slate-700/50"
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-6 pt-8">
          {socialLinks.map((item) => {
            const Icon = socialIcons[item.platform];
            return (
              <a
                key={item.content_key || item.id}
                href={item.url}
                target={item.url.startsWith("mailto:") ? undefined : "_blank"}
                rel={item.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                aria-label={item.label}
                className="text-slate-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
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

        <div className="pt-12 animate-bounce">
          <ChevronDown size={32} className="mx-auto text-cyan-400/50" />
        </div>
      </div>
    </section>
  );
};
export default Hero;

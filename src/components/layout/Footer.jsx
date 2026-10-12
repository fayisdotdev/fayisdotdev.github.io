import { Github, Linkedin, Mail } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinktree } from "@fortawesome/free-brands-svg-icons";

const icons = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
  linktree: null,
};

const Footer = ({ links, content }) => {
  const settings = Object.fromEntries(
    content.map(({ setting_key, setting_value }) => [setting_key, setting_value]),
  );
  return (
    <footer className="relative py-12 px-6 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto text-center space-y-6">
        <div className="flex justify-center gap-6">
          {links.map((link) => {
            const Icon = icons[link.platform];
            return (
              <a
                key={link.content_key || link.id}
                href={link.url}
                target={link.url.startsWith("mailto:") ? undefined : "_blank"}
                rel={link.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                aria-label={link.label}
                className="text-slate-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
              >
                {link.platform === "linktree" ? (
                  <FontAwesomeIcon icon={faLinktree} className="text-xl" />
                ) : Icon ? (
                  <Icon size={24} />
                ) : null}
              </a>
            );
          })}
        </div>
        <p className="text-slate-500 text-sm">
          {settings.copyright_prefix}{new Date().getFullYear()}{settings.copyright_owner}
        </p>
      </div>
    </footer>
  );
};

export default Footer;

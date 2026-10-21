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
    <footer className="relative z-10 border-t border-slate-800/80 px-6 py-10">
      <div className="mx-auto max-w-7xl space-y-6 text-center">
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
                className="text-slate-500 transition-colors hover:text-emerald-400"
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
        <p className="font-mono text-xs text-slate-600">
          {settings.copyright_prefix}{new Date().getFullYear()}{settings.copyright_owner}
        </p>
      </div>
    </footer>
  );
};

export default Footer;

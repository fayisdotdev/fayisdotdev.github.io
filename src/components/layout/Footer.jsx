import { Github, Linkedin, Mail } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinktree } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="relative py-12 px-6 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto text-center space-y-6">

        <div className="flex justify-center gap-6">

          <a href="https://github.com/fayisdotdev" target="_blank" rel="noopener noreferrer"
            className="text-slate-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110">
            <Github size={24} />
          </a>

          <a href="https://linkedin.com/in/fayisdotdev" target="_blank" rel="noopener noreferrer"
            className="text-slate-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110">
            <Linkedin size={24} />
          </a>

          <a href="https://linktr.ee/fayisdotdev" target="_blank" rel="noopener noreferrer"
            className="text-slate-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
            aria-label="Linktree">
            <FontAwesomeIcon icon={faLinktree} className="text-xl" />
          </a>

          <a href="mailto:muhammadfayiskmofficial@gmail.com"
            className="text-slate-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110">
            <Mail size={24} />
          </a>

        </div>

        <p className="text-slate-500 text-sm">
          © 2024 to {new Date().getFullYear()} Muhammad Fayis K M.
        </p>

      </div>
    </footer>
  );
};

export default Footer;

import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative py-12 px-6 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto text-center space-y-6">

        {/* Social links */}
        <div className="flex justify-center gap-6">
          <a
            href="https://github.com/fayisdotdev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
          >
            <Github size={24} />
          </a>

          <a
            href="https://linkedin.com/in/fayisdotdev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
          >
            <Linkedin size={24} />
          </a>

          <a
            href="mailto:muhammadfayiskmofficial@gmail.com"
            className="text-slate-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
          >
            <Mail size={24} />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} Muhammad Fayis K M.
        </p>

      </div>
    </footer>
  );
};

export default Footer;

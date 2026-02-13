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

{
  /* Hero Section */
}
const Hero = ({ scrollToSection }) => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center px-6 pt-20"
    >
      <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
        <div className="space-y-4 animate-fadeIn">
          <p className="text-cyan-400 text-lg font-medium tracking-wide">
            Hello, I'm
          </p>
          <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent leading-tight">
            Muhammad Fayis
          </h1>
          <p className="text-2xl md:text-3xl text-slate-300 font-light">
            Software Developer <span className="text-cyan-400">×</span> Data
            Analyst
          </p>
        </div>

        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Building high-performance mobile applications with{" "}
          <span className="text-cyan-400 font-semibold">Flutter</span> and
          deriving actionable insights from complex datasets using{" "}
          <span className="text-emerald-400 font-semibold">Python</span>,
          <span className="text-emerald-400 font-semibold"> Power BI</span>, and{" "}
          <span className="text-emerald-400 font-semibold">ML</span>
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-slate-300">
          <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50">
            <MapPin size={18} className="text-cyan-400" />
            <span>Dubai, UAE</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50">
            <span className="text-emerald-400">●</span>
            <span>Available Immediately</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button
            onClick={() => scrollToSection("projects")}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/20"
          >
            View Projects
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="px-8 py-4 bg-slate-800/50 text-slate-200 font-semibold rounded-lg hover:bg-slate-700/50 transition-all duration-300 border border-slate-700/50"
          >
            Get In Touch
          </button>
        </div>

        <div className="flex justify-center gap-6 pt-8">
          <a
            href="https://github.com/fayisdotdev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
          >
            <Github size={28} />
          </a>
          <a
            href="https://linkedin.com/in/fayisdotdev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
          >
            <Linkedin size={28} />
          </a>
          <a
            href="mailto:muhammadfayiskmofficial@gmail.com"
            className="text-slate-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
          >
            <Mail size={28} />
          </a>
        </div>

        <div className="pt-12 animate-bounce">
          <ChevronDown size={32} className="mx-auto text-cyan-400/50" />
        </div>
      </div>
    </section>
  );
};
export default Hero;

import { ExternalLink, Github } from "lucide-react";

const Projects = ({ projects }) => {
  return (
    <section id="projects" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-5xl font-black mb-16 text-center">
          <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Featured Projects
          </span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 group"
            >
              <div className="p-8 space-y-4">
                <div className="flex items-start justify-between">
                  <project.icon
                    className="text-cyan-400 group-hover:scale-110 transition-transform duration-300"
                    size={40}
                  />
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-cyan-400 transition-colors"
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-100 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-cyan-400 mb-1">{project.role}</p>
                  <p className="text-xs text-slate-500">{project.period}</p>
                </div>

                <p className="text-slate-300 leading-relaxed">
                  {project.description}
                </p>

                <div className="space-y-2">
                  {project.highlights.map((highlight, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-sm text-slate-400"
                    >
                      <span className="text-emerald-400 mt-1">→</span>
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-4">
                  {project.tech.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-slate-700/50 text-xs text-slate-300 rounded-full border border-slate-600/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>{" "}
    </section>
  );
};

export default Projects;

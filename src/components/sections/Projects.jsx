import {
  Brain,
  Code,
  Database,
  ExternalLink,
  Smartphone,
} from "lucide-react";

const projectIcons = { Brain, Code, Database, Smartphone };

const Projects = ({ projects, heading }) => {
  return (
    <section id="projects" className="relative scroll-mt-28 px-6 py-24 sm:py-28">
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="mb-12 border-b border-slate-800 pb-4 text-3xl font-black tracking-tight text-slate-100 sm:mb-16 sm:text-4xl">
          <span className="font-mono">
            {heading}
          </span>
        </h2>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, idx) => (
            (() => {
              const Icon = projectIcons[project.icon] || Smartphone;
              return (
                <div
                  key={idx}
                  className="group overflow-hidden rounded-lg border border-slate-800/80 bg-slate-900/60 transition-colors duration-300 hover:border-emerald-500/50"
                >
              <div className="space-y-4 p-5 sm:p-6">
                <div className="flex items-start justify-between">
                  <Icon
                    className="text-emerald-400 transition-transform duration-300 group-hover:scale-110"
                    size={40}
                  />
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 transition-colors hover:text-emerald-400"
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>

                <div>
                  <h3 className="mb-2 font-mono text-xl font-bold text-slate-100">
                    {project.title}
                  </h3>
                  <p className="mb-1 font-mono text-sm text-emerald-400">{project.role}</p>
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
                      <span className="mt-1 text-emerald-400">→</span>
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-4">
                  {project.tech.map((tech, i) => (
                    <span
                      key={i}
                      className="rounded border border-slate-700/80 bg-slate-950/80 px-2.5 py-1 font-mono text-[10px] text-slate-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
                </div>
              );
            })()
          ))}
        </div>
      </div>{" "}
    </section>
  );
};

export default Projects;

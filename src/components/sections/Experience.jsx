import { ExternalLink } from "lucide-react";

const Experience = ({ experience, heading }) => {
  return (
    <section id="experience" className="relative scroll-mt-28 border-y border-slate-800/70 bg-slate-900/30 px-6 py-24 sm:py-28">
      <div className="max-w-5xl mx-auto relative z-10">
        <h2 className="mb-12 border-b border-slate-800 pb-4 text-3xl font-black tracking-tight text-slate-100 sm:mb-16 sm:text-4xl">
          <span className="font-mono">
            {heading}
          </span>
        </h2>

        <div className="space-y-8">
          {experience.map((exp, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-5 transition-colors duration-300 hover:border-emerald-500/40 sm:p-7"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h3 className="mb-2 font-mono text-xl font-bold text-slate-100">
                    {exp.title}
                  </h3>

                  {/* Company + Link Icon */}
                  <div className="flex items-center gap-2">
                    {exp.link ? (
                      <a
                        href={exp.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 font-semibold text-emerald-400 hover:underline"
                      >
                        {exp.company}
                        <ExternalLink size={16} className="text-slate-400 hover:text-cyan-400" />
                      </a>
                    ) : (
                      <p className="font-semibold text-emerald-400">{exp.company}</p>
                    )}
                  </div>

                  <p className="text-slate-400 text-sm">{exp.location}</p>
                </div>

                <span className="mt-2 font-mono text-xs text-emerald-400 md:mt-0">
                  {exp.period}
                </span>
              </div>

              <ul className="space-y-2 mt-6">
                {exp.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-400 sm:text-base">
                    <span className="mt-1 text-emerald-400">•</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;

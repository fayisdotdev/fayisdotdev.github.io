import { ExternalLink } from "lucide-react";

const Experience = ({ experience }) => {
  return (
    <section id="experience" className="relative py-32 px-6 bg-slate-900/50">
      <div className="max-w-5xl mx-auto relative z-10">
        <h2 className="text-5xl font-black mb-16 text-center">
          <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Experience
          </span>
        </h2>

        <div className="space-y-8">
          {experience.map((exp, idx) => (
            <div
              key={idx}
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 hover:border-cyan-500/50 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-100 mb-2">
                    {exp.title}
                  </h3>

                  {/* Company + Link Icon */}
                  <div className="flex items-center gap-2">
                    {exp.link ? (
                      <a
                        href={exp.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 font-semibold hover:underline flex items-center gap-1"
                      >
                        {exp.company}
                        <ExternalLink size={16} className="text-slate-400 hover:text-cyan-400" />
                      </a>
                    ) : (
                      <p className="text-cyan-400 font-semibold">{exp.company}</p>
                    )}
                  </div>

                  <p className="text-slate-400 text-sm">{exp.location}</p>
                </div>

                <span className="text-emerald-400 text-sm font-medium mt-2 md:mt-0">
                  {exp.period}
                </span>
              </div>

              <ul className="space-y-2 mt-6">
                {exp.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300">
                    <span className="text-cyan-400 mt-1 text-lg">•</span>
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

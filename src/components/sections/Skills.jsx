import { Code, Smartphone, Database, BarChart3, Brain } from "lucide-react";

const icons = {
  languages: Code,
  frameworks: Smartphone,
  stateManagement: Database,
  dataAnalysis: BarChart3,
  devops: Brain, // example for future categories
};

const colors = {
  languages: "from-cyan-500 to-emerald-500",
  frameworks: "from-emerald-500 to-cyan-500",
  stateManagement: "from-blue-500 to-cyan-500",
  dataAnalysis: "from-purple-500 to-pink-500",
  devops: "from-orange-500 to-red-500",
};

const Skills = ({ skills, categories, heading }) => {
  return (
    <section id="skills" className="relative scroll-mt-28 border-y border-slate-800/70 bg-slate-900/30 px-6 py-24 sm:py-28">
      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="mb-12 border-b border-slate-800 pb-4 text-3xl font-black tracking-tight text-slate-100 sm:mb-16 sm:text-4xl">
          <span className="font-mono">
            {heading}
          </span>
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          {categories.map(({ category_key: category, title, icon, gradient }) => {
            const Icon = icons[icon] || icons[category] || Code;
            const knownGradients = Object.values(colors);
            const safeGradient = knownGradients.includes(gradient)
              ? gradient
              : colors[category] || "from-cyan-500 to-emerald-500";
            const list = skills[category] || [];

            return (
              <div key={category} className="space-y-5 rounded-lg border border-slate-800/80 bg-slate-900/50 p-5 sm:p-6">
                <h3 className="mb-6 flex items-center gap-3 font-mono text-lg font-bold text-emerald-400 sm:text-xl">
                  <Icon size={24} />
                  {title}
                </h3>

                {list.map((skill, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between gap-4 text-sm text-slate-300">
                      <span className="font-semibold">{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-sm border border-slate-800 bg-slate-950 p-px">
                      <div
                        className={`h-full bg-gradient-to-r ${safeGradient || gradient} rounded-full transition-all duration-1000`}
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;

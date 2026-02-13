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

const titles = {
  languages: "Programming Languages",
  frameworks: "Frameworks & Backend",
  stateManagement: "State Management",
  dataAnalysis: "Data Analysis & ML",
  devops: "DevOps & Tools",
};

const Skills = ({ skills }) => {
  return (
    <section id="skills" className="relative py-32 px-6 bg-slate-900/50">
      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-5xl font-black mb-16 text-center">
          <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Skills & Technologies
          </span>
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          {Object.entries(skills).map(([category, list]) => {
            const Icon = icons[category] || Code;
            const gradient = colors[category] || "from-cyan-500 to-emerald-500";
            const title = titles[category] || category;

            return (
              <div key={category} className="space-y-6">
                <h3 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-3">
                  <Icon size={28} />
                  {title}
                </h3>

                {list.map((skill, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-slate-300">
                      <span className="font-semibold">{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>

                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-1000`}
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

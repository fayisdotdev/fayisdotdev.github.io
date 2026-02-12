import { Code, Smartphone, Database, BarChart3 } from "lucide-react";

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
          {/* Languages */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-3">
              <Code size={28} />
              Programming Languages
            </h3>
            {skills.languages.map((skill, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span className="font-semibold">{skill.name}</span>
                  <span>{skill.level}%</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-1000"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Frameworks */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-emerald-400 mb-6 flex items-center gap-3">
              <Smartphone size={28} />
              Frameworks & Backend
            </h3>
            {skills.frameworks.map((skill, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span className="font-semibold">{skill.name}</span>
                  <span>{skill.level}%</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-1000"
                    style={{
                      width: `${skill.level}%`,
                      animationDelay: `${idx * 0.1}s`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* State Management */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-blue-400 mb-6 flex items-center gap-3">
              <Database size={28} />
              State Management
            </h3>
            {skills.stateManagement.map((skill, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span className="font-semibold">{skill.name}</span>
                  <span>{skill.level}%</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Data Analysis */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-purple-400 mb-6 flex items-center gap-3">
              <BarChart3 size={28} />
              Data Analysis & ML
            </h3>
            {skills.dataAnalysis.map((skill, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span className="font-semibold">{skill.name}</span>
                  <span>{skill.level}%</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;

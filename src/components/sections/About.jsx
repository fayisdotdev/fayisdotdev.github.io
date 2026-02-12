import { Code, Database, BarChart3, Smartphone, Brain } from "lucide-react";

const About = () => {
  return (

      <section id="about" className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-5xl font-black mb-16 text-center">
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              About Me
            </span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <p className="text-lg text-slate-300 leading-relaxed">
                A versatile{" "}
                <span className="text-cyan-400 font-semibold">
                  Software Developer & Data Analyst
                </span>{" "}
                with
                <span className="text-emerald-400 font-semibold">
                  {" "}
                  1.5+ years
                </span>{" "}
                of experience in delivering high-performance mobile applications
                and deriving actionable insights from complex datasets.
              </p>
              <p className="text-lg text-slate-300 leading-relaxed">
                Skilled in{" "}
                <span className="text-cyan-400">
                  Flutter, Firebase, Supabase, BLoC, GetX, Clean Architecture
                </span>
                , and{" "}
                <span className="text-emerald-400">
                  Python, SQL, Excel, Power BI, Machine Learning
                </span>
                . Experienced in building scalable apps across CRM, service
                booking, and automotive domains.
              </p>
              <p className="text-lg text-slate-300 leading-relaxed">
                Strong ability to deliver end-to-end solutions, create
                dashboards and reports, collaborate in Agile teams, and ship
                production-ready features under tight deadlines.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: Code,
                  title: "Flutter Development",
                  desc: "Cross-platform mobile apps",
                },
                {
                  icon: BarChart3,
                  title: "Data Analysis",
                  desc: "Python, Power BI, SQL",
                },
                {
                  icon: Brain,
                  title: "Machine Learning",
                  desc: "Predictive models, ML",
                },
                {
                  icon: Database,
                  title: "Backend & Cloud",
                  desc: "Firebase, Supabase, APIs",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <item.icon className="text-cyan-400 mb-3" size={32} />
                  <h3 className="font-semibold text-slate-200 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-4 justify-center">
            {[
              "Analytical Thinking",
              "Problem Solving",
              "Team Collaboration",
              "Agile/Scrum",
              "Communication",
              "Adaptability",
            ].map((strength, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 rounded-full text-sm text-slate-300"
              >
                {strength}
              </span>
            ))}
          </div>
        </div>
      </section>

  )
};

export default About;
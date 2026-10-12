import { Code, Database, BarChart3, Smartphone, Brain } from "lucide-react";

const icons = { Code, Database, BarChart3, Smartphone, Brain };

const About = ({ content, cards, strengths }) => {
  const fields = Object.fromEntries(
    content.map(({ content_key, field_value }) => [content_key, field_value]),
  );
  return (
      <section id="about" className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-5xl font-black mb-16 text-center">
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              {fields.heading}
            </span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              {content
                .filter((item) => item.content_key.startsWith("paragraph_"))
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((item) => (
                  <p key={item.id || item.content_key} className="text-lg text-slate-300 leading-relaxed">
                    {item.field_value}
                  </p>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {cards.map((item, idx) => {
                const Icon = icons[item.icon] || Code;
                return (
                <div
                  key={item.id || item.content_key}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <Icon className="text-cyan-400 mb-3" size={32} />
                  <h3 className="font-semibold text-slate-200 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400">                  {item.description}</p>
                </div>
              );})}
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-4 justify-center">
            {strengths.map((strength) => (
              <span
                key={strength.id || strength.content_key}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 rounded-full text-sm text-slate-300"
              >
                {strength.label}
              </span>
            ))}
          </div>
        </div>
      </section>

  )
};

export default About;
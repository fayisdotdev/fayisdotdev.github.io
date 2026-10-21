import { Code, Database, BarChart3, Smartphone, Brain } from "lucide-react";

const icons = { Code, Database, BarChart3, Smartphone, Brain };

const About = ({ content, cards, strengths }) => {
  const fields = Object.fromEntries(
    content.map(({ content_key, field_value }) => [content_key, field_value]),
  );
  return (
      <section id="about" className="relative scroll-mt-28 px-6 py-24 sm:py-28">
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="mb-12 border-b border-slate-800 pb-4 text-3xl font-black tracking-tight text-slate-100 sm:mb-16 sm:text-4xl">
            <span className="font-mono">
              {fields.heading}
            </span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              {content
                .filter((item) => item.content_key.startsWith("paragraph_"))
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((item) => (
                  <p key={item.id || item.content_key} className="text-base leading-relaxed text-slate-400 sm:text-lg">
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
                  className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-5 transition-colors duration-300 hover:border-emerald-500/50 sm:p-6"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <Icon className="mb-3 text-emerald-400" size={28} />
                  <h3 className="mb-1 font-mono font-bold text-slate-200">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500">{item.description}</p>
                </div>
              );})}
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-4 justify-center">
            {strengths.map((strength) => (
              <span
                key={strength.id || strength.content_key}
                className="rounded border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 font-mono text-xs text-slate-400"
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
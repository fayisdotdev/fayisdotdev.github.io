import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import {
  fetchPortfolioContent,
  getDefaultPortfolioContent,
  savePortfolioContent,
} from "../../services/portfolioContentService";

const inputClassName =
  "mt-1 w-full border border-slate-700 bg-slate-950/70 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500";

const TextField = ({ label, value, onChange, type = "text" }) => (
  <label className="block text-sm text-slate-300">
    {label}
    <input
      type={type}
      value={value || ""}
      onChange={onChange}
      className={inputClassName}
    />
  </label>
);

const TextAreaField = ({ label, value, onChange, rows = 3 }) => (
  <label className="block text-sm text-slate-300">
    {label}
    <textarea
      rows={rows}
      value={value || ""}
      onChange={onChange}
      className={`${inputClassName} resize-y`}
    />
  </label>
);

const listFromText = (value) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const PortfolioContentEditor = () => {
  const [content, setContent] = useState(getDefaultPortfolioContent);
  const [section, setSection] = useState("projects");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    fetchPortfolioContent()
      .then((savedContent) => {
        if (active) setContent(savedContent);
      })
      .catch(() => {
        if (active) {
          setError(
            "Portfolio storage is not available yet. Run supabase/portfolio_content_policies.sql in your Supabase SQL Editor, then reload this page.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const updateItem = (collection, index, field, value) => {
    setContent((current) => ({
      ...current,
      [collection]: current[collection].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
    setSuccess("");
  };

  const addItem = (collection, item) => {
    setContent((current) => ({
      ...current,
      [collection]: [...current[collection], item],
    }));
    setSuccess("");
  };

  const removeItem = (collection, index) => {
    setContent((current) => ({
      ...current,
      [collection]: current[collection].filter((_, itemIndex) => itemIndex !== index),
    }));
    setSuccess("");
  };

  const moveProjectTo = (index, targetIndex) => {
    setContent((current) => {
      if (targetIndex < 0 || targetIndex >= current.projects.length) return current;

      const nextProjects = [...current.projects];
      const [project] = nextProjects.splice(index, 1);
      nextProjects.splice(targetIndex, 0, project);

      return { ...current, projects: nextProjects };
    });
    setSuccess("");
  };

  const updateSkill = (category, index, field, value) => {
    setContent((current) => ({
      ...current,
      skills: {
        ...current.skills,
        [category]: current.skills[category].map((skill, skillIndex) =>
          skillIndex === index ? { ...skill, [field]: value } : skill,
        ),
      },
    }));
    setSuccess("");
  };

  const removeSkill = (category, index) => {
    setContent((current) => ({
      ...current,
      skills: {
        ...current.skills,
        [category]: current.skills[category].filter(
          (_, skillIndex) => skillIndex !== index,
        ),
      },
    }));
    setSuccess("");
  };

  const addSkill = (category) => {
    setContent((current) => ({
      ...current,
      skills: {
        ...current.skills,
        [category]: [...current.skills[category], { name: "", level: 50 }],
      },
    }));
    setSuccess("");
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      setContent(await savePortfolioContent(content));
      setSuccess("Portfolio content saved.");
    } catch {
      setError(
        "Could not save portfolio content. Confirm the Supabase table is set up and this account has the admin role.",
      );
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "skills", label: "Skills" },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Portfolio content</h2>
          <p className="mt-1 text-sm text-slate-400">
            Changes appear on the public portfolio after saving.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={loading || saving}
          className="flex items-center gap-2 bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>

      <div className="flex gap-2 border-b border-slate-800" role="tablist" aria-label="Portfolio sections">
        {sections.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={section === item.id}
            onClick={() => setSection(item.id)}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              section === item.id
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
          {success}
        </p>
      )}

      {loading ? (
        <p className="py-8 text-center text-slate-400">Loading portfolio content...</p>
      ) : (
        <div className="space-y-5">
          {section === "projects" && (
            <>
              {content.projects.map((project, index) => (
                <article key={index} className="space-y-4 border border-slate-700/70 bg-slate-900/50 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-semibold text-slate-100">Project {index + 1}</h3>
                    <div className="flex items-center">
                      <label className="mr-2 flex items-center gap-2 text-sm text-slate-400">
                        Order
                        <select
                          value={index}
                          onChange={(event) =>
                            moveProjectTo(index, Number(event.target.value))
                          }
                          aria-label={`Order for project ${index + 1}`}
                          className="border border-slate-700 bg-slate-950 px-2 py-1 text-slate-100 outline-none focus:border-cyan-500"
                        >
                          {content.projects.map((_, orderIndex) => (
                            <option key={orderIndex} value={orderIndex}>
                              {orderIndex + 1}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button
                        type="button"
                        onClick={() => removeItem("projects", index)}
                        aria-label={`Remove project ${index + 1}`}
                        title="Remove project"
                        className="p-2 text-slate-400 transition-colors hover:text-red-300"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextField label="Title" value={project.title} onChange={(event) => updateItem("projects", index, "title", event.target.value)} />
                    <TextField label="Role" value={project.role} onChange={(event) => updateItem("projects", index, "role", event.target.value)} />
                    <TextField label="Period" value={project.period} onChange={(event) => updateItem("projects", index, "period", event.target.value)} />
                    <TextField label="Project link" value={project.link} onChange={(event) => updateItem("projects", index, "link", event.target.value)} />
                    <label className="block text-sm text-slate-300">
                      Icon
                      <select value={project.icon || "Code"} onChange={(event) => updateItem("projects", index, "icon", event.target.value)} className={inputClassName}>
                        {["Brain", "Code", "Database", "Smartphone"].map((icon) => <option key={icon}>{icon}</option>)}
                      </select>
                    </label>
                    <TextAreaField label="Description" value={project.description} onChange={(event) => updateItem("projects", index, "description", event.target.value)} />
                    <TextAreaField label="Technologies (one per line)" value={(project.tech || []).join("\n")} onChange={(event) => updateItem("projects", index, "tech", listFromText(event.target.value))} />
                    <TextAreaField label="Highlights (one per line)" value={(project.highlights || []).join("\n")} onChange={(event) => updateItem("projects", index, "highlights", listFromText(event.target.value))} />
                  </div>
                </article>
              ))}
              <button
                type="button"
                onClick={() => addItem("projects", { title: "", role: "", period: "", description: "", tech: [], highlights: [], link: "", icon: "Code" })}
                className="flex items-center gap-2 border border-slate-700 px-4 py-2 text-sm text-slate-300 transition-colors hover:border-cyan-500 hover:text-cyan-300"
              >
                <Plus size={17} /> Add project
              </button>
            </>
          )}

          {section === "experience" && (
            <>
              {content.experience.map((item, index) => (
                <article key={index} className="space-y-4 border border-slate-700/70 bg-slate-900/50 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-semibold text-slate-100">Experience {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeItem("experience", index)}
                      aria-label={`Remove experience ${index + 1}`}
                      className="p-2 text-slate-400 transition-colors hover:text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextField label="Job title" value={item.title} onChange={(event) => updateItem("experience", index, "title", event.target.value)} />
                    <TextField label="Company" value={item.company} onChange={(event) => updateItem("experience", index, "company", event.target.value)} />
                    <TextField label="Location" value={item.location} onChange={(event) => updateItem("experience", index, "location", event.target.value)} />
                    <TextField label="Period" value={item.period} onChange={(event) => updateItem("experience", index, "period", event.target.value)} />
                    <TextField label="Company link" value={item.link} onChange={(event) => updateItem("experience", index, "link", event.target.value)} />
                    <TextAreaField label="Responsibilities (one per line)" value={(item.responsibilities || []).join("\n")} onChange={(event) => updateItem("experience", index, "responsibilities", listFromText(event.target.value))} />
                  </div>
                </article>
              ))}
              <button
                type="button"
                onClick={() => addItem("experience", { title: "", company: "", location: "", period: "", responsibilities: [], link: "" })}
                className="flex items-center gap-2 border border-slate-700 px-4 py-2 text-sm text-slate-300 transition-colors hover:border-cyan-500 hover:text-cyan-300"
              >
                <Plus size={17} /> Add experience
              </button>
            </>
          )}

          {section === "skills" &&
            Object.entries(content.skills).map(([category, list]) => (
              <section key={category} className="space-y-3 border border-slate-700/70 bg-slate-900/50 p-5">
                <h3 className="text-lg font-semibold capitalize text-slate-100">
                  {category.replace(/([A-Z])/g, " $1")}
                </h3>
                {list.map((skill, index) => (
                  <div key={`${category}-${index}`} className="grid items-end gap-3 sm:grid-cols-[1fr_140px_auto]">
                    <TextField label="Skill" value={skill.name} onChange={(event) => updateSkill(category, index, "name", event.target.value)} />
                    <TextField label="Level (0-100)" type="number" value={skill.level} onChange={(event) => updateSkill(category, index, "level", Math.min(100, Math.max(0, Number(event.target.value))))} />
                    <button
                      type="button"
                      onClick={() => removeSkill(category, index)}
                      aria-label={`Remove ${skill.name || "skill"}`}
                      className="mb-1 p-2 text-slate-400 transition-colors hover:text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addSkill(category)}
                  className="flex items-center gap-2 border border-slate-700 px-3 py-2 text-sm text-slate-300 transition-colors hover:border-cyan-500 hover:text-cyan-300"
                >
                  <Plus size={16} /> Add skill
                </button>
              </section>
            ))}
        </div>
      )}
    </section>
  );
};

export default PortfolioContentEditor;
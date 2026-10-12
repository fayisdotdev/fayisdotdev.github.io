import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { portfolioTables } from "../../data/portfolioDefaults";
import {
  createPortfolioRow,
  deletePortfolioRow,
  fetchAdminPortfolioContent,
  updatePortfolioField,
} from "../../services/portfolioContentService";

const inputClassName =
  "mt-1 w-full border border-slate-700 bg-slate-950/70 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500";

const readableLabel = (value) =>
  value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

const getNewRow = (table, rows) => {
  const key = `custom-${crypto.randomUUID()}`;
  const order = Math.max(0, ...rows.map((item) => Number(item.sort_order) || 0)) + 1;
  const base = { content_key: key, sort_order: order, is_published: true };
  switch (table) {
    case "portfolio_social_links":
      return { ...base, platform: "website", label: "New link", url: "", placement: "hero,footer" };
    case "portfolio_navigation":
      return { ...base, label: "New section", section_id: "home" };
    case "portfolio_hero_actions":
      return { ...base, label: "New action", section_id: "contact" };
    case "portfolio_about_cards":
      return { ...base, title: "New card", description: "", icon: "Code" };
    case "portfolio_about_strengths":
      return { ...base, label: "New strength" };
    case "portfolio_skill_categories":
      return { ...base, category_key: key, title: "New category", icon: "Code", gradient: "from-cyan-500 to-emerald-500" };
    case "portfolio_skills":
      return { ...base, category: "languages", category_order: 1, name: "New skill", level: 50 };
    case "portfolio_projects":
      return { ...base, title: "New project", role: "", period: "", description: "", link: "", icon: "Code" };
    case "portfolio_experience":
      return { ...base, title: "New experience", company: "", location: "", period: "", link: "" };
    case "portfolio_project_technologies":
    case "portfolio_project_highlights":
      return { ...base, project_id: rows.parentRows[0]?.id, value: "" };
    case "portfolio_experience_responsibilities":
      return { ...base, experience_id: rows.parentRows[0]?.id, value: "" };
    default:
      return null;
  }
};

const PortfolioContentEditor = ({ role }) => {
  const [rows, setRows] = useState({});
  const [parentRows, setParentRows] = useState({});
  const [activeFeature, setActiveFeature] = useState("Site settings");
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = async () => {
    const result = await fetchAdminPortfolioContent();
    setRows(result.rows);
    setParentRows(result.parentTables);
  };

  useEffect(() => {
    let active = true;
    fetchAdminPortfolioContent()
      .then((result) => {
        if (!active) return;
        setRows(result.rows);
        setParentRows(result.parentTables);
      })
      .catch((loadError) => {
        console.error("Unable to load editable portfolio content.", loadError);
        if (active) setError(`Could not load portfolio content: ${loadError.message}`);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const features = useMemo(
    () => [...new Set(portfolioTables.map((item) => item.feature))],
    [],
  );
  const currentTables = portfolioTables.filter((item) => item.feature === activeFeature);

  const saveField = async (table, id, field, value) => {
    const key = `${table}-${id}-${field}`;
    setPending(key);
    setError("");
    setNotice("");
    try {
      await updatePortfolioField(table, id, field, value);
      await load();
      setNotice("Field saved.");
    } catch (saveError) {
      console.error(`Could not update ${table}.${field}.`, saveError);
      setError(`Could not save ${readableLabel(field)}: ${saveError.message}`);
    } finally {
      setPending("");
    }
  };

  const addRow = async (definition) => {
    setError("");
    setNotice("");
    const featureRows = rows[definition.table] || [];
    const candidate = getNewRow(definition.table, {
      ...featureRows,
      parentRows: parentRows[definition.parentTable] || [],
    });
    if (!candidate) return;
    try {
      await createPortfolioRow(definition.table, candidate);
      await load();
      setNotice(`${definition.label} item added.`);
    } catch (createError) {
      console.error(`Could not add an item to ${definition.table}.`, createError);
      setError(`Could not add item: ${createError.message}`);
    }
  };

  const removeRow = async (definition, row) => {
    if (!window.confirm(`Remove this ${definition.label.toLowerCase()} item?`)) return;
    setError("");
    setNotice("");
    try {
      await deletePortfolioRow(definition.table, row.id);
      await load();
      setNotice("Item removed.");
    } catch (deleteError) {
      console.error(`Could not remove a row from ${definition.table}.`, deleteError);
      setError(`Could not remove item: ${deleteError.message}`);
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Portfolio content</h2>
        <p className="mt-1 text-sm text-slate-400">
          Each field saves independently when you leave it. Public changes take effect without a redeploy.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-800" role="tablist" aria-label="Portfolio features">
        {features.map((feature) => (
          <button
            key={feature}
            type="button"
            role="tab"
            aria-selected={activeFeature === feature}
            onClick={() => setActiveFeature(feature)}
            className={`border-b-2 px-3 py-3 text-sm font-medium ${
              activeFeature === feature
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {feature}
          </button>
        ))}
      </div>

      {error && <p role="alert" className="border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</p>}
      {notice && <p role="status" className="border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">{notice}</p>}
      {loading ? (
        <p className="py-8 text-center text-slate-400">Loading portfolio content...</p>
      ) : (
        <div className="space-y-8">
          {currentTables.map((definition) => {
            const tableRows = rows[definition.table] || [];
            const possibleParents = definition.parentTable
              ? parentRows[definition.parentTable] || []
              : [];
            return (
              <section key={definition.table} className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-slate-100">{definition.label}</h3>
                  {definition.allowAdd !== false && (
                    <button
                      type="button"
                      onClick={() => addRow(definition)}
                      className="flex items-center gap-2 border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-cyan-500 hover:text-cyan-300"
                    >
                      <Plus size={16} /> Add
                    </button>
                  )}
                </div>
                {tableRows.length === 0 ? (
                  <p className="border border-slate-800 p-4 text-sm text-slate-500">No rows.</p>
                ) : (
                  tableRows.map((row) => (
                    <article key={row.id} className="space-y-4 border border-slate-700/70 bg-slate-900/50 p-4">
                      <h4 className="font-medium text-slate-200">
                        {readableLabel(
                          row.title || row.name || row.label || row.setting_key ||
                          row.content_key || row.category || "Content item",
                        )}
                      </h4>
                      {definition.parentTable && (
                        <label className="block text-sm text-slate-300">
                          {readableLabel(definition.parentTable.replace("portfolio_", "").replace(/s$/, ""))}
                          <select
                            value={row[definition.parentId] || ""}
                            onChange={(event) => saveField(definition.table, row.id, definition.parentId, event.target.value)}
                            className={inputClassName}
                          >
                            {possibleParents.map((parent) => (
                              <option key={parent.id} value={parent.id}>{parent[definition.parentLabel]}</option>
                            ))}
                          </select>
                        </label>
                      )}
                      <div className="grid gap-3 md:grid-cols-2">
                        {definition.fields.map((field) => {
                          const value = row[field];
                          const fieldKey = `${definition.table}-${row.id}-${field}`;
                          if (field === "is_published") {
                            return (
                              <label key={field} className="flex items-center gap-2 text-sm text-slate-300">
                                <input
                                  type="checkbox"
                                  checked={Boolean(value)}
                                  disabled={pending === fieldKey}
                                  onChange={(event) => saveField(definition.table, row.id, field, event.target.checked)}
                                />
                                Published
                              </label>
                            );
                          }
                          const multiline = ["field_value", "setting_value", "description", "value"].includes(field);
                          const numeric = ["sort_order", "category_order", "level"].includes(field);
                          return (
                            <label key={field} className="block text-sm text-slate-300">
                              {readableLabel(field)}
                              {multiline ? (
                                <textarea
                                  rows={["description", "field_value", "setting_value"].includes(field) ? 3 : 2}
                                  defaultValue={value ?? ""}
                                  onBlur={(event) => {
                                    if (event.target.value !== (value ?? "")) {
                                      saveField(definition.table, row.id, field, event.target.value);
                                    }
                                  }}
                                  className={`${inputClassName} resize-y`}
                                />
                              ) : (
                                <input
                                  type={numeric ? "number" : "text"}
                                  min={field === "level" ? 0 : undefined}
                                  max={field === "level" ? 100 : undefined}
                                  defaultValue={value ?? ""}
                                  onBlur={(event) => {
                                    const nextValue = numeric && event.target.value !== ""
                                      ? Number(event.target.value)
                                      : event.target.value;
                                    if (nextValue !== value) saveField(definition.table, row.id, field, nextValue);
                                  }}
                                  className={inputClassName}
                                />
                              )}
                              {pending === fieldKey && <span className="text-xs text-cyan-300">Saving…</span>}
                            </label>
                          );
                        })}
                      </div>
                      {role === "super_admin" && (
                        <p className="text-xs text-slate-500">
                          Last updated {row.updated_at ? new Date(row.updated_at).toLocaleString() : "not yet"}
                          {row.updated_by ? ` · ${row.updated_by}` : ""}
                        </p>
                      )}
                      {definition.allowDelete !== false && (
                        <button
                          type="button"
                          onClick={() => removeRow(definition, row)}
                          aria-label={`Remove ${definition.label} row`}
                          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-red-300"
                        >
                          <Trash2 size={16} /> Remove
                        </button>
                      )}
                    </article>
                  ))
                )}
              </section>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default PortfolioContentEditor;

import { useEffect, useState } from "react";
import { Plus, Search, Trash2, X } from "lucide-react";
import { portfolioTables } from "../../data/portfolioDefaults";
import {
  createPortfolioRow,
  deletePortfolioRow,
  fetchAdminPortfolioContent,
  updatePortfolioField,
} from "../../services/portfolioContentService";

const inputClassName =
  "mt-1 w-full rounded border border-slate-700/80 bg-slate-950/80 px-3 py-2.5 text-slate-100 outline-none transition focus:border-emerald-500";

const featureInfo = {
  "Site settings": "Site & links",
  Navigation: "Menu",
  Hero: "Home page",
  About: "About",
  Skills: "Skills",
  Projects: "Projects",
  Experience: "Experience",
  Contact: "Contact",
  Footer: "Footer",
};

const tableInfo = {
  portfolio_site_settings: "Site name and section headings",
  portfolio_social_links: "Social links",
  portfolio_navigation: "Menu items",
  portfolio_hero: "Home page text",
  portfolio_hero_actions: "Home page buttons",
  portfolio_about: "About text",
  portfolio_about_cards: "About highlight cards",
  portfolio_about_strengths: "Strengths",
  portfolio_skill_categories: "Skill groups",
  portfolio_skills: "Individual skills",
  portfolio_projects: "Projects",
  portfolio_project_technologies: "Project technologies",
  portfolio_project_highlights: "Project highlights",
  portfolio_experience: "Work experience",
  portfolio_experience_responsibilities: "Responsibilities",
  portfolio_contact_settings: "Contact form text",
  portfolio_footer: "Copyright",
};

const mainFeatures = ["About", "Skills", "Projects", "Experience"];
const additionalFeatures = ["Site settings", "Navigation", "Hero", "Contact", "Footer"];

const fieldLabels = {
  setting_value: "Text",
  field_value: "Text",
  value: "Text",
  title: "Title",
  label: "Text",
  name: "Name",
  role: "Role",
  period: "Dates",
  company: "Company",
  location: "Location",
  description: "Description",
  link: "Website URL",
  url: "Profile URL",
  level: "Skill level (0–100)",
  category: "Skill group",
  section_id: "Section to open",
  platform: "Link type",
  placement: "Show link in",
  icon: "Icon name",
  gradient: "Color style",
  sort_order: "Display order",
  category_order: "Group order",
  is_published: "Visible on public site",
};

const advancedFields = new Set([
  "section_id",
  "platform",
  "placement",
  "icon",
  "gradient",
  "sort_order",
  "category_order",
  "is_published",
]);

const readableLabel = (value) =>
  value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

const fieldLabelFor = (table, field) => {
  if (field === "label") {
    if (table === "portfolio_navigation") return "Menu label";
    if (table === "portfolio_hero_actions") return "Button text";
    if (table === "portfolio_social_links") return "Link name";
    if (table === "portfolio_about_strengths") return "Strength";
  }
  if (field === "value") {
    if (table === "portfolio_project_technologies") return "Technology";
    if (table === "portfolio_project_highlights") return "Highlight";
    if (table === "portfolio_experience_responsibilities") return "Responsibility";
  }
  return fieldLabels[field] || readableLabel(field);
};

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

const readEditorState = (scope, defaultFeature) => {
  try {
    const saved = JSON.parse(sessionStorage.getItem(`portfolio-admin-editor:${scope}`) || "{}");
    return {
      activeFeature: typeof saved.activeFeature === "string" ? saved.activeFeature : defaultFeature,
      search: typeof saved.search === "string" ? saved.search : "",
    };
  } catch (storageError) {
    console.warn("Unable to restore the portfolio editor state.", storageError);
    return { activeFeature: defaultFeature, search: "" };
  }
};

const PortfolioContentEditor = ({ scope = "main" }) => {
  const [rows, setRows] = useState({});
  const [parentRows, setParentRows] = useState({});
  const visibleFeatures = scope === "additional" ? additionalFeatures : mainFeatures;
  const scopedTables = portfolioTables.filter((item) => visibleFeatures.includes(item.feature));
  const defaultFeature = scope === "additional" ? "Site settings" : "Projects";
  const [editorState] = useState(() => readEditorState(scope, defaultFeature));
  const [activeFeature, setActiveFeature] = useState(editorState.activeFeature);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState(editorState.search);

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

  const features = scope === "additional" ? additionalFeatures : mainFeatures;
  useEffect(() => {
    if (!features.includes(activeFeature)) {
      setActiveFeature(defaultFeature);
      return;
    }
    try {
      sessionStorage.setItem(
        `portfolio-admin-editor:${scope}`,
        JSON.stringify({ activeFeature, search }),
      );
    } catch (storageError) {
      console.warn("Unable to save the portfolio editor state.", storageError);
    }
  }, [activeFeature, defaultFeature, features, scope, search]);

  const currentTables = scopedTables.filter((item) => {
    if (item.feature !== activeFeature) return false;
    if (activeFeature === "Projects" && item.parentTable === "portfolio_projects") return false;
    if (activeFeature === "Experience" && item.parentTable === "portfolio_experience") return false;
    return true;
  });

  const saveField = async (table, id, field, value) => {
    const key = `${table}-${id}-${field}`;
    setPending(key);
    setError("");
    setNotice("");
    try {
      await updatePortfolioField(table, id, field, value);
      setRows((current) => ({
        ...current,
        [table]: (current[table] || []).map((row) =>
          row.id === id ? { ...row, [field]: value } : row,
        ),
      }));
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
    if (definition.parentTable && !candidate[definition.parentId]) {
      setError(`Add a ${definition.parentTable === "portfolio_projects" ? "project" : "work experience"} first.`);
      return;
    }
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

  const addRelatedRow = async (definition, parentRow) => {
    const foreignKey = definition.parentId;
    const childRows = rows[definition.table] || [];
    const sortOrder = Math.max(
      0,
      ...childRows
        .filter((item) => item[foreignKey] === parentRow.id)
        .map((item) => Number(item.sort_order) || 0),
    ) + 1;
    const contentKey = `${parentRow.content_key}.${definition.table.split("_").at(-1)}.${crypto.randomUUID()}`;
    const newRow = {
      content_key: contentKey,
      [foreignKey]: parentRow.id,
      value: "",
      sort_order: sortOrder,
      is_published: true,
    };
    setError("");
    setNotice("");
    try {
      await createPortfolioRow(definition.table, newRow);
      await load();
      setNotice(`${definition.label} added.`);
    } catch (createError) {
      console.error(`Could not add ${definition.label}.`, createError);
      setError(`Could not add ${definition.label}: ${createError.message}`);
    }
  };

  const renderRelatedItems = (parentDefinition, parentRow) => {
    const relatedDefinitions = portfolioTables.filter(
      (definition) => definition.parentTable === parentDefinition.table,
    );
    if (!relatedDefinitions.length) return null;

    return (
      <div className="space-y-4 border-t border-slate-800 pt-4">
        {relatedDefinitions.map((definition) => {
          const items = (rows[definition.table] || [])
            .filter((item) => item[definition.parentId] === parentRow.id)
            .sort((a, b) => a.sort_order - b.sort_order);
          const itemLabel = definition.table === "portfolio_project_technologies"
            ? "Technologies"
            : definition.table === "portfolio_project_highlights"
              ? "Highlights"
              : "Responsibilities";
          return (
            <section key={definition.table} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <h5 className="text-sm font-medium text-slate-300">{itemLabel}</h5>
                <button
                  type="button"
                  onClick={() => addRelatedRow(definition, parentRow)}
                  className="rounded border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:border-emerald-500 hover:text-emerald-300"
                >
                  + Add
                </button>
              </div>
              {items.length === 0 ? (
                <p className="text-xs text-slate-500">No {itemLabel.toLowerCase()} added.</p>
              ) : (
                <div className={`space-y-2 ${definition.table === "portfolio_project_technologies" ? "sm:grid sm:grid-cols-2 sm:gap-2 sm:space-y-0" : ""}`}>
                  {items.map((item) => (
                    <div key={item.id} className="flex items-start gap-2">
                      {definition.table === "portfolio_project_technologies" ? (
                        <input
                          aria-label="Technology"
                          defaultValue={item.value}
                          onBlur={(event) => {
                            if (event.target.value !== item.value) {
                              saveField(definition.table, item.id, "value", event.target.value);
                            }
                          }}
                          className={`${inputClassName} mt-0`}
                        />
                      ) : (
                        <textarea
                          aria-label={itemLabel === "Highlights" ? "Project highlight" : "Responsibility"}
                          rows={2}
                          defaultValue={item.value}
                          onBlur={(event) => {
                            if (event.target.value !== item.value) {
                              saveField(definition.table, item.id, "value", event.target.value);
                            }
                          }}
                          className={`${inputClassName} mt-0 resize-y`}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeRow(definition, item)}
                        aria-label={`Remove ${itemLabel.slice(0, -1)}`}
                        className="mt-2 shrink-0 text-slate-500 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    );
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Edit your portfolio</h2>
        <p className="mt-1 text-sm text-slate-400">
          Choose a section, update a field, then click or tab away to save. Changes appear on your public site without a redeploy.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-[190px_minmax(0,1fr)]">
        <nav
          className="flex gap-2 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40 p-2 md:sticky md:top-5 md:flex-col md:self-start"
          aria-label="Portfolio sections"
        >
          {features.map((feature) => {
            const featureCount = feature === "Skills"
              ? rows.portfolio_skills?.length || 0
              : feature === "About"
                ? (rows.portfolio_about?.length || 0) +
                  (rows.portfolio_about_cards?.length || 0) +
                  (rows.portfolio_about_strengths?.length || 0)
                : rows[scopedTables.find((item) => item.feature === feature && !item.parentTable)?.table]?.length || 0;
            return (
              <button
                key={feature}
                type="button"
                onClick={() => {
                  setActiveFeature(feature);
                  setSearch("");
                }}
                aria-current={activeFeature === feature ? "page" : undefined}
                className={`flex shrink-0 items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors md:w-full ${
                  activeFeature === feature
                    ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-200"
                    : "border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <span className="whitespace-nowrap font-medium">{featureInfo[feature] || feature}</span>
                {!loading && (
                  <span className="min-w-6 rounded-full bg-slate-800 px-1.5 py-0.5 text-center text-xs tabular-nums text-slate-400">
                    {featureCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="min-w-0 space-y-4">
          {error && <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</p>}
          {notice && <p role="status" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">{notice}</p>}
          {loading ? (
            <p className="rounded-xl border border-slate-800 bg-slate-900/40 py-12 text-center text-slate-400">Loading portfolio content...</p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-end justify-between gap-3 border-b border-slate-800 pb-3">
                <h3 className="text-xl font-bold text-slate-100">{featureInfo[activeFeature] || activeFeature}</h3>
                <span className="text-xs text-slate-500">Changes save when you leave a field</span>
              </div>
              <label className="relative block max-w-md">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={`Find ${featureInfo[activeFeature]?.toLowerCase() || "content"}...`}
                  aria-label={`Search ${featureInfo[activeFeature] || activeFeature}`}
                  className="w-full rounded border border-slate-800 bg-slate-900/70 py-2.5 pl-9 pr-10 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-500/70"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:text-slate-200"
                  >
                    <X size={15} />
                  </button>
                )}
              </label>
          {currentTables.map((definition) => {
            const tableRows = rows[definition.table] || [];
            const displayRows = tableRows.filter((row) => {
              if (!search.trim()) return true;
              const query = search.trim().toLowerCase();
              const relatedDefinitions = portfolioTables.filter(
                (child) => child.parentTable === definition.table,
              );
              const relatedText = relatedDefinitions.flatMap((child) =>
                (rows[child.table] || [])
                  .filter((item) => item[child.parentId] === row.id)
                  .map((item) => item.value || ""),
              );
              return [...Object.values(row), ...relatedText]
                .filter((value) => typeof value === "string" || typeof value === "number")
                .some((value) => String(value).toLowerCase().includes(query));
            });
            const possibleParents = definition.parentTable
              ? parentRows[definition.parentTable] || []
              : [];
            const info = tableInfo[definition.table] || definition.label;
            const standardFields = definition.fields.filter((field) => !advancedFields.has(field));
            const optionFields = definition.fields.filter((field) => advancedFields.has(field));
            return (
              <section key={definition.table} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-slate-100">{info}</h4>
                  </div>
                  {definition.allowAdd !== false && (
                    <button
                      type="button"
                      onClick={() => addRow(definition)}
                      disabled={Boolean(definition.parentTable && possibleParents.length === 0)}
                      className="flex shrink-0 items-center gap-2 rounded border border-slate-700 px-3 py-2 font-mono text-xs text-slate-300 transition hover:border-emerald-500 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus size={16} /> Add item
                    </button>
                  )}
                </div>
                {tableRows.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-slate-700 p-4 text-sm text-slate-400">
                    Nothing here yet. Use “Add item” to create the first one.
                  </p>
                ) : displayRows.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-slate-700 p-4 text-sm text-slate-400">
                    No items match “{search}”.
                  </p>
                ) : (
                  <div className={
                    definition.table === "portfolio_projects" || definition.table === "portfolio_experience"
                      ? "grid gap-4 lg:grid-cols-2"
                      : "space-y-3"
                  }>
                  {displayRows.map((row) => {
                    const parent = definition.parentTable
                      ? possibleParents.find((item) => item.id === row[definition.parentId])
                      : null;
                    const rowTitle = parent
                      ? `${parent[definition.parentLabel] || "Untitled"} — ${
                        definition.table === "portfolio_project_technologies"
                          ? `Technology ${row.sort_order}`
                          : definition.table === "portfolio_project_highlights"
                            ? `Highlight ${row.sort_order}`
                            : `Responsibility ${row.sort_order}`
                      }`
                      : row.title || row.name || row.label || row.setting_key ||
                        row.content_key || row.category || "Content item";
                    const renderField = (field) => {
                      const value = row[field];
                      const fieldKey = `${definition.table}-${row.id}-${field}`;
                      const skillGroups = (rows.portfolio_skill_categories || [])
                        .filter((item) => item.category_key !== "__heading__")
                        .map((item) => ({ value: item.category_key, label: item.title }));
                      const choiceFields = {
                        section_id: [
                          ["home", "Home"],
                          ["about", "About"],
                          ["skills", "Skills"],
                          ["projects", "Projects"],
                          ["experience", "Experience"],
                          ["contact", "Contact"],
                        ],
                        category: skillGroups.map((item) => [item.value, item.label]),
                        platform: [
                          ["github", "GitHub"],
                          ["linkedin", "LinkedIn"],
                          ["email", "Email"],
                          ["linktree", "Linktree"],
                          ["website", "Website"],
                        ],
                        placement: [
                          ["hero", "Home page"],
                          ["footer", "Footer"],
                          ["hero,footer", "Home page and footer"],
                        ],
                      };
                      const choices = choiceFields[field];
                      if (field === "is_published") {
                        return (
                          <label key={field} className="flex items-center gap-2 text-sm text-slate-300">
                            <input
                              type="checkbox"
                              checked={Boolean(value)}
                              disabled={pending === fieldKey}
                              onChange={(event) => saveField(definition.table, row.id, field, event.target.checked)}
                            />
                            {fieldLabels[field]}
                          </label>
                        );
                      }
                      const multiline = ["field_value", "setting_value", "description", "value"].includes(field);
                      const numeric = ["sort_order", "category_order", "level"].includes(field);
                      return (
                        <label key={field} className={`block text-sm text-slate-300 ${
                          ["description", "field_value", "setting_value"].includes(field) ? "md:col-span-2" : ""
                        }`}>
                          {fieldLabelFor(definition.table, field)}
                          {choices ? (
                            <select
                              value={value ?? ""}
                              onChange={(event) => saveField(definition.table, row.id, field, event.target.value)}
                              className={inputClassName}
                            >
                              {!choices.some(([optionValue]) => optionValue === value) && (
                                <option value={value}>{readableLabel(value || "Choose an option")}</option>
                              )}
                              {choices.map(([optionValue, label]) => (
                                <option key={optionValue} value={optionValue}>{label}</option>
                              ))}
                            </select>
                          ) : multiline ? (
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
                              type={numeric ? "number" : field === "url" || field === "link" ? "url" : "text"}
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
                          {pending === fieldKey && <span className="mt-1 block font-mono text-xs text-emerald-300">Saving…</span>}
                        </label>
                      );
                    };
                    return (
                    <article key={row.id} className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4 shadow-sm shadow-black/10">
                      <h4 className="border-b border-slate-800 pb-3 text-base font-semibold text-slate-100">
                        {readableLabel(rowTitle)}
                      </h4>
                      {definition.parentTable && (
                        <label className="block text-sm text-slate-300">
                          {definition.parentTable === "portfolio_projects" ? "Belongs to project" : "Belongs to experience"}
                          <select
                            value={row[definition.parentId] || ""}
                            onChange={(event) => saveField(definition.table, row.id, definition.parentId, event.target.value)}
                            className={inputClassName}
                          >
                            {possibleParents.map((parent) => (
                              <option key={parent.id} value={parent.id}>{parent[definition.parentLabel] || "Untitled"}</option>
                            ))}
                          </select>
                        </label>
                        )}
                        <div className="grid gap-3 md:grid-cols-2">
                          {standardFields.map(renderField)}
                        </div>
                        {optionFields.length > 0 && (
                          <div className="grid gap-3 border-t border-slate-800 pt-3 md:grid-cols-2">
                            {optionFields.map(renderField)}
                          </div>
                        )}
                        {renderRelatedItems(definition, row)}
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
                    );
                  })
                  }
                  </div>
                )}
              </section>
            );
          })}
              </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PortfolioContentEditor;

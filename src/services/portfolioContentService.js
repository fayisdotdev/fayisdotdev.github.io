import { portfolioDefaults, portfolioTables } from "../data/portfolioDefaults";
import { supabase } from "../lib/supabase";

export const getDefaultPortfolioContent = () => ({
  siteSettings: structuredClone(portfolioDefaults.siteSettings),
  socialLinks: structuredClone(portfolioDefaults.socialLinks),
  navigation: structuredClone(portfolioDefaults.navigation),
  hero: structuredClone(portfolioDefaults.hero),
  heroActions: structuredClone(portfolioDefaults.heroActions),
  about: structuredClone(portfolioDefaults.about),
  aboutCards: structuredClone(portfolioDefaults.aboutCards),
  aboutStrengths: structuredClone(portfolioDefaults.aboutStrengths),
  skillCategories: structuredClone(
    portfolioDefaults.skillCategories.filter((category) => category.category_key !== "__heading__"),
  ),
  skills: structuredClone(portfolioDefaults.skills),
  projects: structuredClone(portfolioDefaults.projects),
  experience: structuredClone(portfolioDefaults.experience),
  contact: structuredClone(portfolioDefaults.contact),
  footer: structuredClone(portfolioDefaults.footer),
  seo: structuredClone(portfolioDefaults.seo),
});

const loadTable = async (table, orderColumn) => {
  let query = supabase.from(table).select("*");
  if (orderColumn) query = query.order(orderColumn, { ascending: true });
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

const fetchAllTables = async () => {
  const definitions = portfolioTables;
  const results = await Promise.all(
    definitions.map(async ({ table, fields }) => [
      table,
      await loadTable(table, fields.includes("sort_order") ? "sort_order" : undefined),
    ]),
  );
  return Object.fromEntries(results);
};

const nestedValues = (children, foreignKey, id) =>
  children.filter((item) => item[foreignKey] === id);

export const fetchPortfolioContent = async () => {
  const rows = await fetchAllTables();
  const databaseInitialized = rows.portfolio_site_settings.some(
    (item) => item.setting_key === "content_initialized" && item.setting_value === "true",
  );
  if (!databaseInitialized) return getDefaultPortfolioContent();

  const defaults = getDefaultPortfolioContent();
  const projects = rows.portfolio_projects;
  const projectTechnologies = rows.portfolio_project_technologies || [];
  const projectHighlights = rows.portfolio_project_highlights || [];
  const experience = rows.portfolio_experience;
  const responsibilities = rows.portfolio_experience_responsibilities || [];

  const resolvedProjects = projects
    .filter((item) => item.is_published !== false)
    .map((project) => {
      const tech = nestedValues(projectTechnologies, "project_id", project.id);
      const highlights = nestedValues(projectHighlights, "project_id", project.id);
      return {
        ...project,
        tech: tech.map((item) => item.value),
        highlights: highlights.map((item) => item.value),
      };
    });

  const resolvedExperience = experience
    .filter((item) => item.is_published !== false)
    .map((item) => {
      const items = nestedValues(responsibilities, "experience_id", item.id);
      return {
        ...item,
        responsibilities: items.map((responsibility) => responsibility.value),
      };
    });

  const skillRows = rows.portfolio_skills;
  const skillCategories = rows.portfolio_skill_categories;
  const visibleSkillCategories = skillCategories.filter(
    (category) => category.category_key !== "__heading__",
  );
  const groupedSkills = Object.fromEntries(
    visibleSkillCategories
      .filter((category) => category.is_published !== false)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((category) => [
        category.category_key,
        skillRows
          .filter((skill) => skill.category === category.category_key && skill.is_published !== false)
          .sort((a, b) => a.sort_order - b.sort_order)
          .map(({ id, name, level }) => ({ id, name, level })),
      ]),
  );

  const published = (tableName) =>
    (rows[tableName] || []).filter((item) => item.is_published !== false);

  const content = {
    ...defaults,
    siteSettings: published("portfolio_site_settings"),
    socialLinks: published("portfolio_social_links"),
    navigation: published("portfolio_navigation"),
    hero: published("portfolio_hero"),
    heroActions: published("portfolio_hero_actions"),
    about: published("portfolio_about"),
    aboutCards: published("portfolio_about_cards"),
    aboutStrengths: published("portfolio_about_strengths"),
    skillCategories: visibleSkillCategories.filter((item) => item.is_published !== false),
    skills: groupedSkills,
    projects: resolvedProjects,
    experience: resolvedExperience,
    contact: published("portfolio_contact_settings"),
    footer: published("portfolio_footer"),
    seo: published("portfolio_seo"),
  };

  return content;
};

const editableTables = new Set(portfolioTables.map(({ table }) => table));
const editableColumns = new Map(
  portfolioTables.map(({ table, fields, parentId }) => [
    table,
    new Set([...fields, "content_key", ...(parentId ? [parentId] : [])]),
  ]),
);

export const fetchAdminPortfolioContent = async () => {
  const rows = await fetchAllTables();
  rows.portfolio_site_settings = rows.portfolio_site_settings.filter(
    (item) => item.setting_key !== "content_initialized",
  );
  const parentTables = Object.fromEntries(
    portfolioTables
      .filter(({ parentTable }) => parentTable)
      .map(({ parentTable }) => [parentTable, rows[parentTable]]),
  );
  return { rows, parentTables };
};

export const updatePortfolioField = async (table, id, field, value) => {
  if (!editableTables.has(table) || !editableColumns.get(table)?.has(field)) {
    throw new Error(`Field ${field} cannot be edited in ${table}.`);
  }
  const { error } = await supabase.from(table).update({ [field]: value }).eq("id", id);
  if (error) throw error;
};

export const createPortfolioRow = async (table, row) => {
  if (!editableTables.has(table)) throw new Error(`Table ${table} cannot be edited.`);
  const { data, error } = await supabase.from(table).insert(row).select().single();
  if (error) throw error;
  return data;
};

export const deletePortfolioRow = async (table, id) => {
  if (!editableTables.has(table)) throw new Error(`Table ${table} cannot be edited.`);
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
};

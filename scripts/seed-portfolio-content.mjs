import { createClient } from "@supabase/supabase-js";
import { portfolioDefaults } from "../src/data/portfolioDefaults.js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running this one-time seed.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const seedMissing = async (table, records, keyColumn = "content_key") => {
  if (!records.length) return;
  const { data: existing, error: readError } = await supabase
    .from(table)
    .select(keyColumn);
  if (readError) throw new Error(`Could not read ${table}: ${readError.message}`);
  const keys = new Set((existing || []).map((row) => row[keyColumn]));
  const missing = records.filter((record) => !keys.has(record[keyColumn]));
  if (!missing.length) return;
  const { error: insertError } = await supabase.from(table).insert(missing);
  if (insertError) throw new Error(`Could not seed ${table}: ${insertError.message}`);
};

const simpleTables = [
  ["portfolio_site_settings", portfolioDefaults.siteSettings, "setting_key"],
  ["portfolio_social_links", portfolioDefaults.socialLinks],
  ["portfolio_navigation", portfolioDefaults.navigation],
  ["portfolio_hero", portfolioDefaults.hero],
  ["portfolio_hero_actions", portfolioDefaults.heroActions],
  ["portfolio_about", portfolioDefaults.about],
  ["portfolio_about_cards", portfolioDefaults.aboutCards],
  ["portfolio_about_strengths", portfolioDefaults.aboutStrengths],
  ["portfolio_skill_categories", portfolioDefaults.skillCategories],
  ["portfolio_skills", portfolioDefaults.skills],
  ["portfolio_contact_settings", portfolioDefaults.contact, "setting_key"],
  ["portfolio_footer", portfolioDefaults.footer, "setting_key"],
  ["portfolio_seo", portfolioDefaults.seo, "setting_key"],
];

for (const [table, records, keyColumn] of simpleTables) {
  await seedMissing(table, records, keyColumn);
}

const projects = portfolioDefaults.projects.map(({ tech, highlights, ...project }) => project);
await seedMissing("portfolio_projects", projects);
const { data: projectRows, error: projectLoadError } = await supabase
  .from("portfolio_projects")
  .select("id,content_key");
if (projectLoadError) throw new Error(`Could not load project IDs: ${projectLoadError.message}`);
const projectIds = new Map(projectRows.map((project) => [project.content_key, project.id]));
const technologies = portfolioDefaults.projects.flatMap((project) =>
  project.tech.map((value, index) => ({
    project_id: projectIds.get(project.content_key),
    content_key: `${project.content_key}.tech.${index + 1}`,
    value,
    sort_order: index + 1,
    is_published: true,
  })),
);
const highlights = portfolioDefaults.projects.flatMap((project) =>
  project.highlights.map((value, index) => ({
    project_id: projectIds.get(project.content_key),
    content_key: `${project.content_key}.highlight.${index + 1}`,
    value,
    sort_order: index + 1,
    is_published: true,
  })),
);
await seedMissing("portfolio_project_technologies", technologies);
await seedMissing("portfolio_project_highlights", highlights);

const experience = portfolioDefaults.experience.map(({ responsibilities, ...item }) => item);
await seedMissing("portfolio_experience", experience);
const { data: experienceRows, error: experienceLoadError } = await supabase
  .from("portfolio_experience")
  .select("id,content_key");
if (experienceLoadError) {
  throw new Error(`Could not load experience IDs: ${experienceLoadError.message}`);
}
const experienceIds = new Map(experienceRows.map((item) => [item.content_key, item.id]));
const responsibilities = portfolioDefaults.experience.flatMap((item) =>
  item.responsibilities.map((value, index) => ({
    experience_id: experienceIds.get(item.content_key),
    content_key: `${item.content_key}.responsibility.${index + 1}`,
    value,
    sort_order: index + 1,
    is_published: true,
  })),
);
await seedMissing("portfolio_experience_responsibilities", responsibilities);

console.info("Portfolio content seed completed; pre-existing field values were left unchanged.");

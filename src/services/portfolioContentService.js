import { Brain, Code, Database, Smartphone } from "lucide-react";
import { experience } from "../data/experience";
import { projects } from "../data/projects";
import { skills } from "../data/skills";
import { supabase } from "../lib/supabase";

const iconNames = new Map([
  [Brain, "Brain"],
  [Code, "Code"],
  [Database, "Database"],
  [Smartphone, "Smartphone"],
]);

const defaultContent = {
  projects: projects.map(({ icon, ...project }) => ({
    ...project,
    icon: iconNames.get(icon) || "Code",
  })),
  experience,
  skills,
};

export const getDefaultPortfolioContent = () =>
  JSON.parse(JSON.stringify(defaultContent));

const throwIfError = ({ error }) => {
  if (error) throw error;
};

export const fetchPortfolioContent = async () => {
  const [stateResult, projectsResult, experienceResult, skillsResult] =
    await Promise.all([
      supabase
        .from("portfolio_content_state")
        .select("initialized")
        .eq("id", "main")
        .maybeSingle(),
      supabase.from("portfolio_projects").select("*").order("sort_order"),
      supabase
        .from("portfolio_experience")
        .select("*")
        .order("sort_order"),
      supabase
        .from("portfolio_skills")
        .select("*")
        .order("category_order")
        .order("sort_order"),
    ]);

  [stateResult, projectsResult, experienceResult, skillsResult].forEach(
    throwIfError,
  );

  if (!stateResult.data?.initialized) return getDefaultPortfolioContent();

  const groupedSkills = skillsResult.data.reduce((groups, skill) => {
    groups[skill.category] ??= [];
    groups[skill.category].push({
      id: skill.id,
      name: skill.name,
      level: skill.level,
    });
    return groups;
  }, {});

  return {
    projects: projectsResult.data,
    experience: experienceResult.data,
    skills: groupedSkills,
  };
};

const syncRows = async (table, rows, toDatabaseRow) => {
  const { data: existingRows, error: loadError } = await supabase
    .from(table)
    .select("id");
  if (loadError) throw loadError;

  const records = rows.map(toDatabaseRow);
  const existingIds = new Set(existingRows.map((row) => row.id));
  const recordsWithIds = records.filter((row) => existingIds.has(row.id));
  const newRecords = records.filter((row) => !existingIds.has(row.id));

  if (recordsWithIds.length > 0) {
    const { error } = await supabase.from(table).upsert(recordsWithIds);
    if (error) throw error;
  }

  if (newRecords.length > 0) {
    const { error } = await supabase.from(table).insert(newRecords);
    if (error) throw error;
  }

  const retainedIds = new Set(
    recordsWithIds.map((row) => row.id).filter(Boolean),
  );
  const removedIds = [...existingIds].filter((id) => !retainedIds.has(id));

  if (removedIds.length > 0) {
    const { error } = await supabase.from(table).delete().in("id", removedIds);
    if (error) throw error;
  }
};

export const savePortfolioContent = async (content) => {
  await syncRows("portfolio_projects", content.projects, (project, index) => ({
    ...(project.id ? { id: project.id } : {}),
    title: project.title || "",
    role: project.role || "",
    period: project.period || "",
    description: project.description || "",
    tech: project.tech || [],
    highlights: project.highlights || [],
    link: project.link || "",
    icon: project.icon || "Code",
    sort_order: index,
  }));

  await syncRows(
    "portfolio_experience",
    content.experience,
    (item, index) => ({
      ...(item.id ? { id: item.id } : {}),
      title: item.title || "",
      company: item.company || "",
      location: item.location || "",
      period: item.period || "",
      responsibilities: item.responsibilities || [],
      link: item.link || "",
      sort_order: index,
    }),
  );

  const skills = Object.entries(content.skills).flatMap(
    ([category, items], categoryIndex) =>
      items.map((skill, index) => ({
        ...(skill.id ? { id: skill.id } : {}),
        category,
        category_order: categoryIndex,
        name: skill.name || "",
        level: skill.level,
        sort_order: index,
      })),
  );
  await syncRows("portfolio_skills", skills, (skill) => skill);

  const { error } = await supabase
    .from("portfolio_content_state")
    .update({ initialized: true, updated_at: new Date().toISOString() })
    .eq("id", "main");

  if (error) throw error;

  return fetchPortfolioContent();
};
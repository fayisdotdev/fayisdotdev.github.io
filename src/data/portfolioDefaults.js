import { experience } from "./experience.js";
import { projects } from "./projects.js";
import { skills } from "./skills.js";

const projectIcons = new Map([
  ["Brain", "Brain"],
  ["Code", "Code"],
  ["Database", "Database"],
  ["Smartphone", "Smartphone"],
]);

const defaultProjects = projects.map(({ icon, ...project }) => ({
  ...project,
  icon: projectIcons.get(icon) || "Code",
}));

export const portfolioDefaults = {
  siteSettings: [
    { setting_key: "brand_name", setting_value: "Fayisdotdev" },
    { setting_key: "skills_heading", setting_value: "Skills & Technologies" },
    { setting_key: "projects_heading", setting_value: "Featured Projects" },
    { setting_key: "experience_heading", setting_value: "Experience" },
    { setting_key: "back_to_top_label", setting_value: "Back to top" },
  ],
  socialLinks: [
    { content_key: "github", platform: "github", label: "GitHub", url: "https://github.com/fayisdotdev", placement: "hero,footer", sort_order: 1 },
    { content_key: "linkedin", platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com/in/fayisdotdev", placement: "hero,footer", sort_order: 2 },
    { content_key: "linktree", platform: "linktree", label: "Linktree", url: "https://linktr.ee/fayisdotdev", placement: "footer", sort_order: 3 },
    { content_key: "email", platform: "email", label: "Email", url: "mailto:muhammadfayiskmofficial@gmail.com", placement: "hero,footer", sort_order: 4 },
  ],
  navigation: [
    ["home", "Home"], ["about", "About"], ["skills", "Skills"],
    ["projects", "Projects"], ["experience", "Experience"], ["contact", "Contact"],
  ].map(([section_id, label], index) => ({
    content_key: section_id, section_id, label, sort_order: index + 1, is_published: true,
  })),
  hero: [
    ["greeting", "Hello, I'm"],
    ["name", "Muhammad Fayis"],
    ["role", "Software Developer × Data Analyst"],
    ["tagline", "Building high-performance mobile and web applications with Flutter and Raact and deriving actionable insights from complex datasets using Python, Power BI, and ML"],
  ].map(([content_key, field_value]) => ({ content_key, field_value, is_published: true })),
  heroActions: [
    { content_key: "projects", label: "View Projects", section_id: "projects", sort_order: 1, is_published: true },
    { content_key: "contact", label: "Get In Touch", section_id: "contact", sort_order: 2, is_published: true },
  ],
  about: [
    ["heading", "About Me"],
    ["paragraph_1", "A versatile Software Developer & Data Analyst with 1.5+ years of experience in delivering high-performance mobile applications and deriving actionable insights from complex datasets."],
    ["paragraph_2", "Skilled in Flutter, Firebase, React, Vite, Supabase, Clean Architecture, and Python, SQL, Excel, Power BI, Machine Learning. Experienced in building scalable apps across CRM, service booking, and automotive domains."],
    ["paragraph_3", "Strong ability to deliver end-to-end solutions, create dashboards and reports, collaborate in Agile teams, and ship production-ready features under tight deadlines."],
  ].map(([content_key, field_value], index) => ({ content_key, field_value, sort_order: index + 1, is_published: true })),
  aboutCards: [
    { content_key: "software-development", title: "Software Development", description: "Cross-platform mobile and web apps", icon: "Code", sort_order: 1 },
    { content_key: "data-analysis", title: "Data Analysis", description: "Python, Power BI, SQL", icon: "BarChart3", sort_order: 2 },
    { content_key: "machine-learning", title: "Machine Learning", description: "Predictive models, ML", icon: "Brain", sort_order: 3 },
    { content_key: "backend-cloud", title: "Backend & Cloud", description: "Firebase, Supabase, APIs", icon: "Database", sort_order: 4 },
  ].map((item) => ({ ...item, is_published: true })),
  aboutStrengths: [
    ["analytical-thinking", "Analytical Thinking"],
    ["problem-solving", "Problem Solving"],
    ["team-collaboration", "Team Collaboration"],
    ["agile-scrum", "Agile/Scrum"],
    ["communication", "Communication"],
    ["adaptability", "Adaptability"],
  ].map(([content_key, label], index) => ({
    content_key, label, sort_order: index + 1, is_published: true,
  })),
  skillCategories: [
    { content_key: "skills-heading", category_key: "__heading__", title: "Skills & Technologies", icon: "Code", gradient: "from-cyan-500 to-emerald-500", sort_order: 0 },
    { content_key: "languages", category_key: "languages", title: "Programming Languages", icon: "Code", gradient: "from-cyan-500 to-emerald-500", sort_order: 1 },
    { content_key: "frameworks", category_key: "frameworks", title: "Frameworks & Backend", icon: "Smartphone", gradient: "from-emerald-500 to-cyan-500", sort_order: 2 },
    { content_key: "state-management", category_key: "stateManagement", title: "State Management", icon: "Database", gradient: "from-blue-500 to-cyan-500", sort_order: 3 },
    { content_key: "data-analysis", category_key: "dataAnalysis", title: "Data Analysis & ML", icon: "BarChart3", gradient: "from-purple-500 to-pink-500", sort_order: 4 },
  ].map((item) => ({ ...item, is_published: true })),
  skills: Object.entries(skills).flatMap(([category, list], categoryIndex) =>
    list.map((skill, index) => ({
      content_key: {
        Dart: "language-dart",
        Python: category === "languages" ? "language-python" : "analysis-python",
        SQL: "language-sql",
        JavaScript: "language-javascript",
        Flutter: "framework-flutter",
        Firebase: "framework-firebase",
        Supabase: "framework-supabase",
        FastAPI: "framework-fastapi",
        "BLoC": "state-bloc",
        GetX: "state-getx",
        Provider: "state-provider",
        "Power BI": "analysis-power-bi",
        Pandas: "analysis-pandas",
        Excel: "analysis-excel",
        "scikit-learn": "analysis-scikit-learn",
      }[skill.name] || `skill-${category}-${index + 1}`,
      category,
      category_order: categoryIndex + 1,
      name: skill.name,
      level: skill.level,
      sort_order: index + 1,
      is_published: true,
    })),
  ),
  projects: defaultProjects.map((project, index) => ({
    ...project,
    content_key: [
      "az-education", "onbook-crm", "dementia-prediction", "wheel-base",
      "broomie", "edvoc", "madrasaapp", "petcare",
    ][index],
    sort_order: index + 1,
    is_published: true,
  })),
  experience: experience.map((item, index) => ({
    ...item,
    content_key: ["freelance-developer", "popular-auto-developer", "cybacor-data-analyst", "grapesgenix-intern"][index],
    sort_order: index + 1,
    is_published: true,
  })),
  contact: [
    ["heading", "Let's Work Together"],
    ["intro", "Currently open to new opportunities and exciting projects"],
    ["email_label", "Email"],
    ["email", "muhammadfayiskmofficial@gmail.com"],
    ["name_placeholder", "Your Name"],
    ["email_placeholder", "Your Email"],
    ["phone_placeholder", "Your whatsapp number. (Optional)"],
    ["message_placeholder", "Your Message"],
    ["phone_validation", "Please provide either email or phone number."],
    ["submit_label", "Send Message"],
    ["submitting_label", "Sending..."],
    ["success_message", "Message sent successfully! I'll get back to you soon."],
    ["configuration_error", "Configuration error. Please check Supabase credentials."],
    ["send_error", "Failed to send message. Please try again."],
  ].map(([setting_key, setting_value]) => ({ setting_key, setting_value, is_published: true })),
  footer: [
    { setting_key: "copyright_prefix", setting_value: "© 2024 to " },
    { setting_key: "copyright_owner", setting_value: " Muhammad Fayis K M." },
  ].map((item) => ({ ...item, is_published: true })),
  seo: [
    ["document_title", "Fayisdotdev"],
    ["language", "en"],
    ["favicon_path", "/vite.svg"],
    ["description", ""],
    ["canonical_url", ""],
    ["og_title", ""],
    ["og_description", ""],
  ].map(([setting_key, setting_value]) => ({ setting_key, setting_value, is_published: true })),
};

export const portfolioTables = [
  { feature: "Site settings", table: "portfolio_site_settings", label: "Site settings", defaults: portfolioDefaults.siteSettings, fields: ["setting_value"], allowAdd: false, allowDelete: false },
  { feature: "Site settings", table: "portfolio_social_links", label: "Social links", defaults: portfolioDefaults.socialLinks, fields: ["platform", "label", "url", "placement", "sort_order", "is_published"] },
  { feature: "Navigation", table: "portfolio_navigation", label: "Navigation items", defaults: portfolioDefaults.navigation, fields: ["label", "section_id", "sort_order", "is_published"] },
  { feature: "Hero", table: "portfolio_hero", label: "Hero fields", defaults: portfolioDefaults.hero, fields: ["field_value", "is_published"] },
  { feature: "Hero", table: "portfolio_hero_actions", label: "Hero actions", defaults: portfolioDefaults.heroActions, fields: ["label", "section_id", "sort_order", "is_published"] },
  { feature: "About", table: "portfolio_about", label: "About fields", defaults: portfolioDefaults.about, fields: ["field_value", "sort_order", "is_published"] },
  { feature: "About", table: "portfolio_about_cards", label: "About cards", defaults: portfolioDefaults.aboutCards, fields: ["title", "description", "icon", "sort_order", "is_published"] },
  { feature: "About", table: "portfolio_about_strengths", label: "Strengths", defaults: portfolioDefaults.aboutStrengths, fields: ["label", "sort_order", "is_published"] },
  { feature: "Skills", table: "portfolio_skill_categories", label: "Skill categories", defaults: portfolioDefaults.skillCategories, fields: ["title", "icon", "gradient", "sort_order", "is_published"] },
  { feature: "Skills", table: "portfolio_skills", label: "Skills", defaults: portfolioDefaults.skills, fields: ["name", "level", "category", "category_order", "sort_order", "is_published"] },
  { feature: "Projects", table: "portfolio_projects", label: "Projects", defaults: portfolioDefaults.projects, fields: ["title", "role", "period", "description", "link", "icon", "sort_order", "is_published"] },
  { feature: "Projects", table: "portfolio_project_technologies", label: "Project technologies", defaults: [], parentTable: "portfolio_projects", parentId: "project_id", parentLabel: "title", fields: ["value", "sort_order", "is_published"] },
  { feature: "Projects", table: "portfolio_project_highlights", label: "Project highlights", defaults: [], parentTable: "portfolio_projects", parentId: "project_id", parentLabel: "title", fields: ["value", "sort_order", "is_published"] },
  { feature: "Experience", table: "portfolio_experience", label: "Experience", defaults: portfolioDefaults.experience, fields: ["title", "company", "location", "period", "link", "sort_order", "is_published"] },
  { feature: "Experience", table: "portfolio_experience_responsibilities", label: "Responsibilities", defaults: [], parentTable: "portfolio_experience", parentId: "experience_id", parentLabel: "title", fields: ["value", "sort_order", "is_published"] },
  { feature: "Contact", table: "portfolio_contact_settings", label: "Contact copy and form labels", defaults: portfolioDefaults.contact, fields: ["setting_value", "is_published"], allowAdd: false, allowDelete: false },
  { feature: "Footer", table: "portfolio_footer", label: "Footer settings", defaults: portfolioDefaults.footer, fields: ["setting_value", "is_published"], allowAdd: false, allowDelete: false },
  { feature: "SEO", table: "portfolio_seo", label: "SEO metadata", defaults: portfolioDefaults.seo, fields: ["setting_value", "is_published"], allowAdd: false, allowDelete: false },
];

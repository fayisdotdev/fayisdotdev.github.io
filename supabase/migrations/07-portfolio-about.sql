/*
Feature: About section
Purpose: Store heading, paragraphs, feature cards, and strength chips as
         independently editable rows and fields.
Depends on: 02-portfolio-admin.sql; 03-portfolio-change-history.sql.
*/
create table if not exists public.portfolio_about (
  id uuid primary key default gen_random_uuid(),
  content_key text not null unique,
  field_value text not null default '',
  sort_order integer not null default 0,
  is_published boolean not null default true,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);
create table if not exists public.portfolio_about_cards (
  id uuid primary key default gen_random_uuid(),
  content_key text not null unique,
  title text not null default '',
  description text not null default '',
  icon text not null default 'Code',
  sort_order integer not null default 0,
  is_published boolean not null default true,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);
create table if not exists public.portfolio_about_strengths (
  id uuid primary key default gen_random_uuid(),
  content_key text not null unique,
  label text not null default '',
  sort_order integer not null default 0,
  is_published boolean not null default true,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);
do $$
declare t text;
begin
  foreach t in array array['portfolio_about','portfolio_about_cards','portfolio_about_strengths'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "Public reads published %1$s" on public.%1$I', t);
    execute format('create policy "Public reads published %1$s" on public.%1$I for select to anon, authenticated using (is_published)', t);
    execute format('drop policy if exists "Admins manage %1$s" on public.%1$I', t);
    execute format('create policy "Admins manage %1$s" on public.%1$I for all to authenticated using (public.portfolio_current_role() in (''admin'',''super_admin'')) with check (public.portfolio_current_role() in (''admin'',''super_admin''))', t);
    execute format('drop trigger if exists portfolio_set_updated_at on public.%I', t);
    execute format('create trigger portfolio_set_updated_at before insert or update on public.%I for each row execute function public.portfolio_set_updated_at()', t);
    execute format('drop trigger if exists portfolio_log_change on public.%I', t);
    execute format('create trigger portfolio_log_change after insert or update or delete on public.%I for each row execute function public.portfolio_log_change()', t);
  end loop;
end
$$;
grant select on public.portfolio_about, public.portfolio_about_cards, public.portfolio_about_strengths to anon, authenticated;
grant insert, update, delete on public.portfolio_about, public.portfolio_about_cards, public.portfolio_about_strengths to authenticated;
insert into public.portfolio_about (content_key,field_value,sort_order) values
  ('heading','About Me',1),
  ('paragraph_1','A versatile Software Developer & Data Analyst with 1.5+ years of experience in delivering high-performance mobile applications and deriving actionable insights from complex datasets.',2),
  ('paragraph_2','Skilled in Flutter, Firebase, React, Vite, Supabase, Clean Architecture, and Python, SQL, Excel, Power BI, Machine Learning. Experienced in building scalable apps across CRM, service booking, and automotive domains.',3),
  ('paragraph_3','Strong ability to deliver end-to-end solutions, create dashboards and reports, collaborate in Agile teams, and ship production-ready features under tight deadlines.',4)
on conflict (content_key) do nothing;
insert into public.portfolio_about_cards (content_key,title,description,icon,sort_order) values
  ('software-development','Software Development','Cross-platform mobile and web apps','Code',1),
  ('data-analysis','Data Analysis','Python, Power BI, SQL','BarChart3',2),
  ('machine-learning','Machine Learning','Predictive models, ML','Brain',3),
  ('backend-cloud','Backend & Cloud','Firebase, Supabase, APIs','Database',4)
on conflict (content_key) do nothing;
insert into public.portfolio_about_strengths (content_key,label,sort_order) values
  ('analytical-thinking','Analytical Thinking',1),('problem-solving','Problem Solving',2),
  ('team-collaboration','Team Collaboration',3),('agile-scrum','Agile/Scrum',4),
  ('communication','Communication',5),('adaptability','Adaptability',6)
on conflict (content_key) do nothing;
-- Verification: select count(*) from public.portfolio_about;

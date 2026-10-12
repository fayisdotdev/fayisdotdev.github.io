/*
Feature: Skills and skill categories
Purpose: Keep category presentation and each skill name, level, and order
         independently editable.
Depends on: 02-portfolio-admin.sql; 03-portfolio-change-history.sql.
*/
create table if not exists public.portfolio_skill_categories (
  id uuid primary key default gen_random_uuid(),
  content_key text not null unique,
  category_key text not null unique,
  title text not null default '',
  icon text not null default 'Code',
  gradient text not null default 'from-cyan-500 to-emerald-500',
  sort_order integer not null default 0,
  is_published boolean not null default true,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);
create table if not exists public.portfolio_skills (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  category_order integer not null default 0,
  name text not null default '',
  level integer not null default 50 check (level between 0 and 100),
  sort_order integer not null default 0,
  content_key text,
  is_published boolean not null default true,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);
alter table public.portfolio_skills add column if not exists content_key text;
alter table public.portfolio_skills add column if not exists is_published boolean not null default true;
alter table public.portfolio_skills add column if not exists updated_by uuid references auth.users(id);
alter table public.portfolio_skills add column if not exists updated_at timestamptz not null default now();
create unique index if not exists portfolio_skills_content_key_idx on public.portfolio_skills(content_key) where content_key is not null;
update public.portfolio_skills
set content_key = case
  when category='languages' and name='Dart' then 'language-dart'
  when category='languages' and name='Python' then 'language-python'
  when category='languages' and name='SQL' then 'language-sql'
  when category='languages' and name='JavaScript' then 'language-javascript'
  when category='frameworks' and name='Flutter' then 'framework-flutter'
  when category='frameworks' and name='Firebase' then 'framework-firebase'
  when category='frameworks' and name='Supabase' then 'framework-supabase'
  when category='frameworks' and name='FastAPI' then 'framework-fastapi'
  when category='stateManagement' and name='BLoC' then 'state-bloc'
  when category='stateManagement' and name='GetX' then 'state-getx'
  when category='stateManagement' and name='Provider' then 'state-provider'
  when category='dataAnalysis' and name='Power BI' then 'analysis-power-bi'
  when category='dataAnalysis' and name='Pandas' then 'analysis-pandas'
  when category='dataAnalysis' and name='Excel' then 'analysis-excel'
  when category='dataAnalysis' and name='scikit-learn' then 'analysis-scikit-learn'
  else 'legacy-skill-' || id::text
end
where content_key is null;
do $$
declare t text;
begin
  foreach t in array array['portfolio_skill_categories','portfolio_skills'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "Public can read %1$s" on public.%1$I', t);
    execute format('drop policy if exists "Admins can manage %1$s" on public.%1$I', t);
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
grant select on public.portfolio_skill_categories, public.portfolio_skills to anon, authenticated;
grant insert, update, delete on public.portfolio_skill_categories, public.portfolio_skills to authenticated;
insert into public.portfolio_skill_categories (content_key,category_key,title,icon,gradient,sort_order) values
  ('skills-heading','__heading__','Skills & Technologies','Code','from-cyan-500 to-emerald-500',0),
  ('languages','languages','Programming Languages','Code','from-cyan-500 to-emerald-500',1),
  ('frameworks','frameworks','Frameworks & Backend','Smartphone','from-emerald-500 to-cyan-500',2),
  ('state-management','stateManagement','State Management','Database','from-blue-500 to-cyan-500',3),
  ('data-analysis','dataAnalysis','Data Analysis & ML','BarChart3','from-purple-500 to-pink-500',4),
  ('devops','devops','DevOps & Tools','Brain','from-orange-500 to-red-500',5)
on conflict (content_key) do nothing;
insert into public.portfolio_skills (content_key,category,category_order,name,level,sort_order) values
  ('language-dart','languages',1,'Dart',90,1),('language-python','languages',1,'Python',95,2),
  ('language-sql','languages',1,'SQL',80,3),('language-javascript','languages',1,'JavaScript',85,4),
  ('framework-flutter','frameworks',2,'Flutter',92,1),('framework-firebase','frameworks',2,'Firebase',88,2),
  ('framework-supabase','frameworks',2,'Supabase',80,3),('framework-fastapi','frameworks',2,'FastAPI',75,4),
  ('state-bloc','stateManagement',3,'BLoC',85,1),('state-getx','stateManagement',3,'GetX',88,2),
  ('state-provider','stateManagement',3,'Provider',90,3),('analysis-power-bi','dataAnalysis',4,'Power BI',80,1),
  ('analysis-pandas','dataAnalysis',4,'Pandas',82,2),('analysis-excel','dataAnalysis',4,'Excel',85,3),
  ('analysis-scikit-learn','dataAnalysis',4,'scikit-learn',75,4)
on conflict (content_key) where content_key is not null do nothing;
-- Verification: select count(*) from public.portfolio_skills;

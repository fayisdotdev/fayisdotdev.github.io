/*
Feature: Portfolio projects
Purpose: Store project fields separately and normalize technologies/highlights
         into independently editable child rows.
Depends on: 02-portfolio-admin.sql; 03-portfolio-change-history.sql.
*/
create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null default '', role text not null default '',
  period text not null default '', description text not null default '',
  link text not null default '', icon text not null default 'Code',
  sort_order integer not null default 0, content_key text,
  is_published boolean not null default true,
  updated_by uuid references auth.users(id), updated_at timestamptz not null default now()
);
alter table public.portfolio_projects add column if not exists content_key text;
alter table public.portfolio_projects add column if not exists is_published boolean not null default true;
alter table public.portfolio_projects add column if not exists updated_by uuid references auth.users(id);
alter table public.portfolio_projects add column if not exists updated_at timestamptz not null default now();
create unique index if not exists portfolio_projects_content_key_idx on public.portfolio_projects(content_key) where content_key is not null;
create table if not exists public.portfolio_project_technologies (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.portfolio_projects(id) on delete cascade,
  content_key text not null unique, value text not null default '',
  sort_order integer not null default 0, is_published boolean not null default true,
  updated_by uuid references auth.users(id), updated_at timestamptz not null default now()
);
create table if not exists public.portfolio_project_highlights (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.portfolio_projects(id) on delete cascade,
  content_key text not null unique, value text not null default '',
  sort_order integer not null default 0, is_published boolean not null default true,
  updated_by uuid references auth.users(id), updated_at timestamptz not null default now()
);
update public.portfolio_projects set content_key = case title
  when 'AZ Education – Institutional App' then 'az-education'
  when 'OnBook Solutions – CRM Platform' then 'onbook-crm'
  when 'Dementia Prediction System' then 'dementia-prediction'
  when 'Wheel Base – Vehicle Collection' then 'wheel-base'
  when 'Broomie – Service Booking' then 'broomie'
  when 'Edvoc – Staff Details Interface' then 'edvoc'
  when 'MadrasaApp – Tasbih Page' then 'madrasaapp'
  when 'PetCare App' then 'petcare'
  else coalesce(content_key, regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g') || '-' || id::text) end
where content_key is null;
do $$
declare t text;
begin
  foreach t in array array['portfolio_projects','portfolio_project_technologies','portfolio_project_highlights'] loop
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
grant select on public.portfolio_projects, public.portfolio_project_technologies, public.portfolio_project_highlights to anon, authenticated;
grant insert, update, delete on public.portfolio_projects, public.portfolio_project_technologies, public.portfolio_project_highlights to authenticated;
insert into public.portfolio_projects (content_key,title,role,period,description,link,icon,sort_order) values
  ('az-education','AZ Education – Institutional App','Flutter Developer','2025 - Present','Institutional app organizing YouTube video classes with real-time sync.','','Smartphone',1),
  ('onbook-crm','OnBook Solutions – CRM Platform','Full-Stack Flutter & React Developer','2025','Enterprise CRM with web and mobile interfaces, real-time dashboards, role-based access, and comprehensive lead management system.','https://onbook.cloud/','Database',2),
  ('dementia-prediction','Dementia Prediction System','ML Developer & Data Analyst','2024 - 2025','Machine learning model predicting dementia risk using lifestyle, demographic, and health data.','','Brain',3),
  ('wheel-base','Wheel Base – Vehicle Collection','Flutter Developer','2025','Vehicle management app with record-keeping and cross-device syncing.','','Code',4),
  ('broomie','Broomie – Service Booking','Flutter Developer','2025','Cleaning services management app with booking system, recurring services, and feedback mechanisms.','','Smartphone',5),
  ('edvoc','Edvoc – Staff Details Interface','Flutter Developer','2024','Built a Flutter app to retrieve and display staff details from a custom REST API. Implemented custom state management for optimized UI performance.','','Smartphone',6),
  ('madrasaapp','MadrasaApp – Tasbih Page','Flutter Developer','2024','Developed a digital Tasbih (prayer counter) page for a Madrasa app with focus on simplicity, usability, and smooth interaction.','','Smartphone',7),
  ('petcare','PetCare App','Flutter Developer','Academic Project','Developed a pet care management mobile app with scheduling, tracking, and community features as part of BCA coursework to apply real-world Flutter development concepts.','','Smartphone',8)
on conflict (content_key) where content_key is not null do nothing;
-- Migrate existing array fields before dropping them so prior admin content survives.
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='portfolio_projects' and column_name='tech') then
    insert into public.portfolio_project_technologies (project_id,content_key,value,sort_order)
    select p.id, p.content_key || '.tech.' || item.ordinal, item.value, item.ordinal::integer
    from public.portfolio_projects p
    cross join lateral unnest(p.tech) with ordinality item(value,ordinal)
    where p.content_key is not null
    on conflict (content_key) do nothing;
    alter table public.portfolio_projects drop column tech;
  end if;
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='portfolio_projects' and column_name='highlights') then
    insert into public.portfolio_project_highlights (project_id,content_key,value,sort_order)
    select p.id, p.content_key || '.highlight.' || item.ordinal, item.value, item.ordinal::integer
    from public.portfolio_projects p
    cross join lateral unnest(p.highlights) with ordinality item(value,ordinal)
    where p.content_key is not null
    on conflict (content_key) do nothing;
    alter table public.portfolio_projects drop column highlights;
  end if;
end
$$;
drop policy if exists "Public reads published portfolio_project_technologies" on public.portfolio_project_technologies;
create policy "Public reads published portfolio_project_technologies"
  on public.portfolio_project_technologies for select to anon, authenticated
  using (is_published and exists (
    select 1 from public.portfolio_projects p
    where p.id = project_id and p.is_published
  ));
drop policy if exists "Public reads published portfolio_project_highlights" on public.portfolio_project_highlights;
create policy "Public reads published portfolio_project_highlights"
  on public.portfolio_project_highlights for select to anon, authenticated
  using (is_published and exists (
    select 1 from public.portfolio_projects p
    where p.id = project_id and p.is_published
  ));
insert into public.portfolio_project_technologies (project_id,content_key,value,sort_order)
select p.id, p.content_key || '.tech.' || x.n, x.value, x.n
from public.portfolio_projects p
cross join lateral (values
  (1,'Flutter'),(2,'Supabase'),(3,'Provider')
) x(n,value) where p.content_key='az-education'
on conflict (content_key) where content_key is not null do nothing;
insert into public.portfolio_project_technologies (project_id,content_key,value,sort_order)
select p.id, p.content_key || '.tech.' || x.n, x.value, x.n from public.portfolio_projects p
cross join lateral (values (1,'Flutter'),(2,'Firebase'),(3,'FastAPI'),(4,'Node.js'),(5,'AWS'),(6,'BLoC')) x(n,value)
where p.content_key='onbook-crm' on conflict (content_key) do nothing;
insert into public.portfolio_project_technologies (project_id,content_key,value,sort_order)
select p.id,p.content_key || '.tech.' || x.n,x.value,x.n from public.portfolio_projects p
cross join lateral (values (1,'Python'),(2,'scikit-learn'),(3,'Pandas'),(4,'MySQL')) x(n,value)
where p.content_key='dementia-prediction' on conflict (content_key) do nothing;
insert into public.portfolio_project_technologies (project_id,content_key,value,sort_order)
select p.id,p.content_key || '.tech.' || x.n,x.value,x.n from public.portfolio_projects p
cross join lateral (values (1,'Flutter'),(2,'Supabase'),(3,'Provider')) x(n,value)
where p.content_key='wheel-base' on conflict (content_key) do nothing;
insert into public.portfolio_project_technologies (project_id,content_key,value,sort_order)
select p.id,p.content_key || '.tech.' || x.n,x.value,x.n from public.portfolio_projects p
cross join lateral (values (1,'Flutter'),(2,'Firebase'),(3,'GetX')) x(n,value)
where p.content_key='broomie' on conflict (content_key) do nothing;
insert into public.portfolio_project_technologies (project_id,content_key,value,sort_order)
select p.id,p.content_key || '.tech.' || x.n,x.value,x.n from public.portfolio_projects p
cross join lateral (values (1,'Flutter'),(2,'REST API'),(3,'State Management'),(4,'UI/UX')) x(n,value)
where p.content_key='edvoc' on conflict (content_key) do nothing;
insert into public.portfolio_project_technologies (project_id,content_key,value,sort_order)
select p.id,p.content_key || '.tech.' || x.n,x.value,x.n from public.portfolio_projects p
cross join lateral (values (1,'Flutter'),(2,'setState'),(3,'Mobile'),(4,'UI/UX')) x(n,value)
where p.content_key='madrasaapp' on conflict (content_key) do nothing;
insert into public.portfolio_project_technologies (project_id,content_key,value,sort_order)
select p.id,p.content_key || '.tech.' || x.n,x.value,x.n from public.portfolio_projects p
cross join lateral (values (1,'Flutter'),(2,'Dart'),(3,'Firebase'),(4,'Mobile')) x(n,value)
where p.content_key='petcare' on conflict (content_key) do nothing;
insert into public.portfolio_project_highlights (project_id,content_key,value,sort_order)
select p.id,p.content_key || '.highlight.' || x.n,x.value,x.n from public.portfolio_projects p
cross join lateral (values (1,'Efficient content loading'),(2,'Real-time synchronization'),(3,'Scalable architecture')) x(n,value)
where p.content_key='az-education' on conflict (content_key) do nothing;
insert into public.portfolio_project_highlights (project_id,content_key,value,sort_order)
select p.id,p.content_key || '.highlight.' || x.n,x.value,x.n from public.portfolio_projects p
cross join lateral (values (1,'Real-time dashboards with Firebase Streams'),(2,'Clean Architecture for scalability'),(3,'Role-based access control'),(4,'Multi-layer structure (data, domain, presentation)')) x(n,value)
where p.content_key='onbook-crm' on conflict (content_key) do nothing;
insert into public.portfolio_project_highlights (project_id,content_key,value,sort_order)
select p.id,p.content_key || '.highlight.' || x.n,x.value,x.n from public.portfolio_projects p
cross join lateral (values (1,'Multiple ML models with ROC-AUC evaluation'),(2,'Feature importance analysis'),(3,'Data preprocessing pipeline')) x(n,value)
where p.content_key='dementia-prediction' on conflict (content_key) do nothing;
insert into public.portfolio_project_highlights (project_id,content_key,value,sort_order)
select p.id,p.content_key || '.highlight.' || x.n,x.value,x.n from public.portfolio_projects p
cross join lateral (values (1,'Secure authentication'),(2,'Service tracking system'),(3,'Data sharing')) x(n,value)
where p.content_key='wheel-base' on conflict (content_key) do nothing;
insert into public.portfolio_project_highlights (project_id,content_key,value,sort_order)
select p.id,p.content_key || '.highlight.' || x.n,x.value,x.n from public.portfolio_projects p
cross join lateral (values (1,'Recurring service scheduling'),(2,'User feedback system'),(3,'Service management'),(4,'Optimized booking flow')) x(n,value)
where p.content_key='broomie' on conflict (content_key) do nothing;
insert into public.portfolio_project_highlights (project_id,content_key,value,sort_order)
select p.id,p.content_key || '.highlight.' || x.n,x.value,x.n from public.portfolio_projects p
cross join lateral (values (1,'Real-time staff data retrieval'),(2,'Custom state management for performance'),(3,'Clean and responsive staff directory UI'),(4,'Robust API error handling'),(5,'Pagination')) x(n,value)
where p.content_key='edvoc' on conflict (content_key) do nothing;
insert into public.portfolio_project_highlights (project_id,content_key,value,sort_order)
select p.id,p.content_key || '.highlight.' || x.n,x.value,x.n from public.portfolio_projects p
cross join lateral (values (1,'Smooth tap-based prayer counter'),(2,'Minimal performance-focused state management'),(3,'Clean and distraction-free UI'),(4,'Lightweight and responsive design')) x(n,value)
where p.content_key='madrasaapp' on conflict (content_key) do nothing;
insert into public.portfolio_project_highlights (project_id,content_key,value,sort_order)
select p.id,p.content_key || '.highlight.' || x.n,x.value,x.n from public.portfolio_projects p
cross join lateral (values (1,'Pet care scheduling and activity tracking'),(2,'Firebase-backed data storage and sync'),(3,'Realtime group messaging for community interaction'),(4,'Implemented Firebase database-integrated live chat system')) x(n,value)
where p.content_key='petcare' on conflict (content_key) do nothing;
-- Verification: select count(*) from public.portfolio_projects;

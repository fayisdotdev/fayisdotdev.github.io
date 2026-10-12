/*
Feature: Portfolio experience
Purpose: Store each experience record and each responsibility in separate rows.
Depends on: 02-portfolio-admin.sql; 03-portfolio-change-history.sql.
*/
create table if not exists public.portfolio_experience (
  id uuid primary key default gen_random_uuid(),
  title text not null default '', company text not null default '',
  location text not null default '', period text not null default '',
  link text not null default '', sort_order integer not null default 0,
  content_key text,
  is_published boolean not null default true,
  updated_by uuid references auth.users(id), updated_at timestamptz not null default now()
);
alter table public.portfolio_experience add column if not exists content_key text;
alter table public.portfolio_experience add column if not exists is_published boolean not null default true;
alter table public.portfolio_experience add column if not exists updated_by uuid references auth.users(id);
alter table public.portfolio_experience add column if not exists updated_at timestamptz not null default now();
create unique index if not exists portfolio_experience_content_key_idx on public.portfolio_experience(content_key) where content_key is not null;
create table if not exists public.portfolio_experience_responsibilities (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.portfolio_experience(id) on delete cascade,
  content_key text not null unique, value text not null default '',
  sort_order integer not null default 0, is_published boolean not null default true,
  updated_by uuid references auth.users(id), updated_at timestamptz not null default now()
);
update public.portfolio_experience set content_key = case title
  when 'Software Developer (Freelance)' then 'freelance-developer'
  when 'Software Developer' then 'popular-auto-developer'
  when 'Data Analyst & ML Developer' then 'cybacor-data-analyst'
  when 'Flutter Intern' then 'grapesgenix-intern'
  else coalesce(content_key, regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g') || '-' || id::text) end
where content_key is null;
insert into public.portfolio_experience (content_key,title,company,location,period,link,sort_order) values
  ('freelance-developer','Software Developer (Freelance)','Multiple Clients','UAE and India','April 2024 - Present','',1),
  ('popular-auto-developer','Software Developer','Popular Auto ','Ontario, Canada (Remote)','June 2025 – Aug 2025','https://popularauto.ca/',2),
  ('cybacor-data-analyst','Data Analyst & ML Developer','Cybacor Technologies ','Kerala, India','April 2024 - March 2025','https://cybacortechnologies.com/',3),
  ('grapesgenix-intern','Flutter Intern','GrapesGenix PVT LTD ','Kerala, India','Aug 2023 – Feb 2024','https://grapestechs.com/',4)
on conflict (content_key) where content_key is not null do nothing;
do $$
declare t text;
begin
  foreach t in array array['portfolio_experience','portfolio_experience_responsibilities'] loop
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
drop policy if exists "Public reads published portfolio_experience_responsibilities" on public.portfolio_experience_responsibilities;
create policy "Public reads published portfolio_experience_responsibilities"
  on public.portfolio_experience_responsibilities for select to anon, authenticated
  using (is_published and exists (
    select 1 from public.portfolio_experience e
    where e.id = experience_id and e.is_published
  ));
grant select on public.portfolio_experience, public.portfolio_experience_responsibilities to anon, authenticated;
grant insert, update, delete on public.portfolio_experience, public.portfolio_experience_responsibilities to authenticated;
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='portfolio_experience' and column_name='responsibilities') then
    insert into public.portfolio_experience_responsibilities (experience_id,content_key,value,sort_order)
    select e.id, e.content_key || '.responsibility.' || item.ordinal, item.value, item.ordinal::integer
    from public.portfolio_experience e
    cross join lateral unnest(e.responsibilities) with ordinality item(value,ordinal)
    where e.content_key is not null
    on conflict (content_key) do nothing;
    alter table public.portfolio_experience drop column responsibilities;
  end if;
end
$$;
insert into public.portfolio_experience_responsibilities (experience_id,content_key,value,sort_order)
select e.id,e.content_key || '.responsibility.' || x.n,x.value,x.n from public.portfolio_experience e
cross join lateral (values
  (1,'Built production-grade mobile apps end-to-end'),(2,'Integrated Firebase and Supabase backends'),(3,'Delivered apps across sectors')
) x(n,value) where e.content_key='freelance-developer' on conflict (content_key) do nothing;
insert into public.portfolio_experience_responsibilities (experience_id,content_key,value,sort_order)
select e.id,e.content_key || '.responsibility.' || x.n,x.value,x.n from public.portfolio_experience e
cross join lateral (values (1,'Built CRM using Flutter + FastAPI'),(2,'Implemented RBAC authentication'),(3,'Worked in Agile sprints')) x(n,value)
where e.content_key='popular-auto-developer' on conflict (content_key) do nothing;
insert into public.portfolio_experience_responsibilities (experience_id,content_key,value,sort_order)
select e.id,e.content_key || '.responsibility.' || x.n,x.value,x.n from public.portfolio_experience e
cross join lateral (values (1,'Built ML models using Python'),(2,'Performed statistical analysis'),(3,'Created Power BI dashboards')) x(n,value)
where e.content_key='cybacor-data-analyst' on conflict (content_key) do nothing;
insert into public.portfolio_experience_responsibilities (experience_id,content_key,value,sort_order)
select e.id,e.content_key || '.responsibility.' || x.n,x.value,x.n from public.portfolio_experience e
cross join lateral (values
  (1,'Developed PetCare Android app using Flutter'),(2,'Integrated Firebase Authentication and Cloud Firestore'),
  (3,'Implemented stateful widgets and asynchronous programming'),(4,'Focused on intuitive UI and smooth navigation')
) x(n,value) where e.content_key='grapesgenix-intern' on conflict (content_key) do nothing;
-- Verification: select count(*) from public.portfolio_experience;

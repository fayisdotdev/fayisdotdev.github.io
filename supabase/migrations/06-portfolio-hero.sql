/*
Feature: Hero content
Purpose: Store hero copy as independently editable fields and each call-to-action
         as its own row.
Depends on: 02-portfolio-admin.sql; 03-portfolio-change-history.sql.
*/
create table if not exists public.portfolio_hero (
  id uuid primary key default gen_random_uuid(),
  content_key text not null unique,
  field_value text not null default '',
  is_published boolean not null default true,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);
create table if not exists public.portfolio_hero_actions (
  id uuid primary key default gen_random_uuid(),
  content_key text not null unique,
  label text not null default '',
  section_id text not null default '',
  sort_order integer not null default 0,
  is_published boolean not null default true,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);
do $$
declare t text;
begin
  foreach t in array array['portfolio_hero','portfolio_hero_actions'] loop
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
grant select on public.portfolio_hero, public.portfolio_hero_actions to anon, authenticated;
grant insert, update, delete on public.portfolio_hero, public.portfolio_hero_actions to authenticated;
insert into public.portfolio_hero (content_key,field_value) values
  ('greeting','Hello, I''m'),('name','Muhammad Fayis'),('role','Software Developer × Data Analyst'),
  ('tagline','Building high-performance mobile and web applications with Flutter and Raact and deriving actionable insights from complex datasets using Python, Power BI, and ML')
on conflict (content_key) do nothing;
insert into public.portfolio_hero_actions (content_key,label,section_id,sort_order) values
  ('projects','View Projects','projects',1),('contact','Get In Touch','contact',2)
on conflict (content_key) do nothing;
-- Verification: select count(*) from public.portfolio_hero;

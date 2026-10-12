/*
Feature: Portfolio navigation
Purpose: Store each navigation label, section target, publication state, and order.
Depends on: 02-portfolio-admin.sql; 03-portfolio-change-history.sql.
*/
create table if not exists public.portfolio_navigation (
  id uuid primary key default gen_random_uuid(),
  content_key text not null unique,
  label text not null default '',
  section_id text not null default '',
  sort_order integer not null default 0,
  is_published boolean not null default true,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);
alter table public.portfolio_navigation enable row level security;
drop policy if exists "Public reads published portfolio_navigation" on public.portfolio_navigation;
create policy "Public reads published portfolio_navigation" on public.portfolio_navigation for select to anon, authenticated using (is_published);
drop policy if exists "Admins manage portfolio_navigation" on public.portfolio_navigation;
create policy "Admins manage portfolio_navigation" on public.portfolio_navigation for all to authenticated using (public.portfolio_current_role() in ('admin','super_admin')) with check (public.portfolio_current_role() in ('admin','super_admin'));
drop trigger if exists portfolio_set_updated_at on public.portfolio_navigation;
create trigger portfolio_set_updated_at before insert or update on public.portfolio_navigation for each row execute function public.portfolio_set_updated_at();
drop trigger if exists portfolio_log_change on public.portfolio_navigation;
create trigger portfolio_log_change after insert or update or delete on public.portfolio_navigation for each row execute function public.portfolio_log_change();
grant select on public.portfolio_navigation to anon, authenticated;
grant insert, update, delete on public.portfolio_navigation to authenticated;
insert into public.portfolio_navigation (content_key,label,section_id,sort_order) values
  ('home','Home','home',1),('about','About','about',2),('skills','Skills','skills',3),
  ('projects','Projects','projects',4),('experience','Experience','experience',5),('contact','Contact','contact',6)
on conflict (content_key) do nothing;
-- Verification: select count(*) from public.portfolio_navigation;

/*
Feature: Portfolio SEO
Purpose: Store document title, language, description, icon, canonical URL, and
         social preview metadata as individually editable values.
Depends on: 02-portfolio-admin.sql; 03-portfolio-change-history.sql.
*/
create table if not exists public.portfolio_seo (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  setting_value text not null default '',
  is_published boolean not null default true,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);
alter table public.portfolio_seo enable row level security;
drop policy if exists "Public reads published portfolio_seo" on public.portfolio_seo;
create policy "Public reads published portfolio_seo" on public.portfolio_seo for select to anon, authenticated using (is_published);
drop policy if exists "Admins manage portfolio_seo" on public.portfolio_seo;
create policy "Admins manage portfolio_seo" on public.portfolio_seo for all to authenticated using (public.portfolio_current_role() in ('admin','super_admin')) with check (public.portfolio_current_role() in ('admin','super_admin'));
drop trigger if exists portfolio_set_updated_at on public.portfolio_seo;
create trigger portfolio_set_updated_at before insert or update on public.portfolio_seo for each row execute function public.portfolio_set_updated_at();
drop trigger if exists portfolio_log_change on public.portfolio_seo;
create trigger portfolio_log_change after insert or update or delete on public.portfolio_seo for each row execute function public.portfolio_log_change();
grant select on public.portfolio_seo to anon, authenticated;
grant insert, update, delete on public.portfolio_seo to authenticated;
insert into public.portfolio_seo (setting_key,setting_value) values
  ('document_title','Fayisdotdev'),('language','en'),('favicon_path','/vite.svg'),
  ('description',''),('canonical_url',''),('og_title',''),('og_description','')
on conflict (setting_key) do nothing;
-- Verification: select count(*) from public.portfolio_seo;

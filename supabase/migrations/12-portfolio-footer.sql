/*
Feature: Portfolio footer
Purpose: Store footer/copyright copy and display settings independently.
Depends on: 02-portfolio-admin.sql; 03-portfolio-change-history.sql; 04 shared social links.
*/
create table if not exists public.portfolio_footer (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  setting_value text not null default '',
  is_published boolean not null default true,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);
alter table public.portfolio_footer enable row level security;
drop policy if exists "Public reads published portfolio_footer" on public.portfolio_footer;
create policy "Public reads published portfolio_footer" on public.portfolio_footer for select to anon, authenticated using (is_published);
drop policy if exists "Admins manage portfolio_footer" on public.portfolio_footer;
create policy "Admins manage portfolio_footer" on public.portfolio_footer for all to authenticated using (public.portfolio_current_role() in ('admin','super_admin')) with check (public.portfolio_current_role() in ('admin','super_admin'));
drop trigger if exists portfolio_set_updated_at on public.portfolio_footer;
create trigger portfolio_set_updated_at before insert or update on public.portfolio_footer for each row execute function public.portfolio_set_updated_at();
drop trigger if exists portfolio_log_change on public.portfolio_footer;
create trigger portfolio_log_change after insert or update or delete on public.portfolio_footer for each row execute function public.portfolio_log_change();
grant select on public.portfolio_footer to anon, authenticated;
grant insert, update, delete on public.portfolio_footer to authenticated;
insert into public.portfolio_footer (setting_key,setting_value) values
  ('copyright_prefix','© 2024 to '),('copyright_owner',' Muhammad Fayis K M.')
on conflict (setting_key) do nothing;
-- Verification: select count(*) from public.portfolio_footer;

/*
Feature: Portfolio administration and roles
Purpose: Define database-backed admin/super_admin roles and shared timestamp
         triggers. RLS policies in later migrations use the role helper.
Depends on: 01-portfolio-rename-tables.sql; Supabase Auth.
*/
create table if not exists public.portfolio_admin (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null,
  role text not null check (role in ('admin', 'super_admin')),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);
alter table public.portfolio_admin
  add column if not exists updated_by uuid references auth.users(id);
alter table public.portfolio_admin
  add column if not exists updated_at timestamptz not null default now();

create or replace function public.portfolio_current_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.portfolio_admin where user_id = auth.uid()
$$;

alter table public.portfolio_admin enable row level security;
drop policy if exists "Super admins manage portfolio admins" on public.portfolio_admin;
create policy "Super admins manage portfolio admins"
  on public.portfolio_admin for all to authenticated
  using (public.portfolio_current_role() = 'super_admin')
  with check (public.portfolio_current_role() = 'super_admin');

create or replace function public.portfolio_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end
$$;

drop trigger if exists portfolio_set_updated_at on public.portfolio_admin;
create trigger portfolio_set_updated_at before insert or update
  on public.portfolio_admin for each row
  execute function public.portfolio_set_updated_at();

grant execute on function public.portfolio_current_role() to authenticated;
revoke all on function public.portfolio_current_role() from public, anon;
grant select, insert, update, delete on public.portfolio_admin to authenticated;

-- Bootstrap the first owner after creating their Auth user:
-- insert into public.portfolio_admin (user_id, email, role)
-- select id, email, 'super_admin' from auth.users where email = 'YOUR_AUTH_EMAIL'
-- on conflict (user_id) do update set role = excluded.role;

-- Verification: after bootstrapping the first super_admin, this returns their role.
-- select public.portfolio_current_role();

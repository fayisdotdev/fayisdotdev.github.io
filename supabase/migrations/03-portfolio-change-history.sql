/*
Feature: Portfolio change history
Purpose: Record field-level before/after values and provide super-admin-only
         history access and protected field reversion.
Depends on: 02-portfolio-admin.sql; feature tables from 04 onward.
*/
create table if not exists public.portfolio_change_history (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  row_id uuid not null,
  column_name text not null,
  old_value jsonb,
  new_value jsonb,
  operation text not null check (operation in ('INSERT', 'UPDATE', 'DELETE')),
  changed_by uuid references auth.users(id),
  changed_by_email text,
  changed_at timestamptz not null default now()
);
alter table public.portfolio_change_history
  add column if not exists changed_by_email text;

alter table public.portfolio_change_history enable row level security;
drop policy if exists "Super admins read portfolio history" on public.portfolio_change_history;
create policy "Super admins read portfolio history"
  on public.portfolio_change_history for select to authenticated
  using (public.portfolio_current_role() = 'super_admin');
grant select on public.portfolio_change_history to authenticated;

create or replace function public.portfolio_log_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  old_record jsonb;
  new_record jsonb;
  field record;
  record_id uuid;
begin
  old_record := case when tg_op = 'INSERT' then '{}'::jsonb else to_jsonb(old) end;
  new_record := case when tg_op = 'DELETE' then '{}'::jsonb else to_jsonb(new) end;
  record_id := coalesce((new_record ->> 'id')::uuid, (old_record ->> 'id')::uuid);

  for field in
    select coalesce(n.key, o.key) as key, o.value as old_value, n.value as new_value
    from jsonb_each(old_record) o
    full join jsonb_each(new_record) n on n.key = o.key
    where coalesce(n.key, o.key) not in ('id', 'updated_at', 'updated_by')
      and o.value is distinct from n.value
  loop
    insert into public.portfolio_change_history
      (table_name, row_id, column_name, old_value, new_value, operation, changed_by, changed_by_email)
    values
      (tg_table_name, record_id, field.key, field.old_value, field.new_value, tg_op, auth.uid(), auth.jwt() ->> 'email');
  end loop;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end
$$;

drop trigger if exists portfolio_log_change on public.portfolio_admin;
create trigger portfolio_log_change after insert or update or delete
  on public.portfolio_admin for each row
  execute function public.portfolio_log_change();

create or replace function public.portfolio_revert_change(p_change_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  change public.portfolio_change_history%rowtype;
  row_data jsonb;
begin
  if public.portfolio_current_role() <> 'super_admin' then
    raise exception 'Only a super_admin can revert portfolio changes';
  end if;

  select * into strict change
  from public.portfolio_change_history where id = p_change_id;

  if change.table_name not in (
    'portfolio_admin', 'portfolio_site_settings', 'portfolio_social_links', 'portfolio_navigation',
    'portfolio_hero', 'portfolio_hero_actions', 'portfolio_about',
    'portfolio_about_cards', 'portfolio_about_strengths',
    'portfolio_skill_categories', 'portfolio_skills',
    'portfolio_projects', 'portfolio_project_technologies',
    'portfolio_project_highlights', 'portfolio_experience',
    'portfolio_experience_responsibilities', 'portfolio_contact_settings',
    'portfolio_footer', 'portfolio_seo'
  ) then
    raise exception 'Unsupported table for reversion: %', change.table_name;
  end if;

  if change.operation = 'INSERT' then
    execute format('delete from public.%I where id = $1', change.table_name)
      using change.row_id;
  elsif change.operation = 'DELETE' then
    select jsonb_object_agg(column_name, old_value) into row_data
    from public.portfolio_change_history
    where table_name = change.table_name and row_id = change.row_id
      and operation = 'DELETE' and changed_at = change.changed_at;
    row_data := row_data || jsonb_build_object('id', change.row_id);
    execute format('insert into public.%I (id) values ($1)', change.table_name)
      using change.row_id;
    execute format(
      'update public.%I set %s where id = $2',
      change.table_name,
      (select string_agg(format('%1$I = (jsonb_populate_record(null::public.%2$I, $1)).%1$I', key, change.table_name), ', ')
       from jsonb_object_keys(row_data) as keys(key) where key <> 'id')
    ) using row_data, change.row_id;
  else
    execute format(
      'update public.%I set %I = (jsonb_populate_record(null::public.%I, $1)).%I where id = $2',
      change.table_name, change.column_name, change.table_name, change.column_name
    ) using jsonb_build_object(change.column_name, change.old_value), change.row_id;
  end if;
end
$$;

revoke all on function public.portfolio_log_change() from public, anon, authenticated;
revoke all on function public.portfolio_revert_change(uuid) from public, anon;
grant execute on function public.portfolio_revert_change(uuid) to authenticated;

-- Verification: this remains empty until an editable feature row changes.
-- select count(*) from public.portfolio_change_history;

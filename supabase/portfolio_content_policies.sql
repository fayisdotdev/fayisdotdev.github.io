create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  role text not null default '',
  period text not null default '',
  description text not null default '',
  tech text[] not null default '{}',
  highlights text[] not null default '{}',
  link text not null default '',
  icon text not null default 'Code',
  sort_order integer not null default 0
);

create table if not exists public.portfolio_experience (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  company text not null default '',
  location text not null default '',
  period text not null default '',
  responsibilities text[] not null default '{}',
  link text not null default '',
  sort_order integer not null default 0
);

create table if not exists public.portfolio_skills (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  category_order integer not null default 0,
  name text not null default '',
  level integer not null default 50 check (level between 0 and 100),
  sort_order integer not null default 0
);

create table if not exists public.portfolio_content_state (
  id text primary key check (id = 'main'),
  initialized boolean not null default false,
  updated_at timestamptz not null default now()
);

insert into public.portfolio_content_state (id, initialized)
values ('main', false)
on conflict (id) do nothing;

-- Import the previous JSON row once, if the old table and its main record exist.
do $$
declare
  legacy_content jsonb;
  needs_migration boolean;
begin
  if to_regclass('public.portfolio_content') is not null then
    execute 'select content from public.portfolio_content where id = ''main'''
      into legacy_content;

    select not initialized
    into needs_migration
    from public.portfolio_content_state
    where id = 'main';

    if legacy_content is not null and needs_migration then
      insert into public.portfolio_projects (
        title, role, period, description, tech, highlights, link, icon, sort_order
      )
      select
        item ->> 'title',
        item ->> 'role',
        item ->> 'period',
        item ->> 'description',
        array(select jsonb_array_elements_text(coalesce(item -> 'tech', '[]'::jsonb))),
        array(select jsonb_array_elements_text(coalesce(item -> 'highlights', '[]'::jsonb))),
        coalesce(item ->> 'link', ''),
        coalesce(item ->> 'icon', 'Code'),
        ordinal::integer - 1
      from jsonb_array_elements(coalesce(legacy_content -> 'projects', '[]'::jsonb))
        with ordinality as project(item, ordinal);

      insert into public.portfolio_experience (
        title, company, location, period, responsibilities, link, sort_order
      )
      select
        item ->> 'title',
        item ->> 'company',
        item ->> 'location',
        item ->> 'period',
        array(select jsonb_array_elements_text(coalesce(item -> 'responsibilities', '[]'::jsonb))),
        coalesce(item ->> 'link', ''),
        ordinal::integer - 1
      from jsonb_array_elements(coalesce(legacy_content -> 'experience', '[]'::jsonb))
        with ordinality as experience(item, ordinal);

      insert into public.portfolio_skills (
        category, category_order, name, level, sort_order
      )
      select
        category.name,
        case category.name
          when 'languages' then 0
          when 'frameworks' then 1
          when 'stateManagement' then 2
          when 'dataAnalysis' then 3
          else 4
        end,
        skill.item ->> 'name',
        coalesce((skill.item ->> 'level')::integer, 50),
        skill.ordinal::integer - 1
      from jsonb_each(coalesce(legacy_content -> 'skills', '{}'::jsonb)) as category(name, items)
      cross join lateral jsonb_array_elements(category.items)
        with ordinality as skill(item, ordinal);

      update public.portfolio_content_state
      set initialized = true, updated_at = now()
      where id = 'main';
    end if;
  end if;
end $$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'portfolio_projects',
    'portfolio_experience',
    'portfolio_skills',
    'portfolio_content_state'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('drop policy if exists "Public can read %1$s" on public.%1$I', table_name);
    execute format(
      'create policy "Public can read %1$s" on public.%1$I for select to anon, authenticated using (true)',
      table_name
    );

    if table_name = 'portfolio_content_state' then
      execute format('drop policy if exists "Admins can update %1$s" on public.%1$I', table_name);
      execute format(
        'create policy "Admins can update %1$s" on public.%1$I for update to authenticated using ((auth.jwt() -> ''app_metadata'' ->> ''role'') = ''admin'') with check ((auth.jwt() -> ''app_metadata'' ->> ''role'') = ''admin'')',
        table_name
      );
    else
      execute format('drop policy if exists "Admins can manage %1$s" on public.%1$I', table_name);
      execute format(
        'create policy "Admins can manage %1$s" on public.%1$I for all to authenticated using ((auth.jwt() -> ''app_metadata'' ->> ''role'') = ''admin'') with check ((auth.jwt() -> ''app_metadata'' ->> ''role'') = ''admin'')',
        table_name
      );
    end if;
  end loop;
end $$;

grant select on public.portfolio_projects, public.portfolio_experience,
  public.portfolio_skills, public.portfolio_content_state to anon, authenticated;
grant insert, update, delete on public.portfolio_projects,
  public.portfolio_experience, public.portfolio_skills to authenticated;
grant update on public.portfolio_content_state to authenticated;
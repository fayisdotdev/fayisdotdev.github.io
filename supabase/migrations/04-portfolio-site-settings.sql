/*
Feature: Site settings and shared social links
Purpose: Store editable site-wide brand settings and reusable profile links.
Depends on: 02-portfolio-admin.sql; 03-portfolio-change-history.sql.
*/
create table if not exists public.portfolio_site_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  setting_value text not null default '',
  is_published boolean not null default true,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);
create table if not exists public.portfolio_social_links (
  id uuid primary key default gen_random_uuid(),
  content_key text not null unique,
  platform text not null default '',
  label text not null default '',
  url text not null default '',
  placement text not null default 'hero',
  sort_order integer not null default 0,
  is_published boolean not null default true,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['portfolio_site_settings','portfolio_social_links'] loop
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
grant select on public.portfolio_site_settings, public.portfolio_social_links to anon, authenticated;
grant insert, update, delete on public.portfolio_site_settings, public.portfolio_social_links to authenticated;

insert into public.portfolio_site_settings (setting_key, setting_value) values
  ('brand_name','Fayisdotdev'),
  ('skills_heading','Skills & Technologies'), ('projects_heading','Featured Projects'),
  ('experience_heading','Experience'), ('back_to_top_label','Back to top'),
  ('content_initialized','true')
on conflict (setting_key) do nothing;
insert into public.portfolio_social_links (content_key,platform,label,url,placement,sort_order) values
  ('github','github','GitHub','https://github.com/fayisdotdev','hero,footer',1),
  ('linkedin','linkedin','LinkedIn','https://linkedin.com/in/fayisdotdev','hero,footer',2),
  ('linktree','linktree','Linktree','https://linktr.ee/fayisdotdev','footer',3),
  ('email','email','Email','mailto:muhammadfayiskmofficial@gmail.com','hero,footer',4)
on conflict (content_key) do nothing;
-- Verification: select count(*) from public.portfolio_site_settings;

-- Create the admin user in Supabase Auth, then assign its trusted app_metadata role.
-- Run this separately in the Supabase SQL Editor after creating the Auth user.
-- update auth.users
-- set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
-- where email = 'fayis123@gmail.com';
-- Review existing contacts policies too: permissive policies combine with OR.

alter table public.contacts enable row level security;

drop policy if exists "Public can submit contact messages" on public.contacts;
create policy "Public can submit contact messages"
on public.contacts
for insert
to anon, authenticated
with check (true);

drop policy if exists "Admins can read contact messages" on public.contacts;
create policy "Admins can read contact messages"
on public.contacts
for select
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can update contact messages" on public.contacts;
create policy "Admins can update contact messages"
on public.contacts
for update
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can delete contact messages" on public.contacts;
create policy "Admins can delete contact messages"
on public.contacts
for delete
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');



//
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'fayis123@gmail.com';

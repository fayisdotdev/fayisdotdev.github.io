/*
Feature: Public contact content and contact submissions
Purpose: Store independently editable contact copy and preserve the existing
         public-submission/admin-inbox behavior for the contacts table.
Depends on: 02-portfolio-admin.sql; 03-portfolio-change-history.sql; public.contacts.
*/
create table if not exists public.portfolio_contact_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  setting_value text not null default '',
  is_published boolean not null default true,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);
alter table public.portfolio_contact_settings enable row level security;
drop policy if exists "Public reads published portfolio_contact_settings" on public.portfolio_contact_settings;
create policy "Public reads published portfolio_contact_settings" on public.portfolio_contact_settings for select to anon, authenticated using (is_published);
drop policy if exists "Admins manage portfolio_contact_settings" on public.portfolio_contact_settings;
create policy "Admins manage portfolio_contact_settings" on public.portfolio_contact_settings for all to authenticated using (public.portfolio_current_role() in ('admin','super_admin')) with check (public.portfolio_current_role() in ('admin','super_admin'));
drop trigger if exists portfolio_set_updated_at on public.portfolio_contact_settings;
create trigger portfolio_set_updated_at before insert or update on public.portfolio_contact_settings for each row execute function public.portfolio_set_updated_at();
drop trigger if exists portfolio_log_change on public.portfolio_contact_settings;
create trigger portfolio_log_change after insert or update or delete on public.portfolio_contact_settings for each row execute function public.portfolio_log_change();
grant select on public.portfolio_contact_settings to anon, authenticated;
grant insert, update, delete on public.portfolio_contact_settings to authenticated;
insert into public.portfolio_contact_settings (setting_key,setting_value) values
  ('heading','Let''s Work Together'),
  ('intro','Currently open to new opportunities and exciting projects'),
  ('email_label','Email'),
  ('email','muhammadfayiskmofficial@gmail.com'),
  ('name_placeholder','Your Name'),
  ('email_placeholder','Your Email'),
  ('phone_placeholder','Your whatsapp number. (Optional)'),
  ('message_placeholder','Your Message'),
  ('phone_validation','Please provide either email or phone number.'),
  ('submit_label','Send Message'),
  ('submitting_label','Sending...'),
  ('success_message','Message sent successfully! I''ll get back to you soon.'),
  ('configuration_error','Configuration error. Please check Supabase credentials.'),
  ('send_error','Failed to send message. Please try again.')
on conflict (setting_key) do nothing;

alter table public.contacts enable row level security;
drop policy if exists "Public can submit contact messages" on public.contacts;
create policy "Public can submit contact messages" on public.contacts for insert to anon, authenticated with check (true);
drop policy if exists "Admins can read contact messages" on public.contacts;
create policy "Admins can read contact messages" on public.contacts for select to authenticated using (public.portfolio_current_role() in ('admin','super_admin'));
drop policy if exists "Admins can update contact messages" on public.contacts;
create policy "Admins can update contact messages" on public.contacts for update to authenticated using (public.portfolio_current_role() in ('admin','super_admin')) with check (public.portfolio_current_role() in ('admin','super_admin'));
drop policy if exists "Admins can delete contact messages" on public.contacts;
create policy "Admins can delete contact messages" on public.contacts for delete to authenticated using (public.portfolio_current_role() in ('admin','super_admin'));
grant insert on public.contacts to anon, authenticated;
grant select, update, delete on public.contacts to authenticated;
-- Verification: select count(*) from public.portfolio_contact_settings;

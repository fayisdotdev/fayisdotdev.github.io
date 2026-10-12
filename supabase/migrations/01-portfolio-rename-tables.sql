/*
Feature: Legacy table naming baseline
Purpose: Document and safely account for legacy access/content tables found in
         the repository before installing the portfolio-prefixed schema.
Depends on: Existing Supabase project schema.

The checked-in application uses Supabase-managed auth.users, public.contacts for
contact submissions, and portfolio_-prefixed content tables. No unprefixed
access-control table exists in the checked-in SQL, so this migration deliberately
does not rename contacts or guess at unknown live table names.
*/
-- Legacy app_metadata policies are removed and replaced by role-helper policies
-- in migrations 02 onward. Keep contacts in place because it stores submissions.
drop policy if exists "Admins can read contact messages" on public.contacts;
drop policy if exists "Admins can update contact messages" on public.contacts;
drop policy if exists "Admins can delete contact messages" on public.contacts;

-- Verification: confirm relevant table names before continuing.
-- select tablename from pg_tables where schemaname = 'public' and tablename like '%admin%';

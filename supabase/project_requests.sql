-- ============================================================================
-- CareerShelf — project_requests
-- Run this once in the Supabase SQL editor (Dashboard → SQL → New query).
-- Safe to run more than once.
--
-- What it does:
--   1. Creates public.project_requests for the /request-project form.
--   2. Lets anyone (anon + signed-in users) INSERT a request.
--   3. Lets ONLY the admin account read and update requests.
--   4. Creates indexes for the admin inbox.
--
-- This table is completely separate from orders/products/payments.
-- Nothing here touches the Youpi checkout flow.
-- ============================================================================

create extension if not exists pgcrypto;

create table if not exists public.project_requests (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  -- contact details
  full_name       text not null,
  email           text not null,
  whatsapp        text not null,
  college         text,
  year_of_study   text,
  course          text,

  -- requirement
  needs           text[] not null default '{}',
  project_type    text,
  tech_stack      text,
  description     text not null,
  deadline        date,
  budget          text,
  reference_url   text,
  source_project  text,

  -- admin workflow
  status          text not null default 'new'
                  check (status in ('new', 'contacted', 'in_progress', 'done')),
  admin_note      text
);

-- Keep updated_at accurate without touching application code.
create or replace function public.set_project_request_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists project_requests_set_updated_at
  on public.project_requests;

create trigger project_requests_set_updated_at
  before update on public.project_requests
  for each row
  execute function public.set_project_request_updated_at();

create index if not exists project_requests_created_at_idx
  on public.project_requests (created_at desc);

create index if not exists project_requests_status_idx
  on public.project_requests (status);

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.project_requests enable row level security;

-- Anyone visiting the site can submit a request.
drop policy if exists "Anyone can submit a project request"
  on public.project_requests;

create policy "Anyone can submit a project request"
  on public.project_requests
  for insert
  to anon, authenticated
  with check (true);

-- Only the admin email can read the inbox.
-- The admin must be signed in through Supabase Auth with this exact email.
drop policy if exists "Admin can read project requests"
  on public.project_requests;

create policy "Admin can read project requests"
  on public.project_requests
  for select
  to authenticated
  using ((auth.jwt() ->> 'email') = 'careershelf.help@gmail.com');

-- Only the admin email can change status / add notes.
drop policy if exists "Admin can update project requests"
  on public.project_requests;

create policy "Admin can update project requests"
  on public.project_requests
  for update
  to authenticated
  using ((auth.jwt() ->> 'email') = 'careershelf.help@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'careershelf.help@gmail.com');

-- No DELETE policy on purpose: requests are kept as a record.

-- ============================================================================
-- Privileges (explicit, so this works regardless of project defaults)
-- ============================================================================

grant insert on public.project_requests to anon, authenticated;
grant select, update on public.project_requests to authenticated;

-- The service role bypasses RLS and does not need explicit grants.

-- ============================================================================
-- Verification (optional — run after the above)
-- ============================================================================
-- select relname, relrowsecurity
--   from pg_class
--   where relname = 'project_requests';
--
-- select policyname, cmd, roles
--   from pg_policies
--   where tablename = 'project_requests';

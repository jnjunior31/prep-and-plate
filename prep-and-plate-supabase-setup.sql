-- Prep & Plate shared database setup
-- Run this entire file once in Supabase > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Our household',
  invite_code text not null unique default upper(encode(gen_random_bytes(4), 'hex')),
  created_by uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.household_members (
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  joined_at timestamptz not null default now(),
  primary key (household_id, user_id)
);

create table if not exists public.planner_state (
  household_id uuid primary key references public.households(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists public.shopping_checks (
  household_id uuid not null references public.households(id) on delete cascade,
  item_key text not null,
  checked boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null,
  primary key (household_id, item_key)
);

create index if not exists household_members_user_id_idx
  on public.household_members(user_id);

create index if not exists shopping_checks_household_id_idx
  on public.shopping_checks(household_id);

-- A protected helper used by the security policies below.
create or replace function public.is_household_member(target_household uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.household_members
    where household_id = target_household
      and user_id = (select auth.uid())
  );
$$;

-- Creates a household for the signed-in user and returns its invite code.
create or replace function public.create_household(household_name text default 'Our household')
returns table (household_id uuid, invite_code text)
language plpgsql
security definer
set search_path = public
as $$
declare
  new_household public.households%rowtype;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in.';
  end if;

  insert into public.households (name, created_by)
  values (coalesce(nullif(trim(household_name), ''), 'Our household'), auth.uid())
  returning * into new_household;

  insert into public.household_members (household_id, user_id, role)
  values (new_household.id, auth.uid(), 'owner');

  insert into public.planner_state (household_id, data, updated_by)
  values (new_household.id, '{}'::jsonb, auth.uid());

  return query select new_household.id, new_household.invite_code;
end;
$$;

-- Lets the second signed-in person join using the household invite code.
create or replace function public.join_household(code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  target_id uuid;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in.';
  end if;

  select id into target_id
  from public.households
  where invite_code = upper(trim(code));

  if target_id is null then
    raise exception 'Invite code not found.';
  end if;

  insert into public.household_members (household_id, user_id, role)
  values (target_id, auth.uid(), 'member')
  on conflict (household_id, user_id) do nothing;

  return target_id;
end;
$$;

-- Keep timestamps accurate even if a client omits them.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  new.updated_by = auth.uid();
  return new;
end;
$$;

drop trigger if exists planner_state_set_updated_at on public.planner_state;
create trigger planner_state_set_updated_at
before update on public.planner_state
for each row execute function public.set_updated_at();

drop trigger if exists shopping_checks_set_updated_at on public.shopping_checks;
create trigger shopping_checks_set_updated_at
before insert or update on public.shopping_checks
for each row execute function public.set_updated_at();

-- Lock down direct table access, then grant only what the signed-in app needs.
revoke all on public.households from anon, authenticated;
revoke all on public.household_members from anon, authenticated;
revoke all on public.planner_state from anon, authenticated;
revoke all on public.shopping_checks from anon, authenticated;

grant select on public.households to authenticated;
grant select on public.household_members to authenticated;
grant select, insert, update on public.planner_state to authenticated;
grant select, insert, update, delete on public.shopping_checks to authenticated;

revoke all on function public.is_household_member(uuid) from public;
revoke all on function public.create_household(text) from public;
revoke all on function public.join_household(text) from public;
grant execute on function public.is_household_member(uuid) to authenticated;
grant execute on function public.create_household(text) to authenticated;
grant execute on function public.join_household(text) to authenticated;

alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.planner_state enable row level security;
alter table public.shopping_checks enable row level security;

drop policy if exists "Members can view their household" on public.households;
create policy "Members can view their household"
on public.households for select to authenticated
using (public.is_household_member(id));

drop policy if exists "Members can view household membership" on public.household_members;
create policy "Members can view household membership"
on public.household_members for select to authenticated
using (public.is_household_member(household_id));

drop policy if exists "Members can view planner state" on public.planner_state;
create policy "Members can view planner state"
on public.planner_state for select to authenticated
using (public.is_household_member(household_id));

drop policy if exists "Members can insert planner state" on public.planner_state;
create policy "Members can insert planner state"
on public.planner_state for insert to authenticated
with check (public.is_household_member(household_id));

drop policy if exists "Members can update planner state" on public.planner_state;
create policy "Members can update planner state"
on public.planner_state for update to authenticated
using (public.is_household_member(household_id))
with check (public.is_household_member(household_id));

drop policy if exists "Members can view shopping checks" on public.shopping_checks;
create policy "Members can view shopping checks"
on public.shopping_checks for select to authenticated
using (public.is_household_member(household_id));

drop policy if exists "Members can add shopping checks" on public.shopping_checks;
create policy "Members can add shopping checks"
on public.shopping_checks for insert to authenticated
with check (public.is_household_member(household_id));

drop policy if exists "Members can update shopping checks" on public.shopping_checks;
create policy "Members can update shopping checks"
on public.shopping_checks for update to authenticated
using (public.is_household_member(household_id))
with check (public.is_household_member(household_id));

drop policy if exists "Members can delete shopping checks" on public.shopping_checks;
create policy "Members can delete shopping checks"
on public.shopping_checks for delete to authenticated
using (public.is_household_member(household_id));

-- Enable realtime updates without failing if this script is run again.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'planner_state'
  ) then
    alter publication supabase_realtime add table public.planner_state;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'shopping_checks'
  ) then
    alter publication supabase_realtime add table public.shopping_checks;
  end if;
end
$$;

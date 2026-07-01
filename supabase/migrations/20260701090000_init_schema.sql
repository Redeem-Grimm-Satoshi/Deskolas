-- Deskolas core schema: profiles, tickets, comments, and the invite allowlist.
-- Access model: anyone signed in can read every ticket (transparency, so they
-- can find work to claim); a ticket is editable only by its opener, the person
-- who claimed it, or an admin. Sign-up is invite-only.

create extension if not exists pgcrypto;

-- Profiles ------------------------------------------------------------------
-- One row per auth user. Role is member or admin; membership in the cohort is
-- the account existing at all, so there is no separate status field.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  role text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default now()
);

-- Invites -------------------------------------------------------------------
-- The sign-up allowlist. Only emails listed here can create an account, which
-- is how "anyone in Per Scholas, by invite" is enforced without a domain gate.
create table public.invites (
  email text primary key,
  role text not null default 'member' check (role in ('member', 'admin')),
  invited_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  accepted_at timestamptz
);

-- Tickets -------------------------------------------------------------------
create sequence public.ticket_reference_seq;

create table public.tickets (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  title text not null,
  description text not null,
  category text not null,
  priority text not null default 'low' check (priority in ('low', 'medium', 'high')),
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved', 'closed')),
  submitted_by uuid not null references public.profiles (id),
  assigned_to uuid references public.profiles (id),
  resolution_notes text,
  -- KB bridge, unused until the Learners Hub handoff (kept from day one).
  is_candidate_article boolean not null default false,
  kb_article_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tickets_status_idx on public.tickets (status);
create index tickets_submitted_by_idx on public.tickets (submitted_by);
create index tickets_assigned_to_idx on public.tickets (assigned_to);

-- Human reference like PS-0001, stamped on insert and used as the join key for
-- the knowledge base handoff.
create or replace function public.set_ticket_reference()
returns trigger
language plpgsql
as $$
begin
  if new.reference is null then
    new.reference := 'PS-' || lpad(nextval('public.ticket_reference_seq')::text, 4, '0');
  end if;
  return new;
end;
$$;

create trigger tickets_set_reference
  before insert on public.tickets
  for each row execute function public.set_ticket_reference();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger tickets_touch_updated_at
  before update on public.tickets
  for each row execute function public.touch_updated_at();

-- Comments ------------------------------------------------------------------
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets (id) on delete cascade,
  author_id uuid not null references public.profiles (id),
  body text not null,
  created_at timestamptz not null default now()
);

create index comments_ticket_id_idx on public.comments (ticket_id);

-- Helpers -------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- Members self-claim an open ticket. Security definer so a member can take an
-- unassigned ticket without a broad update policy that would also let anyone
-- edit tickets they have nothing to do with.
create or replace function public.claim_ticket(ticket_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.tickets
  set assigned_to = auth.uid(),
      status = case when status = 'new' then 'in_progress' else status end
  where id = ticket_id and assigned_to is null;

  if not found then
    raise exception 'That ticket is not open to claim.';
  end if;
end;
$$;

-- On sign-up, create a profile only if the email is on the invite list, and
-- reject anyone who is not. Email/password and OAuth both flow through here.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  matched public.invites;
begin
  select * into matched from public.invites where lower(email) = lower(new.email);

  if matched.email is null then
    raise exception 'This email is not on the Deskolas invite list.';
  end if;

  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    ),
    matched.role
  );

  update public.invites set accepted_at = now() where email = matched.email;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

grant execute on function public.is_admin() to authenticated;
grant execute on function public.claim_ticket(uuid) to authenticated;

-- Row-Level Security --------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.tickets enable row level security;
alter table public.comments enable row level security;
alter table public.invites enable row level security;

-- Profiles: everyone signed in can read all (to show names); you edit your own;
-- admins can change roles.
create policy "profiles readable by authenticated"
  on public.profiles for select to authenticated using (true);

create policy "update own profile"
  on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

create policy "admins update any profile"
  on public.profiles for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Tickets: read-all; open your own; edit if opener, claimer, or admin.
create policy "tickets readable by authenticated"
  on public.tickets for select to authenticated using (true);

create policy "open your own ticket"
  on public.tickets for insert to authenticated
  with check (submitted_by = auth.uid());

create policy "opener claimer or admin update ticket"
  on public.tickets for update to authenticated
  using (
    submitted_by = auth.uid() or assigned_to = auth.uid() or public.is_admin()
  )
  with check (
    submitted_by = auth.uid() or assigned_to = auth.uid() or public.is_admin()
  );

create policy "admins delete tickets"
  on public.tickets for delete to authenticated using (public.is_admin());

-- Comments: read-all; write your own; edit or remove your own (or admin).
create policy "comments readable by authenticated"
  on public.comments for select to authenticated using (true);

create policy "add your own comment"
  on public.comments for insert to authenticated
  with check (author_id = auth.uid());

create policy "authors or admins update comments"
  on public.comments for update to authenticated
  using (author_id = auth.uid() or public.is_admin())
  with check (author_id = auth.uid() or public.is_admin());

create policy "authors or admins delete comments"
  on public.comments for delete to authenticated
  using (author_id = auth.uid() or public.is_admin());

-- Invites: only admins see or manage the allowlist. The sign-up trigger reads
-- it with security definer, so it does not need a policy for that path.
create policy "admins read invites"
  on public.invites for select to authenticated using (public.is_admin());

create policy "admins manage invites"
  on public.invites for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

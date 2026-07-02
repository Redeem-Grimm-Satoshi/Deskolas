-- In-app notifications, written by database triggers so every path (server
-- action, API, SQL) produces them consistently. Triggers skip when there is no
-- acting user (service-role paths like the seed), and never notify the actor
-- about their own change. Realtime is enabled on tickets, comments, and
-- notifications so clients update without a refresh.

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  ticket_id uuid references public.tickets (id) on delete cascade,
  reference text,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_user_id_idx on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;

create policy "read own notifications"
  on public.notifications for select to authenticated
  using (user_id = auth.uid());

create policy "mark own notifications read"
  on public.notifications for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Writes happen only in the security-definer trigger functions below.

create or replace function public.notify_ticket_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor uuid := auth.uid();
  actor_name text;
begin
  if actor is null then
    return new;
  end if;
  select full_name into actor_name from profiles where id = actor;

  insert into notifications (user_id, ticket_id, reference, body)
  select p.id, new.id, new.reference,
         coalesce(actor_name, 'Someone') || ' opened ' || new.reference || ': ' || new.title
  from profiles p
  where p.role = 'admin' and p.id <> new.submitted_by;

  return new;
end;
$$;

create or replace function public.notify_ticket_updated()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor uuid := auth.uid();
  actor_name text;
  status_label text := replace(new.status, '_', ' ');
begin
  if actor is null then
    return new;
  end if;
  select full_name into actor_name from profiles where id = actor;

  -- A claim changes assignment and status together; the assignment notice
  -- covers it, so status notices only fire on pure status changes.
  if new.assigned_to is distinct from old.assigned_to and new.assigned_to is not null then
    if new.assigned_to <> actor then
      insert into notifications (user_id, ticket_id, reference, body)
      values (new.assigned_to, new.id, new.reference,
              coalesce(actor_name, 'Someone') || ' assigned ' || new.reference || ' to you');
    elsif new.submitted_by <> actor then
      insert into notifications (user_id, ticket_id, reference, body)
      values (new.submitted_by, new.id, new.reference,
              coalesce(actor_name, 'Someone') || ' claimed your ticket ' || new.reference);
    end if;
  elsif new.status is distinct from old.status then
    if new.submitted_by <> actor then
      insert into notifications (user_id, ticket_id, reference, body)
      values (new.submitted_by, new.id, new.reference,
              'Your ticket ' || new.reference || ' moved to ' || status_label);
    end if;
    if new.assigned_to is not null
       and new.assigned_to <> actor
       and new.assigned_to <> new.submitted_by then
      insert into notifications (user_id, ticket_id, reference, body)
      values (new.assigned_to, new.id, new.reference,
              new.reference || ' moved to ' || status_label);
    end if;
  end if;

  return new;
end;
$$;

create or replace function public.notify_comment_added()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor uuid := auth.uid();
  actor_name text;
  t public.tickets;
begin
  if actor is null then
    return new;
  end if;
  select full_name into actor_name from profiles where id = actor;
  select * into t from tickets where id = new.ticket_id;

  if t.submitted_by <> actor then
    insert into notifications (user_id, ticket_id, reference, body)
    values (t.submitted_by, t.id, t.reference,
            coalesce(actor_name, 'Someone') || ' commented on ' || t.reference);
  end if;
  if t.assigned_to is not null
     and t.assigned_to <> actor
     and t.assigned_to <> t.submitted_by then
    insert into notifications (user_id, ticket_id, reference, body)
    values (t.assigned_to, t.id, t.reference,
            coalesce(actor_name, 'Someone') || ' commented on ' || t.reference);
  end if;

  return new;
end;
$$;

create trigger tickets_notify_created
  after insert on public.tickets
  for each row execute function public.notify_ticket_created();

create trigger tickets_notify_updated
  after update on public.tickets
  for each row execute function public.notify_ticket_updated();

create trigger comments_notify_added
  after insert on public.comments
  for each row execute function public.notify_comment_added();

-- Live updates over websockets. RLS still applies to what each subscriber sees.
alter publication supabase_realtime add table public.tickets;
alter publication supabase_realtime add table public.comments;
alter publication supabase_realtime add table public.notifications;

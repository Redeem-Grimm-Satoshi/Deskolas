-- Denormalize the account email onto profiles so it is readable under RLS (the
-- auth.users table is not). Used by the People screen and assignee displays.

alter table public.profiles add column email text;

update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id;

-- Recreate the sign-up handler to also store the email.
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

  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    ),
    new.email,
    matched.role
  );

  update public.invites set accepted_at = now() where email = matched.email;
  return new;
end;
$$;

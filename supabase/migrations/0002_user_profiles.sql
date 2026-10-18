create table public.user_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique
    check (username ~ '^[a-z0-9_]{3,32}$'),
  created_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

revoke all on table public.user_profiles from public, anon, authenticated;
grant select, insert, update, delete on table public.user_profiles to service_role;

create extension if not exists pgcrypto;

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 80),
  description text not null default '',
  color text not null default 'forest',
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, id)
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  project_id uuid,
  parent_task_id uuid,
  title text not null check (char_length(trim(title)) between 1 and 240),
  description text not null default '',
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, id),
  constraint tasks_project_owner_fk foreign key (user_id, project_id)
    references public.projects (user_id, id) on delete set null (project_id),
  constraint tasks_parent_owner_fk foreign key (user_id, parent_task_id)
    references public.tasks (user_id, id) on delete set null (parent_task_id),
  constraint tasks_not_own_parent check (parent_task_id is null or parent_task_id <> id)
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 40),
  created_at timestamptz not null default now(),
  unique (user_id, id),
  unique (user_id, name)
);

create table public.task_tags (
  user_id uuid not null references auth.users (id) on delete cascade,
  task_id uuid not null,
  tag_id uuid not null,
  primary key (task_id, tag_id),
  foreign key (user_id, task_id) references public.tasks (user_id, id) on delete cascade,
  foreign key (user_id, tag_id) references public.tags (user_id, id) on delete cascade
);

create index tasks_user_due_idx on public.tasks (user_id, due_at) where completed_at is null;
create index tasks_user_updated_idx on public.tasks (user_id, updated_at);
create index tasks_user_project_idx on public.tasks (user_id, project_id);

create or replace function public.prevent_task_parent_cycle()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.parent_task_id is null then
    return new;
  end if;

  if exists (
    with recursive ancestors(id, parent_task_id) as (
      select task.id, task.parent_task_id
      from public.tasks as task
      where task.id = new.parent_task_id
        and task.user_id = new.user_id
      union
      select parent.id, parent.parent_task_id
      from public.tasks as parent
      join ancestors on parent.id = ancestors.parent_task_id
      where parent.user_id = new.user_id
    )
    select 1 from ancestors where id = new.id
  ) then
    raise exception 'Task parent relationship would create a cycle';
  end if;

  return new;
end;
$$;

create trigger tasks_prevent_parent_cycle_insert
before insert on public.tasks
for each row execute function public.prevent_task_parent_cycle();

create trigger tasks_prevent_parent_cycle_update
before update of parent_task_id on public.tasks
for each row execute function public.prevent_task_parent_cycle();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create trigger tasks_set_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.tags enable row level security;
alter table public.task_tags enable row level security;

create policy "Users manage their own projects"
on public.projects for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users manage their own tasks"
on public.tasks for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users manage their own tags"
on public.tags for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users manage their own task tags"
on public.task_tags for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

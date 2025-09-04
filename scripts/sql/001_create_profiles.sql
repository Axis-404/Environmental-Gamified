-- Create enum for roles
do $$ begin
  create type public.user_role as enum ('student', 'teacher', 'ngo');
exception
  when duplicate_object then null;
end $$;

-- Create profiles table linked to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role public.user_role default 'student' not null,
  school text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at fresh
create or replace function public.tg_profiles_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists tg_profiles_updated_at on public.profiles;
create trigger tg_profiles_updated_at
before update on public.profiles
for each row execute function public.tg_profiles_updated_at();

-- Enable RLS
alter table public.profiles enable row level security;

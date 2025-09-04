-- Ensure org fields exist for class/school leaderboards without breaking existing data.
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'class_name'
  ) then
    alter table public.profiles add column class_name text;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'school_id'
  ) then
    -- If a schools table does not exist, create a minimal one.
    if not exists (
      select 1 from information_schema.tables
      where table_schema = 'public' and table_name = 'schools'
    ) then
      create table public.schools (
        id uuid primary key default gen_random_uuid(),
        name text not null,
        created_at timestamptz not null default now()
      );
      comment on table public.schools is 'Organizations/Institutions for grouping users';
    end if;

    alter table public.profiles add column school_id uuid references public.schools(id);
  end if;
end$$;

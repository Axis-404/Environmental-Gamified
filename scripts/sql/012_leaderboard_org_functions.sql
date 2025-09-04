-- Class leaderboard: sum of points by profiles.class_name (non-null)
create or replace function public.get_class_leaderboard(limit_rows int default 50)
returns table(class_name text, total_points bigint)
language sql
security definer
set search_path = public
as $$
  with joined as (
    select p.class_name, l.points
    from public.points_ledger l
    join public.profiles p on p.id = l.user_id
    where coalesce(trim(p.class_name), '') <> ''
  )
  select class_name, coalesce(sum(points), 0)::bigint as total_points
  from joined
  group by class_name
  order by total_points desc, class_name
  limit limit_rows
$$;

-- School leaderboard: sum of points by profiles.school_id (joins to schools for name)
create or replace function public.get_school_leaderboard(limit_rows int default 50)
returns table(school_id uuid, school_name text, total_points bigint)
language sql
security definer
set search_path = public
as $$
  with joined as (
    select p.school_id, s.name as school_name, l.points
    from public.points_ledger l
    join public.profiles p on p.id = l.user_id
    join public.schools s on s.id = p.school_id
  )
  select school_id, school_name, coalesce(sum(points), 0)::bigint as total_points
  from joined
  group by school_id, school_name
  order by total_points desc, school_name
  limit limit_rows
$$;

revoke all on function public.get_class_leaderboard(int) from public;
revoke all on function public.get_school_leaderboard(int) from public;
grant execute on function public.get_class_leaderboard(int) to authenticated;
grant execute on function public.get_school_leaderboard(int) to authenticated;

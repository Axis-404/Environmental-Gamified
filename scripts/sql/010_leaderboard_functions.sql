-- add RPC for user leaderboards (all-time / weekly) with SECURITY DEFINER for safe aggregation
create or replace function public.get_user_leaderboard(period text default 'all-time', limit_rows int default 50)
returns table(user_id uuid, total_points bigint)
language sql
security definer
set search_path = public
as $$
  with filtered as (
    select user_id, points, created_at
    from public.points_ledger
    where
      case
        when period = 'weekly' then created_at >= date_trunc('week', now())
        when period = 'monthly' then created_at >= date_trunc('month', now())
        else true
      end
  )
  select user_id, coalesce(sum(points), 0)::bigint as total_points
  from filtered
  group by user_id
  order by total_points desc, user_id
  limit limit_rows
$$;

-- Allow authenticated users to execute the RPC
revoke all on function public.get_user_leaderboard(text,int) from public;
grant execute on function public.get_user_leaderboard(text,int) to authenticated;

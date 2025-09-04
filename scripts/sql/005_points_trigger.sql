-- trigger to award points when a submission is approved

create or replace function public.award_points_on_approval()
returns trigger
language plpgsql
as $$
declare
  pts int;
begin
  -- Only act when moving into approved
  if (TG_OP = 'UPDATE' and NEW.status = 'approved' and (OLD.status is distinct from 'approved')) then
    select c.points into pts from public.challenges c where c.id = NEW.challenge_id;
    if pts is null then
      pts := 0;
    end if;

    -- Append to ledger
    insert into public.points_ledger (user_id, source, challenge_id, submission_id, delta, reason)
    values (NEW.user_id, 'challenge', NEW.challenge_id, NEW.id, pts, 'Approved submission');

  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_award_points_on_approval on public.submissions;
create trigger trg_award_points_on_approval
after update of status on public.submissions
for each row
execute function public.award_points_on_approval();

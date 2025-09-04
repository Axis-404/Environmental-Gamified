-- Assumes a 'profiles' table with 'user_id' and 'role' in ('student','teacher','ngo').

-- Allow reviewers to select pending submissions from their scope (for simplicity, global in this MVP).
drop policy if exists "submissions_select_reviewer" on public.submissions;
create policy "submissions_select_reviewer"
on public.submissions
for select
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid()
      and p.role in ('teacher','ngo')
  )
  or user_id = auth.uid() -- owners can also read theirs
);

-- Allow reviewers to update status and moderation fields.
drop policy if exists "submissions_update_reviewer" on public.submissions;
create policy "submissions_update_reviewer"
on public.submissions
for update
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid()
      and p.role in ('teacher','ngo')
  )
)
with check (
  -- Only allow changing moderation fields here; leave other fields protected by column-level permissions if configured.
  true
);

-- RLS policies for core tables

-- Helper checks (inline using profiles.role)
-- Schools
drop policy if exists "schools_select_all" on public.schools;
create policy "schools_select_all" on public.schools
for select to authenticated
using (true);

drop policy if exists "schools_manage_teacher_ngo" on public.schools;
create policy "schools_manage_teacher_ngo" on public.schools
for all to authenticated
using (
  exists(select 1 from public.profiles p where p.id = auth.uid() and p.role in ('teacher','ngo'))
)
with check (
  exists(select 1 from public.profiles p where p.id = auth.uid() and p.role in ('teacher','ngo'))
);

-- Challenges
drop policy if exists "challenges_select_active" on public.challenges;
create policy "challenges_select_active" on public.challenges
for select to authenticated
using (active = true or created_by = auth.uid());

drop policy if exists "challenges_crud_teacher_ngo" on public.challenges;
create policy "challenges_crud_teacher_ngo" on public.challenges
for all to authenticated
using (
  created_by = auth.uid()
  and exists(select 1 from public.profiles p where p.id = auth.uid() and p.role in ('teacher','ngo'))
)
with check (
  created_by = auth.uid()
  and exists(select 1 from public.profiles p where p.id = auth.uid() and p.role in ('teacher','ngo'))
);

-- Submissions: users manage own submissions; teachers/NGOs can review
drop policy if exists "submissions_select_own_or_reviewer" on public.submissions;
create policy "submissions_select_own_or_reviewer" on public.submissions
for select to authenticated
using (
  user_id = auth.uid()
  or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role in ('teacher','ngo'))
);

drop policy if exists "submissions_insert_own" on public.submissions;
create policy "submissions_insert_own" on public.submissions
for insert to authenticated
with check (user_id = auth.uid());

-- Allow users to update their own submission only while pending (e.g., fix evidence)
drop policy if exists "submissions_update_own_pending" on public.submissions;
create policy "submissions_update_own_pending" on public.submissions
for update to authenticated
using (user_id = auth.uid() and status = 'pending')
with check (user_id = auth.uid());

-- Allow teachers/NGOs to review (update status, reviewer fields)
drop policy if exists "submissions_review_teacher_ngo" on public.submissions;
create policy "submissions_review_teacher_ngo" on public.submissions
for update to authenticated
using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role in ('teacher','ngo')))
with check (true);

-- Points ledger: users can read their own, can append own entries (kept for flexibility)
drop policy if exists "points_ledger_select_own" on public.points_ledger;
create policy "points_ledger_select_own" on public.points_ledger
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "points_ledger_insert_own" on public.points_ledger;
create policy "points_ledger_insert_own" on public.points_ledger
for insert to authenticated
with check (user_id = auth.uid());

-- Badges catalog: visible to all; managed by teacher/NGO
drop policy if exists "badges_select_all" on public.badges;
create policy "badges_select_all" on public.badges
for select to authenticated
using (true);

drop policy if exists "badges_manage_teacher_ngo" on public.badges;
create policy "badges_manage_teacher_ngo" on public.badges
for all to authenticated
using (
  created_by = auth.uid()
  and exists(select 1 from public.profiles p where p.id = auth.uid() and p.role in ('teacher','ngo'))
)
with check (
  created_by = auth.uid()
  and exists(select 1 from public.profiles p where p.id = auth.uid() and p.role in ('teacher','ngo'))
);

-- Awarded badges: users can see their own, teacher/NGO can award
drop policy if exists "badges_awarded_select_own" on public.badges_awarded;
create policy "badges_awarded_select_own" on public.badges_awarded
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "badges_awarded_insert_teacher_ngo" on public.badges_awarded;
create policy "badges_awarded_insert_teacher_ngo" on public.badges_awarded
for insert to authenticated
with check (
  exists(select 1 from public.profiles p where p.id = auth.uid() and p.role in ('teacher','ngo'))
);

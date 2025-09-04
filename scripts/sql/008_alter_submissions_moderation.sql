-- Adds moderation status, reviewer fields, and anti-cheat metadata.

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'submissions' and column_name = 'status'
  ) then
    alter table public.submissions
      add column status text not null default 'pending' check (status in ('pending','approved','rejected')),
      add column reviewed_by uuid references auth.users(id),
      add column reviewed_at timestamptz,
      add column exif_has_gps boolean,
      add column exif_captured_at timestamptz,
      add column phash text, -- hex string of 64-bit hash
      add column qr_verified boolean,
      add column geo_verified boolean;
  end if;
end$$;

comment on column public.submissions.status is 'Moderation status of submission';
comment on column public.submissions.phash is 'Perceptual hash (hex) for duplicate detection';

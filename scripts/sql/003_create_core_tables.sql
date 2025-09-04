-- create core tables: schools, challenges, submissions, points_ledger, badges, badges_awarded, enums

-- Enums
do $$ begin
  create type public.submission_status as enum ('pending','approved','rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.verification_type as enum ('photo','qr','geo','quiz');
exception when duplicate_object then null; end $$;

-- Schools
create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  state text,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Challenges (tasks)
create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null,
  description text,
  points int not null default 10 check (points >= 0),
  verification public.verification_type not null default 'photo',
  active boolean not null default true,
  school_id uuid references public.schools(id) on delete set null,
  created_by uuid not null references auth.users(id) on delete cascade,
  start_at timestamptz,
  end_at timestamptz,
  created_at timestamptz not null default now()
);

-- Submissions
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status public.submission_status not null default 'pending',
  evidence_url text,
  exif jsonb,
  latitude double precision,
  longitude double precision,
  qr_code text,
  reviewer_id uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  review_comment text,
  created_at timestamptz not null default now()
);
create index if not exists submissions_user_id_idx on public.submissions(user_id);
create index if not exists submissions_challenge_id_idx on public.submissions(challenge_id);
create index if not exists submissions_status_idx on public.submissions(status);

-- Points ledger (append-only)
create table if not exists public.points_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source text not null default 'challenge',
  challenge_id uuid references public.challenges(id) on delete set null,
  submission_id uuid references public.submissions(id) on delete set null,
  delta int not null,
  reason text,
  created_at timestamptz not null default now()
);
create index if not exists points_ledger_user_idx on public.points_ledger(user_id);

-- Badges catalog
create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  icon text, -- could be an emoji or icon name
  active boolean not null default true,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Awarded badges
create table if not exists public.badges_awarded (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  reason text,
  awarded_at timestamptz not null default now(),
  unique (user_id, badge_id)
);

-- Enable RLS
alter table public.schools enable row level security;
alter table public.challenges enable row level security;
alter table public.submissions enable row level security;
alter table public.points_ledger enable row level security;
alter table public.badges enable row level security;
alter table public.badges_awarded enable row level security;

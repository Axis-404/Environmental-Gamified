-- no-op rewrite after read-before-write fix; keeping idempotent column addition as-is.
-- add optional QR secret to challenges for QR verification
alter table public.challenges
add column if not exists qr_secret text;

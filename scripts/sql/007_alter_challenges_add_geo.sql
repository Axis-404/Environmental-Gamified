-- no-op rewrite after read-before-write fix; keeping idempotent column additions as-is.
-- add optional geofence center and radius to challenges for geo verification
alter table public.challenges
add column if not exists geo_lat double precision,
add column if not exists geo_lng double precision,
add column if not exists geo_radius_m int;

-- Run once in the SQL Editor of your own new Supabase project.
-- Intentionally fails if bookings already exists, rather than changing an existing table.
begin;

create table public.bookings (
    id uuid primary key default gen_random_uuid(),
    name text not null check (char_length(name) between 1 and 100),
    email text not null check (char_length(email) between 1 and 254),
    phone text not null check (char_length(phone) between 7 and 30),
    treatment text not null check (treatment in ('general-dentistry', 'teeth-whitening', 'clear-aligners', 'dental-implants', 'not-sure')),
    preferred_date date not null,
    preferred_time text not null check (preferred_time in ('Morning', 'Midday', 'Afternoon', 'Late afternoon')),
    message text not null default '' check (char_length(message) <= 2000),
    consent boolean not null check (consent = true),
    status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
    created_at timestamptz not null default now()
);

alter table public.bookings enable row level security;
revoke all on table public.bookings from public, anon, authenticated, service_role;
grant usage on schema public to service_role;
grant insert on table public.bookings to service_role;
-- No public policies: all booking writes go through the validated Next.js API.
-- Inserts do not select/return rows, so this flow does not need SELECT permission.

commit;

-- Car test-drive bookings linked to dealership and car
create table if not exists public.car_bookings (
  id uuid primary key default gen_random_uuid(),
  dealership_id uuid not null references public.dealerships(id) on delete cascade,
  car_id uuid not null references public.cars(id) on delete cascade,
  car_label text not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  preferred_date date not null,
  source text not null default 'test_drive_form',
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_car_bookings_dealership_created
  on public.car_bookings (dealership_id, created_at desc);

create index if not exists idx_car_bookings_car_created
  on public.car_bookings (car_id, created_at desc);

alter table public.car_bookings enable row level security;

-- Public users can submit booking requests from the storefront form
drop policy if exists "Anyone can create car bookings"
  on public.car_bookings;
create policy "Anyone can create car bookings"
  on public.car_bookings
  for insert
  to anon, authenticated
  with check (true);

-- Only the dealership owner can view bookings for their dealership
drop policy if exists "Owner can read dealership bookings"
  on public.car_bookings;
create policy "Owner can read dealership bookings"
  on public.car_bookings
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.dealerships d
      where d.id = car_bookings.dealership_id
        and d.owner_email = auth.email()
    )
  );

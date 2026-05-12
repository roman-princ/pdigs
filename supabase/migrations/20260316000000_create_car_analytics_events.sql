create table if not exists public.car_analytics_events (
  id uuid primary key default gen_random_uuid(),
  dealership_id uuid not null references public.dealerships(id) on delete cascade,
  car_id uuid not null references public.cars(id) on delete cascade,
  car_label text not null,
  event_type text not null check (event_type in ('impression', 'testDriveBooking', 'depositIntent')),
  created_at timestamptz not null default now()
);

create index if not exists idx_car_analytics_events_dealership_created
  on public.car_analytics_events (dealership_id, created_at desc);

create index if not exists idx_car_analytics_events_car_created
  on public.car_analytics_events (car_id, created_at desc);

alter table public.car_analytics_events enable row level security;

-- Storefront visitors can emit analytics events
drop policy if exists "Anyone can insert analytics events"
  on public.car_analytics_events;
create policy "Anyone can insert analytics events"
  on public.car_analytics_events
  for insert
  to anon, authenticated
  with check (true);

-- Only dealership owners can read and reset their analytics
drop policy if exists "Owner can read dealership analytics events"
  on public.car_analytics_events;
create policy "Owner can read dealership analytics events"
  on public.car_analytics_events
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.dealerships d
      where d.id = car_analytics_events.dealership_id
        and d.owner_email = auth.email()
    )
  );

drop policy if exists "Owner can delete dealership analytics events"
  on public.car_analytics_events;
create policy "Owner can delete dealership analytics events"
  on public.car_analytics_events
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.dealerships d
      where d.id = car_analytics_events.dealership_id
        and d.owner_email = auth.email()
    )
  );

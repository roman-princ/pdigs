-- Enable RLS and add policies for dealerships and cars tables.
-- Ownership model: dealerships.owner_email matches auth.email().
-- Cars belong to a dealership; access is derived from that dealership's owner.

alter table public.dealerships enable row level security;
alter table public.cars enable row level security;

-- ── dealerships ────────────────────────────────────────────────────────────

-- Storefront and discover pages need public read access.
drop policy if exists "Anyone can read dealerships"
  on public.dealerships;
create policy "Anyone can read dealerships"
  on public.dealerships
  for select
  to anon, authenticated
  using (true);

-- An authenticated user can register a dealership, but only under their own email.
drop policy if exists "Authenticated can create own dealership"
  on public.dealerships;
create policy "Authenticated can create own dealership"
  on public.dealerships
  for insert
  to authenticated
  with check (owner_email = auth.email());

-- Only the owner can update their dealership, and cannot reassign ownership.
drop policy if exists "Owner can update dealership"
  on public.dealerships;
create policy "Owner can update dealership"
  on public.dealerships
  for update
  to authenticated
  using (owner_email = auth.email())
  with check (owner_email = auth.email());

-- Only the owner can delete their dealership.
drop policy if exists "Owner can delete dealership"
  on public.dealerships;
create policy "Owner can delete dealership"
  on public.dealerships
  for delete
  to authenticated
  using (owner_email = auth.email());

-- ── cars ───────────────────────────────────────────────────────────────────

-- Storefront listings are public.
drop policy if exists "Anyone can read cars"
  on public.cars;
create policy "Anyone can read cars"
  on public.cars
  for select
  to anon, authenticated
  using (true);

-- Only the dealership owner can add cars to their inventory.
drop policy if exists "Owner can insert cars"
  on public.cars;
create policy "Owner can insert cars"
  on public.cars
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.dealerships d
      where d.id = cars.dealership_id
        and d.owner_email = auth.email()
    )
  );

-- Only the dealership owner can edit their cars, and cannot move a car to another dealership.
drop policy if exists "Owner can update cars"
  on public.cars;
create policy "Owner can update cars"
  on public.cars
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.dealerships d
      where d.id = cars.dealership_id
        and d.owner_email = auth.email()
    )
  )
  with check (
    exists (
      select 1
      from public.dealerships d
      where d.id = cars.dealership_id
        and d.owner_email = auth.email()
    )
  );

-- Only the dealership owner can delete their cars.
drop policy if exists "Owner can delete cars"
  on public.cars;
create policy "Owner can delete cars"
  on public.cars
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.dealerships d
      where d.id = cars.dealership_id
        and d.owner_email = auth.email()
    )
  );

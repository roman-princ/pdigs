-- Seed data: one admin user, one dealership, cars, bookings, analytics events.
-- Login: admin@pdigs.test / AdminPass123!

do $$
declare
  v_admin_id uuid := '00000000-0000-0000-0000-0000000000aa';
  v_dealership_id uuid := '00000000-0000-0000-0000-0000000000d1';
  v_car_1 uuid := '00000000-0000-0000-0000-0000000000c1';
  v_car_2 uuid := '00000000-0000-0000-0000-0000000000c2';
  v_car_3 uuid := '00000000-0000-0000-0000-0000000000c3';
  v_car_4 uuid := '00000000-0000-0000-0000-0000000000c4';
  v_car_5 uuid := '00000000-0000-0000-0000-0000000000c5';
  v_car_6 uuid := '00000000-0000-0000-0000-0000000000c6';
begin
  -- ── Admin user (Supabase auth) ───────────────────────────────────────────
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, recovery_token,
    email_change_token_new, email_change, is_super_admin
  ) values (
    '00000000-0000-0000-0000-000000000000',
    v_admin_id, 'authenticated', 'authenticated',
    'admin@pdigs.test', extensions.crypt('AdminPass123!', extensions.gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
    '{}'::jsonb,
    now(), now(), '', '', '', '', false
  );

  insert into auth.identities (
    id, user_id, identity_data, provider, provider_id,
    last_sign_in_at, created_at, updated_at
  ) values (
    gen_random_uuid(), v_admin_id,
    jsonb_build_object('sub', v_admin_id::text, 'email', 'admin@pdigs.test', 'email_verified', true),
    'email', v_admin_id::text,
    now(), now(), now()
  );

  -- ── Dealership ───────────────────────────────────────────────────────────
  insert into public.dealerships (
    id, name, slug, owner_email, logo_url,
    primary_color, secondary_color, hero_title, hero_subtitle,
    phone, address, about_us
  ) values (
    v_dealership_id,
    'Riverside Motors', 'riverside', 'admin@pdigs.test', null,
    '#2563eb', '#f97316',
    'Drive Something You Love',
    'Hand-picked European and Japanese cars, fully inspected and ready for the road.',
    '+420 777 123 456',
    'Vinohradská 1024/12, 120 00 Praha 2',
    'Riverside Motors has been matching drivers with their next car since 2014. Every vehicle in our showroom goes through a 120-point inspection, comes with a 12-month warranty, and is delivered detailed and ready to drive away.'
  );

  -- ── Cars ─────────────────────────────────────────────────────────────────
  insert into public.cars (
    id, dealership_id, brand, model, year, price, mileage,
    fuel, transmission, power, color, condition, description, images, features
  ) values
    (v_car_1, v_dealership_id, 'BMW', '330i xDrive', 2023, 49900, 18500,
     'Petrol', 'Automatic', 258, 'Alpine White', 'Certified Pre-Owned',
     'Recent service, full BMW history, M Sport package with adaptive suspension.',
     array[
       'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200',
       'https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200'
     ],
     array['M Sport Package','Adaptive Cruise','Harman Kardon','Heated Seats','HUD']),

    (v_car_2, v_dealership_id, 'Audi', 'Q5 45 TFSI', 2022, 47500, 32100,
     'Petrol', 'Automatic', 265, 'Mythos Black', 'Used',
     'Single owner, full Audi service history, S-Line exterior and interior.',
     array[
       'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200',
       'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1200'
     ],
     array['Virtual Cockpit','Matrix LED','Panoramic Roof','Bang & Olufsen','Tow Hitch']),

    (v_car_3, v_dealership_id, 'Tesla', 'Model 3 Long Range', 2024, 52400, 6200,
     'Electric', 'Automatic', 366, 'Pearl White', 'New',
     'Brand new with Enhanced Autopilot. AWD, 0-100 in 4.4s, 600+ km range.',
     array[
       'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200',
       'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200'
     ],
     array['Enhanced Autopilot','Glass Roof','Premium Audio','Heated Steering','HEPA Filter']),

    (v_car_4, v_dealership_id, 'Volkswagen', 'Golf 8 GTI', 2023, 36900, 12400,
     'Petrol', 'Manual', 245, 'Tornado Red', 'Used',
     'Manual transmission, performance pack, recent tires and brakes.',
     array[
       'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=1200'
     ],
     array['Performance Pack','DCC Suspension','Digital Cockpit','Harman Kardon']),

    (v_car_5, v_dealership_id, 'Toyota', 'RAV4 Hybrid', 2023, 38200, 21800,
     'Hybrid', 'Automatic', 222, 'Silver Sky', 'Used',
     'AWD hybrid, 4.5L/100km combined, full Toyota Safety Sense suite.',
     array[
       'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=1200'
     ],
     array['AWD','Toyota Safety Sense','Wireless CarPlay','Power Tailgate']),

    (v_car_6, v_dealership_id, 'Porsche', '911 Carrera', 2021, 119000, 28400,
     'Petrol', 'Automatic', 385, 'GT Silver', 'Certified Pre-Owned',
     'PDK, Sport Chrono, ceramic brakes. Porsche Approved warranty included.',
     array[
       'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200',
       'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200'
     ],
     array['Sport Chrono','Ceramic Brakes','BOSE Surround','Sport Exhaust','PASM']);

  -- ── Bookings ─────────────────────────────────────────────────────────────
  insert into public.car_bookings (
    dealership_id, car_id, car_label,
    customer_name, customer_email, customer_phone,
    preferred_date, source, notes, created_at
  ) values
    (v_dealership_id, v_car_1, 'BMW 330i xDrive (2023)',
     'Jakub Novák', 'jakub.novak@example.com', '+420 602 100 200',
     current_date + 3, 'test_drive_form',
     'Would like to test in the afternoon.', now() - interval '2 days'),

    (v_dealership_id, v_car_3, 'Tesla Model 3 Long Range (2024)',
     'Marie Dvořáková', 'marie.dvorakova@example.com', '+420 728 555 110',
     current_date + 5, 'test_drive_form',
     null, now() - interval '20 hours'),

    (v_dealership_id, v_car_6, 'Porsche 911 Carrera (2021)',
     'Tomáš Bartoš', 'tomas.bartos@example.com', '+420 776 998 700',
     current_date + 7, 'test_drive_form',
     'Trade-in: Cayman GTS 2018, 42k km.', now() - interval '4 hours');

  -- ── Analytics events ─────────────────────────────────────────────────────
  -- Impressions across all cars over the last 14 days.
  insert into public.car_analytics_events (dealership_id, car_id, car_label, event_type, created_at)
  select v_dealership_id, c.id, c.label, 'impression',
         now() - (random() * interval '14 days')
  from (values
    (v_car_1, 'BMW 330i xDrive (2023)', 42),
    (v_car_2, 'Audi Q5 45 TFSI (2022)', 28),
    (v_car_3, 'Tesla Model 3 Long Range (2024)', 91),
    (v_car_4, 'Volkswagen Golf 8 GTI (2023)', 35),
    (v_car_5, 'Toyota RAV4 Hybrid (2023)', 24),
    (v_car_6, 'Porsche 911 Carrera (2021)', 67)
  ) as c(id, label, n)
  cross join generate_series(1, c.n);

  -- Test-drive booking events mirroring the three bookings above.
  insert into public.car_analytics_events (dealership_id, car_id, car_label, event_type, created_at) values
    (v_dealership_id, v_car_1, 'BMW 330i xDrive (2023)', 'testDriveBooking', now() - interval '2 days'),
    (v_dealership_id, v_car_3, 'Tesla Model 3 Long Range (2024)', 'testDriveBooking', now() - interval '20 hours'),
    (v_dealership_id, v_car_6, 'Porsche 911 Carrera (2021)', 'testDriveBooking', now() - interval '4 hours');

  -- A couple of deposit intents on the headline cars.
  insert into public.car_analytics_events (dealership_id, car_id, car_label, event_type, created_at) values
    (v_dealership_id, v_car_3, 'Tesla Model 3 Long Range (2024)', 'depositIntent', now() - interval '3 days'),
    (v_dealership_id, v_car_6, 'Porsche 911 Carrera (2021)', 'depositIntent', now() - interval '1 day');
end $$;

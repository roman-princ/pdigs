alter table public.car_bookings
  add constraint car_bookings_preferred_date_not_past
  check (preferred_date >= current_date)
  not valid;

alter table public.car_bookings
  validate constraint car_bookings_preferred_date_not_past;
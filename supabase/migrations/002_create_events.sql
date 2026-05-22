create table if not exists public.events (
  id bigserial primary key,
  title text not null,
  date date,
  outfit_id bigint,
  location text,
  notes text,
  user_id uuid,
  created_at timestamptz default now()
);

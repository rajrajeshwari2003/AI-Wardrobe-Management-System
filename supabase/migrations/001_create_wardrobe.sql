create table if not exists public.wardrobe (
  id bigserial primary key,
  name text not null,
  category text,
  color text,
  image_url text,
  notes text,
  tags text[],
  times_used int default 0,
  last_used date,
  user_id uuid,
  created_at timestamptz default now()
);

CREATE TABLE temperature (
  temperature numeric not null,
  location text not null,
  recorded_at timestamptz not null default now()
);

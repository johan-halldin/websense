CREATE TABLE cities (
  id serial PRIMARY KEY,
  name text NOT NULL,
  country text NOT NULL,
  lat double precision NOT NULL,
  lon double precision NOT NULL,
  probe_id integer NOT NULL UNIQUE,
  measurement_id integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

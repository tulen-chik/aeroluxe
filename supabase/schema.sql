-- Create tables for our airline booking system

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name text NULL,
  phone_number text NULL,
  birth_date date NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Flights table
CREATE TABLE public.flights (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  flight_number text NOT NULL UNIQUE,  -- Unique constraint added
  departure_city text NOT NULL,
  arrival_city text NOT NULL,
  departure_time timestamp with time zone NOT NULL,
  arrival_time timestamp with time zone NOT NULL,
  price numeric(10,2) NOT NULL,  -- Changed decimal to numeric for consistency
  available_seats integer NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  aircraft_type text NULL,  -- Optional field
  gate text NULL,           -- Optional field
  status text NULL,         -- Optional field
  terminal text NULL        -- Optional field
);

-- Bookings table
CREATE TABLE public.bookings (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  flight_id uuid REFERENCES public.flights(id) ON DELETE CASCADE NOT NULL,
  booking_status text NOT NULL,
  payment_status text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  seat_number text NULL,      -- Optional field
  service_tier text NULL,     -- Optional field
  service_price numeric(10,2) NULL,  -- Optional field
  total_price numeric(10,2) NULL,     -- Optional field
  additional_services jsonb NULL  -- Using JSONB to store additional services
);

-- Cities table
CREATE TABLE public.cities (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  country text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


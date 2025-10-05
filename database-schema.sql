-- Database Schema Export for Jakarta Apartments
-- Generated on: 2025-10-05
-- This file contains only the database structure (no data)

-- ================================================
-- ENUMS
-- ================================================

CREATE TYPE app_role AS ENUM ('admin', 'user');

-- ================================================
-- TABLES
-- ================================================

-- Locations Table
CREATE TABLE public.locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  slug TEXT,
  units_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Units Table
CREATE TABLE public.units (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID NOT NULL,
  type TEXT NOT NULL,
  name TEXT,
  unit_name TEXT,
  slug TEXT,
  description TEXT,
  price_per_month NUMERIC,
  price_per_night NUMERIC,
  available BOOLEAN DEFAULT true,
  image_url TEXT,
  images TEXT[],
  features TEXT[],
  view TEXT,
  floor TEXT,
  building TEXT,
  tower TEXT,
  map_embed_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User Roles Table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================

-- Enable RLS on all tables
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Locations Policies
CREATE POLICY "Anyone can view locations" 
  ON public.locations 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can insert locations" 
  ON public.locations 
  FOR INSERT 
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update locations" 
  ON public.locations 
  FOR UPDATE 
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete locations" 
  ON public.locations 
  FOR DELETE 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Units Policies
CREATE POLICY "Anyone can view units" 
  ON public.units 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can insert units" 
  ON public.units 
  FOR INSERT 
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update units" 
  ON public.units 
  FOR UPDATE 
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete units" 
  ON public.units 
  FOR DELETE 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- User Roles Policies
CREATE POLICY "Users can view own roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- ================================================
-- FUNCTIONS
-- ================================================

-- Function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- ================================================
-- INDEXES (optional but recommended)
-- ================================================

-- Add indexes for better query performance
CREATE INDEX idx_units_location_id ON public.units(location_id);
CREATE INDEX idx_units_available ON public.units(available);
CREATE INDEX idx_locations_slug ON public.locations(slug);
CREATE INDEX idx_units_slug ON public.units(slug);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);

-- ================================================
-- NOTES
-- ================================================

-- This schema supports:
-- - Multiple locations with detailed information
-- - Units associated with locations
-- - Role-based access control (admin/user)
-- - Row Level Security for data protection
-- - Automatic timestamp updates
-- - Flexible pricing (monthly and nightly rates)
-- - Multiple images per unit
-- - Customizable features and amenities

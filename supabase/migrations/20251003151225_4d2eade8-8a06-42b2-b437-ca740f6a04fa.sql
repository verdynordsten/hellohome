-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy: admins can view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policy: users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create locations table
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  units_count INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- RLS policies for locations
CREATE POLICY "Anyone can view locations"
ON public.locations
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Admins can insert locations"
ON public.locations
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update locations"
ON public.locations
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete locations"
ON public.locations
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create units table
CREATE TABLE public.units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  floor TEXT,
  building TEXT,
  tower TEXT,
  features TEXT[],
  image_url TEXT,
  price_per_month DECIMAL(10, 2),
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

-- RLS policies for units
CREATE POLICY "Anyone can view units"
ON public.units
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Admins can insert units"
ON public.units
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update units"
ON public.units
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete units"
ON public.units
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_locations_updated_at
BEFORE UPDATE ON public.locations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_units_updated_at
BEFORE UPDATE ON public.units
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
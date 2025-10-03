
-- Add missing columns to units table for consistency with frontend
ALTER TABLE public.units 
ADD COLUMN IF NOT EXISTS unit_name TEXT,
ADD COLUMN IF NOT EXISTS view TEXT,
ADD COLUMN IF NOT EXISTS price_per_night NUMERIC,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS images TEXT[];

-- Add comment for clarity
COMMENT ON COLUMN public.units.unit_name IS 'Display name for the unit (e.g., "Unit 1205", "House 1")';
COMMENT ON COLUMN public.units.view IS 'View from the unit (e.g., "City View", "Ocean View", "Garden View")';
COMMENT ON COLUMN public.units.price_per_night IS 'Price per night in local currency';
COMMENT ON COLUMN public.units.images IS 'Array of image URLs for the unit gallery';

-- Add slug column to locations table
ALTER TABLE public.locations 
ADD COLUMN slug text UNIQUE;

-- Create index for faster slug lookups
CREATE INDEX idx_locations_slug ON public.locations(slug);

-- Update existing locations with slugs based on their names
UPDATE public.locations 
SET slug = CASE 
  WHEN name = 'Senayan City' THEN 'senayan-city'
  WHEN name = 'Sudirman Plaza' THEN 'sudirman-plaza'
  WHEN name = 'Kuningan Residence' THEN 'kuningan-residence'
  WHEN name = 'House Rental Jakarta' THEN 'house-rental-jakarta'
  ELSE lower(replace(name, ' ', '-'))
END
WHERE slug IS NULL;
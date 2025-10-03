-- Add name and slug columns to units table
ALTER TABLE public.units 
ADD COLUMN name text,
ADD COLUMN slug text UNIQUE;

-- Create index for faster slug lookups
CREATE INDEX idx_units_slug ON public.units(slug);

-- Update existing units with names and slugs, ensuring uniqueness
UPDATE public.units 
SET 
  name = COALESCE(unit_name, type || ' - Floor ' || COALESCE(floor, 'N/A')),
  slug = lower(
    regexp_replace(
      COALESCE(unit_name, type || '-floor-' || COALESCE(floor, 'na')) || '-' || substring(id::text from 1 for 8),
      '[^a-z0-9-]+',
      '-',
      'g'
    )
  )
WHERE slug IS NULL;
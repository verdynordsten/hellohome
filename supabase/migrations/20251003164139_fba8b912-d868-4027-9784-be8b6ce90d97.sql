-- Add map_embed_url column to units table
ALTER TABLE public.units 
ADD COLUMN map_embed_url text;

COMMENT ON COLUMN public.units.map_embed_url IS 'Google Maps embed iframe URL for the unit location';

-- Update existing units with sample Google Maps embed URLs
UPDATE public.units 
SET map_embed_url = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7932.831148530382!2d106.80901497602464!3d-6.208790312649538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f4029ddcb01d%3A0x8c45c69b461fb15e!2sCitywalk%20Sudirman%20Jakarta!5e0!3m2!1sen!2skh!4v1759509443179!5m2!1sen!2skh'
WHERE building = 'Sudirman Suites';

UPDATE public.units 
SET map_embed_url = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2863049899887!2d106.8208!3d-6.2246!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e5c0d7e3df%3A0x5f9a0d9a0d9a0d9a!2sSenayan%20City!5e0!3m2!1sen!2sid!4v1234567890'
WHERE location_id = (SELECT id FROM locations WHERE slug = 'senayan-city');

UPDATE public.units 
SET map_embed_url = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.5267!2d106.8264!3d-6.2096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3f3c0d7e3df%3A0x5f9a0d9a0d9a0d9b!2sKuningan!5e0!3m2!1sen!2sid!4v1234567891'
WHERE location_id = (SELECT id FROM locations WHERE slug = 'kuningan-residence');

UPDATE public.units 
SET map_embed_url = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.3456!2d106.8234!3d-6.2156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e6c0d7e3df%3A0x5f9a0d9a0d9a0d9c!2sMenteng!5e0!3m2!1sen!2sid!4v1234567892'
WHERE location_id = (SELECT id FROM locations WHERE slug = 'house-rental-jakarta');
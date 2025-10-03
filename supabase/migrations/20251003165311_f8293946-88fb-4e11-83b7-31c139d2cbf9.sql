-- Add 8 new locations
INSERT INTO public.locations (id, name, description, image_url, units_count, slug) VALUES
('e1f2a3b4-c5d6-4e5f-0a1b-2c3d4e5f6a7b', 'Kemang Village', 'Exclusive residential complex in trendy Kemang area, known for its international community and upscale lifestyle. Close to cafes, restaurants, and embassies.', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 20, 'kemang-village'),
('f2a3b4c5-d6e7-4f5a-1b2c-3d4e5f6a7b8c', 'Pondok Indah Residence', 'Premium gated community in South Jakarta with world-class facilities. Perfect for families seeking security and comfort near international schools.', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 20, 'pondok-indah-residence'),
('a3b4c5d6-e7f8-4a5b-2c3d-4e5f6a7b8c9d', 'Menteng Park', 'Historic and prestigious neighborhood with colonial architecture. Home to embassies and Jakarta elite. Lush green environment.', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 20, 'menteng-park'),
('b4c5d6e7-f8a9-4b5c-3d4e-5f6a7b8c9d0e', 'Pacific Place Residences', 'Ultra-luxury high-rise living connected to Pacific Place Mall. Stunning city views and 5-star hotel services in SCBD business district.', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 20, 'pacific-place-residences'),
('c5d6e7f8-a9b0-4c5d-4e5f-6a7b8c9d0e1f', 'Thamrin Executive', 'Prime location on Jalan Thamrin, Jakarta main boulevard. Modern apartments with easy access to MRT and business centers.', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 20, 'thamrin-executive'),
('d6e7f8a9-b0c1-4d5e-5f6a-7b8c9d0e1f2a', 'Pantai Indah Kapuk', 'Waterfront living with international community. Features modern high-rises, golf courses, and beachfront access in North Jakarta.', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 20, 'pantai-indah-kapuk'),
('e7f8a9b0-c1d2-4e5f-6a7b-8c9d0e1f2a3b', 'Kebayoran Baru', 'Established residential area with tree-lined streets. Mix of modern apartments and classic houses near Blok M and business districts.', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 20, 'kebayoran-baru'),
('f8a9b0c1-d2e3-4f5a-7b8c-9d0e1f2a3b4c', 'Kelapa Gading Square', 'Chinese heritage area with modern shopping malls and entertainment. Diverse food scene and family-friendly environment in East Jakarta.', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 20, 'kelapa-gading-square');

-- Add 20 units for each location using generate_series for efficiency
-- Kemang Village (20 units)
INSERT INTO public.units (location_id, type, floor, building, tower, view, features, images, price_per_night, price_per_month, description, name, unit_name, slug, map_embed_url)
SELECT 
  'e1f2a3b4-c5d6-4e5f-0a1b-2c3d4e5f6a7b',
  CASE (s % 3)
    WHEN 0 THEN 'Studio'
    WHEN 1 THEN '1 Bedroom'
    ELSE '2 Bedroom'
  END,
  (5 + (s % 20))::text,
  'Kemang Icon',
  CASE (s % 2) WHEN 0 THEN 'Tower A' ELSE 'Tower B' END,
  CASE (s % 4) WHEN 0 THEN 'City View' WHEN 1 THEN 'Garden View' WHEN 2 THEN 'Pool View' ELSE 'Park View' END,
  ARRAY['WiFi', 'Smart TV', 'AC', 'Kitchen', 'Gym', 'Pool', 'Security 24/7'],
  ARRAY[
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800',
    'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800'
  ],
  500000 + (s * 10000),
  13000000 + (s * 200000),
  'Modern apartment in trendy Kemang area with complete facilities. Walking distance to cafes, restaurants, and international community.',
  'Kemang Unit ' || s,
  'KV-' || LPAD(s::text, 3, '0'),
  'kemang-unit-' || s,
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.9!2d106.816!3d-6.265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f1e5!2sKemang!5e0!3m2!1sen!2sid'
FROM generate_series(1, 20) AS s;

-- Pondok Indah Residence (20 units)
INSERT INTO public.units (location_id, type, floor, building, tower, view, features, images, price_per_night, price_per_month, description, name, unit_name, slug, map_embed_url)
SELECT 
  'f2a3b4c5-d6e7-4f5a-1b2c-3d4e5f6a7b8c',
  CASE (s % 4) WHEN 0 THEN 'Studio' WHEN 1 THEN '1 Bedroom' WHEN 2 THEN '2 Bedroom' ELSE '3 Bedroom' END,
  (8 + (s % 18))::text,
  'Pondok Indah Tower',
  CASE (s % 3) WHEN 0 THEN 'North' WHEN 1 THEN 'South' ELSE 'East' END,
  CASE (s % 4) WHEN 0 THEN 'Golf View' WHEN 1 THEN 'Garden View' WHEN 2 THEN 'City View' ELSE 'Park View' END,
  ARRAY['WiFi', 'Smart TV', 'AC', 'Premium Kitchen', 'Gym', 'Pool', 'Kids Playground', '24/7 Security'],
  ARRAY[
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'
  ],
  600000 + (s * 15000),
  15000000 + (s * 300000),
  'Premium family-friendly residence with world-class facilities. Close to international schools and shopping centers.',
  'Pondok Indah Unit ' || s,
  'PI-' || LPAD(s::text, 3, '0'),
  'pondok-indah-unit-' || s,
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.7!2d106.784!3d-6.266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f1e7!2sPondok+Indah!5e0!3m2!1sen!2sid'
FROM generate_series(1, 20) AS s;

-- Menteng Park (20 units)
INSERT INTO public.units (location_id, type, floor, building, tower, view, features, images, price_per_night, price_per_month, description, name, unit_name, slug, map_embed_url)
SELECT 
  'a3b4c5d6-e7f8-4a5b-2c3d-4e5f6a7b8c9d',
  CASE (s % 3) WHEN 0 THEN '1 Bedroom' WHEN 1 THEN '2 Bedroom' ELSE '3 Bedroom' END,
  (10 + (s % 15))::text,
  'Menteng Heritage',
  'Classic Wing',
  CASE (s % 3) WHEN 0 THEN 'Park View' WHEN 1 THEN 'Tree View' ELSE 'Garden View' END,
  ARRAY['WiFi', 'Smart TV 65"', 'AC', 'Classic Interior', 'High Ceiling', 'Marble Floor', 'Concierge'],
  ARRAY[
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'
  ],
  800000 + (s * 20000),
  20000000 + (s * 400000),
  'Historic Menteng residence with colonial charm. Prestigious address near embassies and government buildings.',
  'Menteng Park Unit ' || s,
  'MP-' || LPAD(s::text, 3, '0'),
  'menteng-park-unit-' || s,
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2!2d106.833!3d-6.194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f42!2sMenteng!5e0!3m2!1sen!2sid'
FROM generate_series(1, 20) AS s;

-- Pacific Place Residences (20 units)
INSERT INTO public.units (location_id, type, floor, building, tower, view, features, images, price_per_night, price_per_month, description, name, unit_name, slug, map_embed_url)
SELECT 
  'b4c5d6e7-f8a9-4b5c-3d4e-5f6a7b8c9d0e',
  CASE (s % 4) WHEN 0 THEN '1 Bedroom' WHEN 1 THEN '2 Bedroom' WHEN 2 THEN '3 Bedroom' ELSE 'Penthouse' END,
  (25 + (s % 35))::text,
  'Pacific Tower',
  'Sky Wing',
  CASE (s % 3) WHEN 0 THEN '360° View' WHEN 1 THEN 'SCBD View' ELSE 'Sunset View' END,
  ARRAY['WiFi', 'Smart Home', 'Smart TV 75"', 'AC', 'Italian Kitchen', 'Butler Service', 'Infinity Pool', 'Sky Lounge'],
  ARRAY[
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
  ],
  1500000 + (s * 40000),
  38000000 + (s * 800000),
  'Ultra-luxury residence with 5-star hotel services in SCBD. Connected to Pacific Place Mall.',
  'Pacific Place Unit ' || s,
  'PP-' || LPAD(s::text, 3, '0'),
  'pacific-place-unit-' || s,
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.3!2d106.809!3d-6.225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e8!2sPacific+Place!5e0!3m2!1sen!2sid'
FROM generate_series(1, 20) AS s;

-- Thamrin Executive (20 units)
INSERT INTO public.units (location_id, type, floor, building, tower, view, features, images, price_per_night, price_per_month, description, name, unit_name, slug, map_embed_url)
SELECT 
  'c5d6e7f8-a9b0-4c5d-4e5f-6a7b8c9d0e1f',
  CASE (s % 3) WHEN 0 THEN 'Studio' WHEN 1 THEN '1 Bedroom' ELSE '2 Bedroom' END,
  (15 + (s % 25))::text,
  'Thamrin Nine',
  CASE (s % 2) WHEN 0 THEN 'Tower 1' ELSE 'Tower 2' END,
  CASE (s % 4) WHEN 0 THEN 'Monas View' WHEN 1 THEN 'City Center' WHEN 2 THEN 'Bundaran HI' ELSE 'MRT View' END,
  ARRAY['WiFi', 'Smart TV', 'AC', 'Modern Kitchen', 'Work Desk', 'Gym', 'MRT Access', 'Co-working Space'],
  ARRAY[
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'
  ],
  650000 + (s * 18000),
  17000000 + (s * 350000),
  'Prime Thamrin location with direct MRT access. Perfect for business professionals.',
  'Thamrin Executive Unit ' || s,
  'TE-' || LPAD(s::text, 3, '0'),
  'thamrin-executive-unit-' || s,
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.5!2d106.823!3d-6.195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f43!2sThamrin!5e0!3m2!1sen!2sid'
FROM generate_series(1, 20) AS s;

-- Pantai Indah Kapuk (20 units)
INSERT INTO public.units (location_id, type, floor, building, tower, view, features, images, price_per_night, price_per_month, description, name, unit_name, slug, map_embed_url)
SELECT 
  'd6e7f8a9-b0c1-4d5e-5f6a-7b8c9d0e1f2a',
  CASE (s % 4) WHEN 0 THEN '1 Bedroom' WHEN 1 THEN '2 Bedroom' WHEN 2 THEN '3 Bedroom' ELSE 'Penthouse' END,
  (10 + (s % 25))::text,
  'PIK Waterfront',
  CASE (s % 3) WHEN 0 THEN 'Marina' WHEN 1 THEN 'Ocean' ELSE 'Beach' END,
  CASE (s % 4) WHEN 0 THEN 'Ocean View' WHEN 1 THEN 'Marina View' WHEN 2 THEN 'Golf View' ELSE 'Sunset View' END,
  ARRAY['WiFi', 'Smart TV', 'AC', 'Beach Access', 'Marina View', 'BBQ Area', 'Kids Club', 'Golf Course'],
  ARRAY[
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'
  ],
  800000 + (s * 22000),
  20000000 + (s * 450000),
  'Waterfront living with marina and beach access. International community with golf course nearby.',
  'PIK Waterfront Unit ' || s,
  'PIK-' || LPAD(s::text, 3, '0'),
  'pik-waterfront-unit-' || s,
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.1!2d106.738!3d-6.125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6a1d!2sPIK!5e0!3m2!1sen!2sid'
FROM generate_series(1, 20) AS s;

-- Kebayoran Baru (20 units)
INSERT INTO public.units (location_id, type, floor, building, tower, view, features, images, price_per_night, price_per_month, description, name, unit_name, slug, map_embed_url)
SELECT 
  'e7f8a9b0-c1d2-4e5f-6a7b-8c9d0e1f2a3b',
  CASE (s % 3) WHEN 0 THEN '1 Bedroom' WHEN 1 THEN '2 Bedroom' ELSE '3 Bedroom' END,
  (7 + (s % 18))::text,
  'Kebayoran Plaza',
  CASE (s % 2) WHEN 0 THEN 'North Wing' ELSE 'South Wing' END,
  CASE (s % 4) WHEN 0 THEN 'Blok M View' WHEN 1 THEN 'Garden View' WHEN 2 THEN 'Street View' ELSE 'Park View' END,
  ARRAY['WiFi', 'Smart TV', 'AC', 'Kitchen', 'Balcony', 'Gym', 'Pool', 'Near MRT'],
  ARRAY[
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
  ],
  700000 + (s * 20000),
  18000000 + (s * 400000),
  'Established Kebayoran Baru with tree-lined streets. Close to Blok M MRT and business districts.',
  'Kebayoran Unit ' || s,
  'KB-' || LPAD(s::text, 3, '0'),
  'kebayoran-unit-' || s,
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.9!2d106.799!3d-6.244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f1d!2sKebayoran+Baru!5e0!3m2!1sen!2sid'
FROM generate_series(1, 20) AS s;

-- Kelapa Gading Square (20 units)
INSERT INTO public.units (location_id, type, floor, building, tower, view, features, images, price_per_night, price_per_month, description, name, unit_name, slug, map_embed_url)
SELECT 
  'f8a9b0c1-d2e3-4f5a-7b8c-9d0e1f2a3b4c',
  CASE (s % 3) WHEN 0 THEN 'Studio' WHEN 1 THEN '1 Bedroom' ELSE '2 Bedroom' END,
  (8 + (s % 20))::text,
  'Kelapa Gading Mall Residence',
  CASE (s % 3) WHEN 0 THEN 'East' WHEN 1 THEN 'West' ELSE 'Central' END,
  CASE (s % 4) WHEN 0 THEN 'Mall View' WHEN 1 THEN 'City View' WHEN 2 THEN 'Park View' ELSE 'Boulevard' END,
  ARRAY['WiFi', 'Smart TV', 'AC', 'Kitchen', 'Mall Access', 'Food Court', 'Cinema', 'Gym'],
  ARRAY[
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
  ],
  550000 + (s * 15000),
  14000000 + (s * 300000),
  'Connected to Kelapa Gading Mall. Family-friendly area with diverse dining and entertainment.',
  'Kelapa Gading Unit ' || s,
  'KG-' || LPAD(s::text, 3, '0'),
  'kelapa-gading-unit-' || s,
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.7!2d106.901!3d-6.162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d!2sKelapa+Gading!5e0!3m2!1sen!2sid'
FROM generate_series(1, 20) AS s;
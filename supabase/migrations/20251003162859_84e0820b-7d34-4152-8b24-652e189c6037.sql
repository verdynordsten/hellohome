-- Delete all existing units
DELETE FROM units;

-- Insert comprehensive real data for all units
INSERT INTO units (
  location_id, 
  name, 
  slug, 
  unit_name, 
  type, 
  floor, 
  building,
  tower,
  view, 
  features, 
  image_url, 
  images, 
  price_per_night, 
  price_per_month, 
  description, 
  available
) VALUES

-- Senayan City Units (a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d)
(
  'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
  'Premium Studio with City View',
  'premium-studio-city-view',
  'Unit 1205',
  'Studio',
  '12',
  'Senayan Residences',
  'Tower A',
  'City View',
  ARRAY['High Speed WiFi', 'Smart TV 55"', 'Air Conditioning', 'Fully Furnished', 'Modern Kitchen', 'Queen Size Bed', 'Work Desk', 'Infinity Pool Access', 'Gym Access', '24/7 Security'],
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
  ARRAY[
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800'
  ],
  450000,
  12000000,
  'Experience luxury living in this modern 35 sqm studio apartment located on the 12th floor of Senayan Residences. This fully furnished unit features a contemporary design with floor-to-ceiling windows offering stunning city views. The apartment includes a queen-size bed, modern kitchen with complete appliances, dedicated workspace, and high-speed WiFi perfect for digital nomads and business travelers. Direct access to Senayan City Mall, infinity pool, and world-class gym facilities.',
  true
),

(
  'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
  'Luxury Studio with Balcony',
  'luxury-studio-balcony',
  'Unit 1815',
  'Studio',
  '18',
  'Senayan Residences',
  'Tower B',
  'City & Park View',
  ARRAY['High Speed WiFi', 'Smart TV 65"', 'Air Conditioning', 'Private Balcony', 'Fully Furnished', 'King Size Bed', 'Kitchen', 'Washer & Dryer', 'Pool Access', 'Gym Access', 'Concierge Service'],
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
  ARRAY[
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'
  ],
  480000,
  13500000,
  'Spacious 42 sqm studio apartment on the 18th floor featuring a private balcony with panoramic views of both the city skyline and Senayan Park. This premium unit comes with a king-size bed, fully equipped modern kitchen, in-unit washer and dryer, and a dedicated living area. Perfect for those seeking comfort and style. Enjoy 24/7 concierge service, access to the rooftop infinity pool, and state-of-the-art fitness center.',
  true
),

(
  'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
  'Penthouse Studio Premium View',
  'penthouse-studio-premium',
  'Unit 2918',
  'Studio',
  '29',
  'Senayan Residences',
  'Tower A',
  'Panoramic City View',
  ARRAY['High Speed WiFi', 'Smart TV 75"', 'Air Conditioning', 'Smart Home System', 'Premium View', 'King Size Bed', 'Designer Kitchen', 'Marble Bathroom', 'Private Lounge Access', 'Infinity Pool', 'Sky Garden'],
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800',
  ARRAY[
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800',
    'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=800',
    'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
  ],
  550000,
  15000000,
  'Top floor 48 sqm penthouse studio with breathtaking 360-degree views of Jakarta skyline. This ultra-luxury unit features smart home automation, designer furnishings, Italian marble bathroom, and a gourmet kitchen with premium appliances. Located on the 29th floor with exclusive access to the sky lounge and private rooftop garden. The perfect residence for discerning travelers seeking the ultimate in comfort and sophistication.',
  true
),

-- Sudirman Plaza Units (b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e)
(
  'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e',
  'Executive 1BR Apartment',
  'executive-1br-apartment',
  'Unit 2201',
  '1 Bedroom',
  '22',
  'Sudirman Suites',
  NULL,
  'SCBD View',
  ARRAY['High Speed WiFi', 'Smart TV 55"', 'Air Conditioning', 'Separate Bedroom', 'Full Kitchen', 'Dining Area', 'Work Desk', 'Coffee Machine', 'Gym Access', 'Swimming Pool', 'Meeting Room Access'],
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
  ARRAY[
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
  ],
  650000,
  18000000,
  'Modern 55 sqm one-bedroom apartment in the heart of Sudirman business district, perfect for business executives and professionals. Features a separate bedroom with queen-size bed, spacious living area, fully equipped kitchen with dining space, and dedicated workspace with ergonomic chair. The apartment overlooks the SCBD skyline and is within walking distance to major corporate offices, luxury shopping, and fine dining. Includes access to business lounge and meeting rooms.',
  true
),

(
  'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e',
  'Deluxe 2BR Family Suite',
  'deluxe-2br-family-suite',
  'Unit 1508',
  '2 Bedroom',
  '15',
  'Sudirman Suites',
  NULL,
  'City & Mountain View',
  ARRAY['High Speed WiFi', 'Smart TV in All Rooms', 'Air Conditioning', '2 Bathrooms', 'Full Kitchen', 'Dining Table', 'Living Room', 'Private Balcony', 'Washing Machine', 'Kids Pool', 'Playground', 'BBQ Area'],
  'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800',
  ARRAY[
    'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'
  ],
  850000,
  24000000,
  'Spacious 85 sqm two-bedroom family apartment with stunning views of both the city and mountains. This well-appointed unit features two bedrooms with comfortable beds, two modern bathrooms, a large living room, full kitchen with all appliances, dining area for 6 people, and a private balcony. Perfect for families with access to kids pool, playground, and BBQ area. The master bedroom includes an ensuite bathroom and walk-in closet. Located in a family-friendly building with 24/7 security and ample parking.',
  true
),

-- Kuningan Residence Units (c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f)
(
  'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f',
  'Modern 1BR Luxury',
  'modern-1br-luxury',
  'Unit 1402',
  '1 Bedroom',
  '14',
  'Kuningan Place',
  'North Wing',
  'Mega Kuningan View',
  ARRAY['High Speed WiFi', 'Smart TV 55"', 'Air Conditioning', 'Modern Kitchen', 'Bathtub', 'Gym Access', 'Yoga Studio', 'Sauna', 'Steam Room', 'Rooftop Bar', 'Co-working Space'],
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
  ARRAY[
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800'
  ],
  600000,
  16500000,
  'Contemporary 62 sqm one-bedroom apartment in prestigious Kuningan district, featuring modern minimalist design and premium finishes. The unit includes a spacious bedroom with king-size bed, bathroom with bathtub, open-concept kitchen and living area, and stunning views of Mega Kuningan skyline. Residents enjoy complimentary access to world-class amenities including a fully equipped gym, yoga studio, sauna, steam room, rooftop bar, and co-working space. Close to embassies, international schools, and upscale restaurants.',
  true
),

(
  'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f',
  'Premium 2BR Corner Unit',
  'premium-2br-corner-unit',
  'Unit 2105',
  '2 Bedroom',
  '21',
  'Kuningan Place',
  'South Wing',
  '180° Panoramic View',
  ARRAY['High Speed WiFi', 'Smart TV 65"', 'Air Conditioning', 'Corner Unit', '2 Balconies', 'Full Kitchen', 'Wine Cooler', 'Walk-in Closet', 'Jacuzzi', 'Pool Access', 'Tennis Court', 'Cinema Room'],
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
  ARRAY[
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800'
  ],
  900000,
  25000000,
  'Exceptional 95 sqm corner unit two-bedroom apartment on the 21st floor with breathtaking 180-degree panoramic views. This premium residence features two spacious bedrooms with the master suite including a walk-in closet and ensuite bathroom with jacuzzi, a gourmet kitchen with wine cooler, expansive living and dining areas, and two private balconies. The floor-to-ceiling windows flood the space with natural light. Exclusive amenities include swimming pool, tennis court, private cinema room, and 24/7 concierge service. The epitome of luxury living in Jakarta.',
  true
),

-- House Rental Jakarta (d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a)
(
  'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a',
  'Spacious 4BR Family House',
  'spacious-4br-family-house',
  'House A1',
  '4 Bedroom',
  'Ground + Upper',
  'Menteng Residence',
  NULL,
  'Garden View',
  ARRAY['High Speed WiFi', 'Smart TVs', 'Air Conditioning', '3 Bathrooms', 'Full Kitchen', 'Dining Room', 'Living Room', 'Family Room', 'Private Garden', 'Carport 2 Cars', 'Maid Room', 'Laundry Room', 'BBQ Area', 'Security 24/7'],
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
  ARRAY[
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
  ],
  1200000,
  32000000,
  'Luxurious 280 sqm two-story family house in the prestigious Menteng area, perfect for large families or groups. This beautiful property features 4 spacious bedrooms, 3 modern bathrooms, a fully equipped kitchen with dining area, comfortable living room, separate family room, and a private garden ideal for children. The house includes a maid room, dedicated laundry room, and covered carport for 2 vehicles. Enjoy outdoor entertaining in the BBQ area surrounded by lush greenery. Located in a secure gated community with 24/7 security, close to international schools, shopping centers, and major highways. Ideal for expatriate families seeking a comfortable home in Jakarta.',
  true
);
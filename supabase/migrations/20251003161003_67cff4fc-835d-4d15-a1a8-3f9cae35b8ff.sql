-- Delete all existing units
DELETE FROM units;

-- Insert new sample units with proper names and slugs
INSERT INTO units (location_id, name, slug, unit_name, type, floor, view, features, image_url, images, price_per_night, price_per_month, description, available) VALUES
-- Senayan City Units
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Premium Studio with City View', 'premium-studio-city-view', 'Unit 1205', 'Studio', '12', 'City View', ARRAY['WiFi', 'Smart TV', 'Air Conditioning', 'Fully Furnished', 'Kitchen'], 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'], 450000, 12000000, 'Modern studio apartment on the 12th floor with stunning city views. Fully furnished with premium amenities.', true),

('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Luxury Studio with Balcony', 'luxury-studio-balcony', 'Unit 1815', 'Studio', '18', 'City View', ARRAY['WiFi', 'Smart TV', 'Air Conditioning', 'Balcony', 'Fully Furnished'], 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800'], 480000, 13500000, 'Spacious studio on 18th floor featuring a private balcony with panoramic city views.', true),

('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Penthouse Studio Premium View', 'penthouse-studio-premium', 'Unit 2918', 'Studio', '29', 'Premium View', ARRAY['WiFi', 'Smart TV', 'Air Conditioning', 'Premium View', 'Smart Home'], 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800', ARRAY['https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800', 'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=800'], 550000, 15000000, 'Top floor penthouse studio with smart home features and breathtaking premium views of Jakarta skyline.', true),

-- Sudirman Plaza Units
('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 'Executive 1BR Apartment', 'executive-1br-apartment', 'Unit 2201', '1 Bedroom', '22', 'City View', ARRAY['WiFi', 'Smart TV', 'Air Conditioning', 'Kitchen', 'Workspace'], 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'], 650000, 18000000, 'Executive 1-bedroom apartment perfect for business travelers. Features dedicated workspace and modern kitchen.', true),

('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 'Deluxe 2BR Family Suite', 'deluxe-2br-family-suite', 'Unit 1508', '2 Bedroom', '15', 'City View', ARRAY['WiFi', 'Smart TV', 'Air Conditioning', 'Kitchen', 'Dining Area', 'Balcony'], 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800', ARRAY['https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800'], 850000, 24000000, 'Spacious 2-bedroom family suite with full kitchen, dining area, and private balcony.', true),

-- Kuningan Residence Units  
('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 'Modern 1BR Luxury', 'modern-1br-luxury', 'Unit 1402', '1 Bedroom', '14', 'City View', ARRAY['WiFi', 'Smart TV', 'Air Conditioning', 'Kitchen', 'Gym Access'], 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800', ARRAY['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'], 600000, 16500000, 'Modern 1-bedroom luxury apartment with complimentary gym access and premium amenities.', true),

('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 'Premium 2BR Corner Unit', 'premium-2br-corner-unit', 'Unit 2105', '2 Bedroom', '21', 'Panoramic View', ARRAY['WiFi', 'Smart TV', 'Air Conditioning', 'Kitchen', 'Balcony', 'Pool Access'], 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'], 900000, 25000000, 'Corner unit 2-bedroom with panoramic views, pool access, and luxury finishes throughout.', true),

-- House Rental Jakarta
('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', 'Spacious 4BR Family House', 'spacious-4br-family-house', 'House A1', '4 Bedroom', 'Ground + 1', 'Garden View', ARRAY['WiFi', 'Smart TV', 'Air Conditioning', 'Full Kitchen', 'Living Room', 'Dining Room', 'Free Parking', 'Garden'], 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800', ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'], 1200000, 32000000, 'Large 4-bedroom family house with garden, full kitchen, and parking for 2 cars. Perfect for families or groups.', true);
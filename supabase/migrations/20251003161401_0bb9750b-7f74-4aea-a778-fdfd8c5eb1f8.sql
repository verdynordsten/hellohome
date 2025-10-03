-- Update location unit counts to match actual units in database
UPDATE locations SET units_count = (
  SELECT COUNT(*) FROM units WHERE units.location_id = locations.id
);
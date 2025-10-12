export const mapDrizzleLocation = (drizzleLocation: {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  slug: string | null;
  unitsCount: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}) => ({
  id: drizzleLocation.id,
  name: drizzleLocation.name,
  description: drizzleLocation.description,
  image_url: drizzleLocation.imageUrl,
  slug: drizzleLocation.slug,
  units_count: drizzleLocation.unitsCount ? parseInt(drizzleLocation.unitsCount) : null,
  created_at: drizzleLocation.createdAt?.toISOString() || null,
  updated_at: drizzleLocation.updatedAt?.toISOString() || null,
});

export const mapDrizzleUnit = (drizzleUnit: {
  id: string;
  locationId: string;
  type: string;
  name: string | null;
  unitName: string | null;
  slug: string | null;
  description: string | null;
  pricePerMonth: string | null;
  pricePerNight: string | null;
  available: boolean | null;
  imageUrl: string | null;
  images: string[] | null;
  features: string[] | null;
  view: string | null;
  floor: string | null;
  building: string | null;
  tower: string | null;
  mapEmbedUrl: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}) => ({
  id: drizzleUnit.id,
  location_id: drizzleUnit.locationId,
  type: drizzleUnit.type,
  name: drizzleUnit.name,
  unit_name: drizzleUnit.unitName,
  slug: drizzleUnit.slug,
  description: drizzleUnit.description,
  price_per_month: drizzleUnit.pricePerMonth ? parseFloat(drizzleUnit.pricePerMonth) : null,
  price_per_night: drizzleUnit.pricePerNight ? parseFloat(drizzleUnit.pricePerNight) : null,
  available: drizzleUnit.available,
  image_url: drizzleUnit.imageUrl,
  images: drizzleUnit.images,
  features: drizzleUnit.features,
  view: drizzleUnit.view,
  floor: drizzleUnit.floor,
  building: drizzleUnit.building,
  tower: drizzleUnit.tower,
  map_embed_url: drizzleUnit.mapEmbedUrl,
  created_at: drizzleUnit.createdAt?.toISOString() || null,
  updated_at: drizzleUnit.updatedAt?.toISOString() || null,
});
import { pgTable, uuid, text, numeric, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const appRoleEnum = pgEnum('app_role', ['admin', 'user']);

// Tables
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name'),
  role: appRoleEnum('role').notNull().default('admin'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const locations = pgTable('locations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  slug: text('slug'),
  unitsCount: numeric('units_count').default('0'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const units = pgTable('units', {
  id: uuid('id').defaultRandom().primaryKey(),
  locationId: uuid('location_id').notNull(),
  type: text('type').notNull(),
  name: text('name'),
  unitName: text('unit_name'),
  slug: text('slug'),
  description: text('description'),
  pricePerMonth: numeric('price_per_month'),
  pricePerNight: numeric('price_per_night'),
  available: boolean('available').default(true),
  imageUrl: text('image_url'),
  images: text('images').array(),
  features: text('features').array(),
  view: text('view'),
  floor: text('floor'),
  building: text('building'),
  tower: text('tower'),
  mapEmbedUrl: text('map_embed_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const userRoles = pgTable('user_roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  role: appRoleEnum('role').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;
export type Unit = typeof units.$inferSelect;
export type NewUnit = typeof units.$inferInsert;
export type UserRole = typeof userRoles.$inferSelect;
export type NewUserRole = typeof userRoles.$inferInsert;
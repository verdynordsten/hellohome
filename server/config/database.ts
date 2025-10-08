import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';
import { locations, units, users } from '../../src/db/schema';

config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const client = postgres(connectionString, {
  prepare: false,
  transform: postgres.camel,
});

export const db = drizzle(client, { schema: { locations, units, users } });

export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
export const PORT = process.env.PORT || 3003;
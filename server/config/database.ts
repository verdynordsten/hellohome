import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';
import { locations, units, users } from '../../src/db/schema';

// Load environment variables
config({ path: '.env.local' });

// Connection string from environment variables
const connectionString = process.env.VITE_DATABASE_URL;

if (!connectionString) {
  throw new Error('VITE_DATABASE_URL is not defined');
}

// Create postgres client
const client = postgres(connectionString, {
  prepare: false,
  transform: postgres.camel,
});

// Create drizzle instance
export const db = drizzle(client, { schema: { locations, units, users } });

// JWT Secret
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Port
export const PORT = process.env.PORT || 3003;
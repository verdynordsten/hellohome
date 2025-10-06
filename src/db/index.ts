import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Connection string from environment variables
const connectionString = import.meta.env.VITE_DATABASE_URL;

if (!connectionString) {
  throw new Error('VITE_DATABASE_URL is not defined');
}

// Create postgres client
const client = postgres(connectionString, {
  prepare: false,
  transform: postgres.camel,
});

// Create drizzle instance
export const db = drizzle(client, { schema });

// Export schema for easy access
export * from './schema';
import postgres from 'postgres';
import { config } from 'dotenv';
import bcrypt from 'bcryptjs';

// Load environment variables
config({ path: '.env.local' });

const connectionString = process.env.VITE_DATABASE_URL;

if (!connectionString) {
  throw new Error('VITE_DATABASE_URL is not defined');
}

async function createAdminUser() {
  const sql = postgres(connectionString);
  
  try {
    // Check if users table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `;
    
    if (!tableExists[0].exists) {
      console.log('Creating users table...');
      await sql`
        CREATE TABLE users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          name TEXT,
          role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'user')),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;
      console.log('Users table created successfully.');
    } else {
      console.log('Users table already exists.');
    }
    
    // Hash the password
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert admin user
    const result = await sql`
      INSERT INTO users (email, password, name, role) 
      VALUES (
        'admin@hellohome.com', 
        ${hashedPassword},
        'Admin User',
        'admin'
      ) 
      ON CONFLICT (email) DO NOTHING
      RETURNING id, email, name, role, created_at;
    `;
    
    if (result.length > 0) {
      console.log('Admin user created successfully:');
      console.log(result[0]);
      console.log('\nLogin credentials:');
      console.log('Email: admin@hellohome.com');
      console.log('Password: admin123');
    } else {
      console.log('Admin user already exists.');
      
      // Show existing admin user
      const existingUser = await sql`
        SELECT id, email, name, role, created_at FROM users WHERE email = 'admin@hellohome.com';
      `;
      if (existingUser.length > 0) {
        console.log('Existing admin user:');
        console.log(existingUser[0]);
      }
    }
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await sql.end();
  }
}

createAdminUser();
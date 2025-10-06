-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert admin user with hashed password
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (email, password, name, role)
VALUES (
    'admin@hellohome.com',
    '$2b$10$vpnaxoxA/qKRqTwyvPEOy.wnk6WEO8L6UcI9x/ramZUyUsFm.3/2K',
    'Admin User',
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Verify the admin user was created
SELECT id, email, name, role, created_at FROM users WHERE email = 'admin@hellohome.com';
# Database Setup Guide

## Overview
This project uses a direct PostgreSQL connection for both development and production.

## Setup Instructions

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your PostgreSQL connection string:
   ```
   VITE_DATABASE_URL=postgres://username:password@host:port/database_name
   ```

3. Make sure your PostgreSQL server is running and accessible.

4. Set up your database schema using the provided SQL files:
   - `database-schema.sql` - Contains the database structure
   - `database-export.sql` - Contains sample data (optional)

## Database Schema

The database consists of three main tables:

### 1. Locations
Stores information about apartment locations.

### 2. Units
Stores individual apartment units associated with locations.

### 3. User Roles
Manages user permissions (admin/user).

## Running Database Migrations

If you're using Drizzle ORM with PostgreSQL directly:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run migrations:
   ```bash
   npm run db:push
   ```

3. Generate types:
   ```bash
   npm run db:generate
   ```

## Troubleshooting

### "process is not defined" Error
This error occurs when the postgres library tries to access Node.js globals in the browser. The project includes polyfills to resolve this issue:

1. Ensure polyfills are imported in `src/main.tsx`
2. Check that `vite.config.ts` has the correct polyfill configuration
3. Verify environment variables are properly set

### Connection Issues
1. Check that your database server is running
2. Verify the connection string in `.env.local`
3. Ensure the database user has the necessary permissions
4. Check for network/firewall issues

## Security Notes

- Never commit `.env.local` to version control
- Use different credentials for development and production
- Enable Row Level Security (RLS) in production
- Regularly update database passwords

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_DATABASE_URL` | PostgreSQL connection string | Yes |
| `VITE_APP_NAME` | Application name | No |
| `VITE_APP_URL` | Application URL | No |
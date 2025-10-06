import express from 'express';
import cors from 'cors';
import { PORT } from './config/database';
import locationsRouter from './routes/locations';
import unitsRouter from './routes/units';
import authRouter from './routes/auth';

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable pre-flight for all routes
app.options('*', cors());

// API Routes
app.use('/api/locations', locationsRouter);
app.use('/api/units', unitsRouter);
app.use('/api/auth', authRouter);

// Start server
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET /api/locations');
  console.log('- GET /api/locations/:id');
  console.log('- GET /api/locations/slug/:slug');
  console.log('- POST /api/locations (requires authentication)');
  console.log('- PUT /api/locations/:id (requires authentication)');
  console.log('- DELETE /api/locations/:id (requires authentication)');
  console.log('- GET /api/units');
  console.log('- GET /api/units/all');
  console.log('- GET /api/units/location/:locationId');
  console.log('- GET /api/units/:id');
  console.log('- GET /api/units/slug/:slug');
  console.log('- POST /api/units (requires authentication)');
  console.log('- PUT /api/units/:id (requires authentication)');
  console.log('- DELETE /api/units/:id (requires authentication)');
  console.log('- POST /api/auth/login');
  console.log('- GET /api/auth/verify');
});
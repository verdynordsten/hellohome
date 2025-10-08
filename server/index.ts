import express from 'express';
import cors from 'cors';
import { PORT } from './config/database';
import v1Router from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.options('*', cors());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    apis: {
      v1: '/api/v1'
    }
  });
});

app.use('/api/v1', v1Router);

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('\nHealth Check:');
  console.log('- GET /health');
  console.log('\nAPI v1:');
  console.log('- GET /api/v1/health');
  console.log('- GET /api/v1/locations');
  console.log('- GET /api/v1/locations/:id');
  console.log('- GET /api/v1/locations/slug/:slug');
  console.log('- POST /api/v1/locations (requires authentication)');
  console.log('- PUT /api/v1/locations/:id (requires authentication)');
  console.log('- DELETE /api/v1/locations/:id (requires authentication)');
  console.log('- GET /api/v1/units');
  console.log('- GET /api/v1/units/all');
  console.log('- GET /api/v1/units/location/:locationId');
  console.log('- GET /api/v1/units/:id');
  console.log('- GET /api/v1/units/slug/:slug');
  console.log('- POST /api/v1/units (requires authentication)');
  console.log('- PUT /api/v1/units/:id (requires authentication)');
  console.log('- DELETE /api/v1/units/:id (requires authentication)');
  console.log('- POST /api/v1/auth/login');
  console.log('- GET /api/v1/auth/verify');
});
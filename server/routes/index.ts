import { Router } from 'express';
import locationsRouter from './v1/locations';
import unitsRouter from './v1/units';
import authRouter from './v1/auth';
import { config } from 'dotenv';

const router = Router();

config({ path: '.env.local' });

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    api: 'v1'
  });
});

router.use('/locations', locationsRouter);
router.use('/units', unitsRouter);
router.use('/auth', authRouter);

export default router;
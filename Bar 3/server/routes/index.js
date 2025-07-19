import { Router } from 'express';
import cocktailRoutes from './cocktailRoutes.js';

const router = Router();

router.use('/api', cocktailRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI Mixologist API is running' });
});

export default router;
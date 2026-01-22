import { Router } from 'express';
import { healthRoutes, adminAuthRoutes } from '../modules';

const router = Router();

router.use('/health', healthRoutes);
router.use('/admin/auth', adminAuthRoutes);

export default router;

import { Router } from 'express';
import { healthRoutes, adminAuthRoutes, superAdminRoutes, societyRoutes } from '../modules';

const router = Router();

router.use('/health', healthRoutes);
router.use('/admin/auth', adminAuthRoutes);
router.use('/admin/super', superAdminRoutes);
router.use('/societies', societyRoutes);

export default router;

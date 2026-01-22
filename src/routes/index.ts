import { Router } from 'express';
import { healthRoutes, adminAuthRoutes, superAdminRoutes } from '../modules';

const router = Router();

router.use('/health', healthRoutes);
router.use('/admin/auth', adminAuthRoutes);
router.use('/admin/super', superAdminRoutes);

export default router;

import { Router } from 'express';
import {
  healthRoutes,
  adminAuthRoutes,
  superAdminRoutes,
  societyRoutes,
  residentRoutes,
  propertyRoutes,
} from '../modules';

const router = Router();

router.use('/health', healthRoutes);
router.use('/admin/auth', adminAuthRoutes);
router.use('/admin/super', superAdminRoutes);
router.use('/societies', societyRoutes);
router.use('/residents', residentRoutes);
router.use('/properties', propertyRoutes);

export default router;

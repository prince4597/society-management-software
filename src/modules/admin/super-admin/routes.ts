import { Router } from 'express';
import { superAdminController } from './controller';

const router = Router();

router.get('/stats', superAdminController.getStats);
router.get('/config', superAdminController.getConfigs);
router.patch('/config', superAdminController.updateConfig);

export default router;

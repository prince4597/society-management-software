import { Router } from 'express';
import { superAdminController } from './controller';

const router = Router();

/**
 * @swagger
 * /admin/super/stats:
 *   get:
 *     summary: Get global system statistics
 *     tags: [Super Admin]
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get('/stats', superAdminController.getStats);

/**
 * @swagger
 * /admin/super/config:
 *   get:
 *     summary: Get all system configurations
 *     tags: [Super Admin]
 *     responses:
 *       200:
 *         description: Configurations retrieved successfully
 */
router.get('/config', superAdminController.getConfigs);

/**
 * @swagger
 * /admin/super/config:
 *   patch:
 *     summary: Update a system configuration
 *     tags: [Super Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *               - value
 *             properties:
 *               key:
 *                 type: string
 *               value:
 *                 type: any
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Configuration updated successfully
 *       400:
 *         description: Key is required
 */
router.patch('/config', superAdminController.updateConfig);

export const superAdminRoutes = router;
export default router;

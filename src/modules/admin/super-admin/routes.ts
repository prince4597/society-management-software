import { Router } from 'express';
import { superAdminController } from './controller';
import { authenticate, authorize } from '../../../middleware/auth.middleware';
import { RoleName } from '../../../constants/roles';

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
router.get('/dashboard', superAdminController.getDashboardData);

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
router.patch(
  '/config',
  authenticate,
  authorize([RoleName.SUPER_ADMIN]),
  superAdminController.updateConfig
);

/**
 * @swagger
 * /admin/super/societies/{id}/admins:
 *   post:
 *     summary: Add new admin node to a society
 *     tags: [Super Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Admin registered
 */
router.post(
  '/societies/:id/admins',
  authenticate,
  authorize([RoleName.SUPER_ADMIN]),
  superAdminController.addAdmin
);

/**
 * @swagger
 * /admin/super/admins/{id}:
 *   patch:
 *     summary: Update administrative node status/data
 *     tags: [Super Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin updated
 */
router.patch(
  '/admins/:id',
  authenticate,
  authorize([RoleName.SUPER_ADMIN]),
  superAdminController.updateAdmin
);

/**
 * @swagger
 * /admin/super/admins/{id}:
 *   delete:
 *     summary: Purge administrative node from the system
 *     tags: [Super Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin purged
 */
router.delete(
  '/admins/:id',
  authenticate,
  authorize([RoleName.SUPER_ADMIN]),
  superAdminController.deleteAdmin
);

export const superAdminRoutes = router;
export default router;

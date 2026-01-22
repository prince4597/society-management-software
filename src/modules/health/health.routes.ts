import { Router } from 'express';
import { healthController } from './health.controller';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Get system health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: System is healthy
 *       503:
 *         description: System is unhealthy
 */
router.get('/', healthController.getHealth);

/**
 * @swagger
 * /health/live:
 *   get:
 *     summary: Liveness check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: System is alive
 */
router.get('/live', healthController.getLiveness);

/**
 * @swagger
 * /health/ready:
 *   get:
 *     summary: Readiness check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: System is ready
 *       503:
 *         description: System is not ready
 */
router.get('/ready', healthController.getReadiness);

export default router;

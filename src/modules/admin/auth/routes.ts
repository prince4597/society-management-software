import { Router } from 'express';
import { AuthController } from './controller';
import { loginSchema } from './dto';
import { validate } from '../../../middleware/validate.middleware';
import { authRateLimiter } from '../../../middleware/ratelimit.middleware';
import { authenticate } from '../../../middleware/auth.middleware';
import { asyncHandler } from '../../../types';

const router = Router();
const controller = new AuthController();

/**
 * @swagger
 * /admin/auth/me:
 *   get:
 *     summary: Get current admin profile
 *     tags: [Admin Auth]
 *     responses:
 *       200:
 *         description: Profile retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authenticate, asyncHandler(controller.getProfile));
router.post('/logout', authenticate, asyncHandler(controller.logout));

/**
 * @swagger
 * /admin/auth/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post(
  '/login',
  authRateLimiter,
  validate({ body: loginSchema.shape.body }),
  asyncHandler(controller.login)
);

export const authRoutes = router;

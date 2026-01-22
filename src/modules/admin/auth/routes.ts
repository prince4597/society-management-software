import { Router } from 'express';
import { AuthController } from './controller';
import { loginSchema } from './dto';
import { validate } from '../../../middleware/validate.middleware';
import { authRateLimiter } from '../../../middleware/ratelimit.middleware';
import { asyncHandler } from '../../../types';

const router = Router();
const controller = new AuthController();

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
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post(
  '/login',
  authRateLimiter,
  validate({ body: loginSchema.shape.body }),
  asyncHandler(controller.login)
);

export const authRoutes = router;

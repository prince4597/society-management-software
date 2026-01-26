import { Router } from 'express';
import { societyController } from './controller';
import { createSocietySchema, updateSocietySchema, societyIdParamSchema } from './dto';
import { validate } from '../../middleware/validate.middleware';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { RoleName } from '../../constants/roles';

const router = Router();

/**
 * @swagger
 * /societies:
 *   post:
 *     summary: Onboard a new society with its admin
 *     tags: [Societies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - society
 *               - admin
 *             properties:
 *               society:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   code:
 *                     type: string
 *                   address:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *               admin:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *                   password:
 *                     type: string
 *     responses:
 *       201:
 *         description: Society onboarded successfully
 *       409:
 *         description: Society code or admin email already exists
 */
router.post(
  '/',
  authenticate,
  authorize([RoleName.SUPER_ADMIN]),
  validate({ body: createSocietySchema.shape.body }),
  societyController.onboard
);

/**
 * @swagger
 * /societies:
 *   get:
 *     summary: Get all societies
 *     tags: [Societies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of societies
 */
router.get('/', authenticate, authorize([RoleName.SUPER_ADMIN]), societyController.findAll);

/**
 * @swagger
 * /societies/{id}:
 *   get:
 *     summary: Get society by ID
 *     tags: [Societies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Society details
 *       404:
 *         description: Society not found
 */
router.get(
  '/:id',
  authenticate,
  authorize([RoleName.SUPER_ADMIN]),
  validate({ params: societyIdParamSchema.shape.params }),
  societyController.findById
);

/**
 * @swagger
 * /societies/{id}:
 *   patch:
 *     summary: Update society
 *     tags: [Societies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Society updated
 *       404:
 *         description: Society not found
 */
router.patch(
  '/:id',
  authenticate,
  authorize([RoleName.SUPER_ADMIN]),
  validate({ params: societyIdParamSchema.shape.params, body: updateSocietySchema.shape.body }),
  societyController.update
);

/**
 * @swagger
 * /societies/{id}/admins:
 *   get:
 *     summary: Get admins of a society
 *     tags: [Societies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of society admins
 *       404:
 *         description: Society not found
 */
router.get(
  '/:id/admins',
  authenticate,
  authorize([RoleName.SUPER_ADMIN]),
  validate({ params: societyIdParamSchema.shape.params }),
  societyController.getAdmins
);

router.get(
  '/profile/me',
  authenticate,
  authorize([RoleName.SOCIETY_ADMIN]),
  societyController.findMySociety
);

router.patch(
  '/profile/me',
  authenticate,
  authorize([RoleName.SOCIETY_ADMIN]),
  validate({ body: updateSocietySchema.shape.body }),
  societyController.updateMySociety
);

export const societyRoutes = router;

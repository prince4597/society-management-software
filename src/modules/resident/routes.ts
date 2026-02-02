import { Router } from 'express';
import { residentController } from './controller';
import { authenticate, authorize, validate } from '../../middleware';
import { RoleName } from '../../constants/roles';
import { createResidentSchema, updateResidentSchema, residentIdParamSchema } from './dto';
import { asyncHandler } from '../../types';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize([RoleName.SOCIETY_ADMIN]),
  validate({ body: createResidentSchema.shape.body }),
  residentController.create
);

router.get('/', authorize([RoleName.SOCIETY_ADMIN]), residentController.findAll);

router.get(
  '/:id',
  authorize([RoleName.SOCIETY_ADMIN]),
  validate({ params: residentIdParamSchema.shape.params }),
  residentController.findById
);

router.put(
  '/:id',
  authorize([RoleName.SOCIETY_ADMIN]),
  validate({
    params: residentIdParamSchema.shape.params,
    body: updateResidentSchema.shape.body,
  }),
  residentController.update
);

router.delete(
  '/:id',
  authorize([RoleName.SOCIETY_ADMIN]),
  validate({ params: residentIdParamSchema.shape.params }),
  residentController.delete
);

export default router;

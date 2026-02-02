import { Router } from 'express';
import { propertyController } from './controller';
import { authenticate, authorize, validate } from '../../middleware';
import { RoleName } from '../../constants/roles';
import { createPropertySchema, updatePropertySchema, propertyIdParamSchema } from './dto';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize([RoleName.SOCIETY_ADMIN]),
  validate({ body: createPropertySchema.shape.body }),
  propertyController.create
);

router.get('/', authorize([RoleName.SOCIETY_ADMIN]), propertyController.findAll);

router.get(
  '/:id',
  authorize([RoleName.SOCIETY_ADMIN]),
  validate({ params: propertyIdParamSchema.shape.params }),
  propertyController.findById
);

router.put(
  '/:id',
  authorize([RoleName.SOCIETY_ADMIN]),
  validate({
    params: propertyIdParamSchema.shape.params,
    body: updatePropertySchema.shape.body,
  }),
  propertyController.update
);

router.delete(
  '/:id',
  authorize([RoleName.SOCIETY_ADMIN]),
  validate({ params: propertyIdParamSchema.shape.params }),
  propertyController.delete
);

export default router;

import { Router } from 'express';
import { propertyController } from './controller';
import { authenticate, authorize } from '../../middleware';
import { RoleName } from '../../constants/roles';

const router = Router();

router.use(authenticate);

router.post('/', authorize([RoleName.SOCIETY_ADMIN]), propertyController.create);

router.get('/', authorize([RoleName.SOCIETY_ADMIN]), propertyController.findAll);

router.get('/:id', authorize([RoleName.SOCIETY_ADMIN]), propertyController.findById);

router.put('/:id', authorize([RoleName.SOCIETY_ADMIN]), propertyController.update);

router.delete('/:id', authorize([RoleName.SOCIETY_ADMIN]), propertyController.delete);

export default router;

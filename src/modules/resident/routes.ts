import { Router } from 'express';
import { residentController } from './controller';
import { authenticate, authorize } from '../../middleware';
import { RoleName } from '../../constants/roles';

const router = Router();

router.use(authenticate);

router.post('/', authorize([RoleName.SOCIETY_ADMIN]), residentController.create);

router.get('/', authorize([RoleName.SOCIETY_ADMIN]), residentController.findAll);

router.get('/:id', authorize([RoleName.SOCIETY_ADMIN]), residentController.findById);

router.put('/:id', authorize([RoleName.SOCIETY_ADMIN]), residentController.update);

router.delete('/:id', authorize([RoleName.SOCIETY_ADMIN]), residentController.delete);

export default router;

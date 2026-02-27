import express from 'express';
import * as userController from '../../modules/users/users.controller';
import verifyUserToken from '../../midlewares/verifyUserToken';
import { updateMeValidator } from '../../midlewares/validators/authValidators';
import validateRequest from '../../midlewares/validators/validateRequest';
import { requireRoles } from '../../midlewares/requireRoles';

const router = express.Router();

router.get('/me', verifyUserToken, userController.getMe);

router.put(
  '/me',
  verifyUserToken,
  updateMeValidator,
  validateRequest,
  userController.updateMe
);

router.get(
  '/',
  verifyUserToken,
  requireRoles(['ADMIN']),
  userController.listUsers
);

export default router;


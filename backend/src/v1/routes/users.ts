import express from 'express';
import * as userController from '../../modules/users/users.controller';
import verifyUserToken from '../../midlewares/verifyUserToken';
import validateRequest from '../../midlewares/validators/validateRequest';
import { requireRoles } from '../../midlewares/requireRoles';
import { listUsersValidator, updateMeValidator } from '../../midlewares/validators/usersValidators';

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
  listUsersValidator,
  validateRequest,
  userController.listUsers
);

export default router;


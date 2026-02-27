import express from 'express';
import * as userController from '../../modules/users/users.controller';
import verifyUserToken from '../../midlewares/verifyUserToken';
import validateRequest from '../../midlewares/validators/validateRequest';
import { requireRoles } from '../../midlewares/requireRoles';
import { listUsersValidator, updateMeValidator } from '../../midlewares/validators/usersValidators';
import { mapToDto } from '../../midlewares/validators/mapToDto';
import { toUpdateMeDto } from '../../modules/users/dtos/UpdateMeDto';
import { toListUsersQueryDto } from '../../modules/users/dtos/ListUsersQueryDto';

const router = express.Router();

router.get('/me', verifyUserToken, userController.getMe);

router.put(
  '/me',
  verifyUserToken,
  updateMeValidator,
  validateRequest,
  mapToDto(toUpdateMeDto, 'body'),
  userController.updateMe
);

router.get(
  '/',
  verifyUserToken,
  requireRoles(['ADMIN']),
  listUsersValidator,
  validateRequest,
  mapToDto(toListUsersQueryDto, 'query'),
  userController.listUsers
);

export default router;



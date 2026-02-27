import express from 'express';
import authController from '../../modules/auth/auth.controller';
import {
  loginValidator,
  signupValidator,
} from '../../midlewares/validators/authValidators';
import validateRequest from '../../midlewares/validators/validateRequest';
import { mapToDto } from '../../midlewares/validators/mapToDto';
import { toLoginDto } from '../../modules/auth/dtos/LoginDto';
import { toSignupUserDto } from '../../modules/auth/dtos/SignupUserDto';

const router = express.Router();

router.post(
  '/login',
  loginValidator,
  validateRequest,
  mapToDto(toLoginDto, 'body'),
  authController.login
);

router.post(
  '/register',
  signupValidator,
  validateRequest,
  mapToDto(toSignupUserDto, 'body'),
  authController.createNewUser
);

export default router;

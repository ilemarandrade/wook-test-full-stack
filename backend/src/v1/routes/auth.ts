import express from 'express';
import authController from '../../modules/auth/auth.controller';
import {
  loginValidator,
  signupValidator,
  forgotPasswordValidator,
  newPasswordValidator,
} from '../../midlewares/validators/authValidators';
import validateRequest from '../../midlewares/validators/validateRequest';

const router = express.Router();

router.post('/login', loginValidator, validateRequest, authController.login);

router.post(
  '/register',
  signupValidator,
  validateRequest,
  authController.createNewUser
);

router.post(
  '/forgot_password',
  forgotPasswordValidator,
  validateRequest,
  authController.forgotPassword
);

router.put(
  '/new_password',
  newPasswordValidator,
  validateRequest,
  authController.newPassword
);

export default router;

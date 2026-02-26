import express from 'express';
import authController from '../../controllers/authControllers';
import verifyUserToken from '../../midlewares/verifyUserToken';
import {
  loginValidator,
  signupValidator,
  updateUserValidator,
  forgotPasswordValidator,
  newPasswordValidator,
} from '../../midlewares/validators/authValidators';
import validateRequest from '../../midlewares/validators/validateRequest';

const router = express.Router();

router.post('/login', loginValidator, validateRequest, authController.login);

router.get(
  '/user_information',
  verifyUserToken,
  authController.user_information
);

router.post(
  '/signup',
  signupValidator,
  validateRequest,
  authController.createNewUser
);

router.put(
  '/update_user',
  verifyUserToken,
  updateUserValidator,
  validateRequest,
  authController.updateUser
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

import { body } from 'express-validator';

export const loginValidator = [
  body('user.email').isEmail().withMessage('Email is invalid'),
  body('user.password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

export const signupValidator = [
  body('user.name').notEmpty().withMessage('Name is required'),
  body('user.email').isEmail().withMessage('Email is invalid'),
  body('user.password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('user.document').notEmpty().withMessage('Document is required'),
];

export const updateUserValidator = [
  body('user').notEmpty().withMessage('User data is required'),
];

export const forgotPasswordValidator = [
  body('email').isEmail().withMessage('Email is invalid'),
];

export const newPasswordValidator = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('confirmation_password')
    .isLength({ min: 6 })
    .withMessage('Confirmation password must be at least 6 characters'),
  body('token').notEmpty().withMessage('Token is required'),
];


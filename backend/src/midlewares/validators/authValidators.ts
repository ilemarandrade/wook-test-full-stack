import { body } from 'express-validator';

export const loginValidator = [
  body('user.email')
    .trim()
    .isEmail()
    .withMessage('Email is invalid')
    .normalizeEmail(),
  body('user.password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters').trim(),
];

export const signupValidator = [
  body('user.name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 25 })
    .withMessage('Name must be between 2 and 25 characters'),
  body('user.lastname')
    .trim()
    .notEmpty()
    .withMessage('Lastname is required')
    .isLength({ min: 2, max: 25 })
    .withMessage('Lastname must be between 2 and 25 characters'),
  body('user.email')
    .trim()
    .isEmail()
    .withMessage('Email is invalid')
    .normalizeEmail(),
  body('user.password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('user.document')
    .trim()
    .notEmpty()
    .withMessage('Document is required')
    .matches(/^\d+$/)
    .withMessage('Document must contain only numbers')
    .isLength({ min: 7, max: 15 })
    .withMessage('Document must be between 7 and 15 digits long'),
  body('user.phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required')
    .matches(/^\d+$/)
    .withMessage('Phone must contain only numbers')
    .isLength({ min: 7, max: 15 })
    .withMessage('Phone must be between 7 and 15 digits long'),
];

export const forgotPasswordValidator = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email is invalid')
    .normalizeEmail(),
];

export const newPasswordValidator = [
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('confirmation_password')
    .isLength({ min: 8 })
    .withMessage('Confirmation password must be at least 8 characters'),
  body('token').notEmpty().withMessage('Token is required'),
];


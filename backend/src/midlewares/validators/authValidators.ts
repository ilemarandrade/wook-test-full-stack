import { body } from 'express-validator';

export const loginValidator = [
  body('user.email').isEmail().withMessage('Email is invalid'),
  body('user.password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

export const signupValidator = [
  body('user.name').notEmpty().withMessage('Name is required'),
  body('user.lastname').notEmpty().withMessage('Lastname is required'),
  body('user.email').isEmail().withMessage('Email is invalid'),
  body('user.password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('user.document')
    .notEmpty()
    .withMessage('Document is required')
    .matches(/^\d+$/)
    .withMessage('Document must contain only numbers')
    .isLength({ min: 7, max: 15 })
    .withMessage('Document must be between 7 and 15 digits long'),
  body('user.phone')
    .notEmpty()
    .withMessage('Phone is required')
    .matches(/^\d+$/)
    .withMessage('Phone must contain only numbers')
    .isLength({ min: 7, max: 15 })
    .withMessage('Phone must be between 7 and 15 digits long'),
];

export const updateMeValidator = [
  body('user').notEmpty().withMessage('User data is required'),
  body('user').custom((user) => {
    if (typeof user !== 'object' || user === null) {
      throw new Error('User data must be an object');
    }

    const allowedKeys = ['name', 'lastname', 'document', 'phone', 'lang'];
    const invalidKeys = Object.keys(user).filter((key) => !allowedKeys.includes(key));

    if (invalidKeys.length > 0) {
      throw new Error(
        `User contains invalid fields: ${invalidKeys.join(', ')}`
      );
    }

    return true;
  }),
  body('user.name').optional().isString().withMessage('Name must be a string'),
  body('user.lastname').optional().isString().withMessage('Lastname must be a string'),
  body('user.document').optional().isString().withMessage('Document must be a string'),
  body('user.phone').optional().isString().withMessage('Phone must be a string'),
  body('user.lang')
    .optional()
    .isIn(['es', 'en'])
    .withMessage('Lang must be either \"es\" or \"en\"'),
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


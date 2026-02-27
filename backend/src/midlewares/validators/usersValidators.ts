import { body, query } from 'express-validator';

export const listUsersValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page must be a positive integer')
    .toInt(),

  query('pageSize')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('pageSize must be between 1 and 100')
    .toInt(),

  query('name')
    .optional()
    .isString()
    .withMessage('name must be a string')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('name must be between 2 and 100 characters'),

  query('document')
    .optional()
    .isString()
    .withMessage('document must be a string')
    .matches(/^\d+$/)
    .withMessage('document must contain only numbers'),


  query('phone')
    .optional()
    .isString()
    .withMessage('phone must be a string')
    .matches(/^\d+$/)
    .withMessage('phone must contain only numbers')

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

    if (Object.keys(user).length === 0) {
      throw new Error('User must contain at least one field to update');
    }

    return true;
  }),
  body('user.name')
    .optional()
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 2, max: 25 })
    .withMessage('Name must be between 2 and 25 characters'),
  body('user.lastname')
    .optional()
    .isString()
    .withMessage('Lastname must be a string')
    .isLength({ min: 2, max: 25 })
    .withMessage('Lastname must be between 2 and 25 characters'),
  body('user.document')
    .optional()
    .isString()
    .withMessage('Document must be a string')
    .matches(/^\d+$/)
    .withMessage('Document must contain only numbers')
    .isLength({ min: 7, max: 15 })
    .withMessage('Document must be between 7 and 15 digits long'),
  body('user.phone')
    .optional()
    .isString()
    .withMessage('Phone must be a string')
    .matches(/^\d+$/)
    .withMessage('Phone must contain only numbers')
    .isLength({ min: 7, max: 15 })
    .withMessage('Phone must be between 7 and 15 digits long'),
  body('user.lang')
    .optional()
    .isIn(['es', 'en'])
    .withMessage('Lang must be either \"es\" or \"en\"'),
];

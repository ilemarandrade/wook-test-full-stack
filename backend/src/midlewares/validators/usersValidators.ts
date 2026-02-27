import { query } from 'express-validator';

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
    .trim(),

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
    .withMessage('phone must contain only numbers'),
];


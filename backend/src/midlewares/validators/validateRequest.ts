import { NextFunction, Response } from 'express';
import { validationResult } from 'express-validator';
import handleTraductions from '../../utils/handleTraductions.js';
import { IRequest } from '../../models/Request.js';

const validateRequest = (req: IRequest, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const { lang = 'en' } = req.headers;
    const { t } = handleTraductions(lang);

    return res.status(400).json({
      message: t('message.error_unexpected'),
      errors: errors.array(),
    });
  }

  return next();
};

export default validateRequest;


import { NextFunction, Response } from 'express';
import handleTraductions from '../utils/handleTraductions';
import { IRequest } from '../models/Request';

export const errorHandler = (
  err: unknown,
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  const { lang = 'en' } = req.headers;
  const { t } = handleTraductions(lang);

  return res.status(500).json({
    message: t('message.error_unexpected'),
  });
};


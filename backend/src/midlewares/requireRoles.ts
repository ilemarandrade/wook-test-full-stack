import { NextFunction, Response } from 'express';
import { IRequest } from '../models/Request';
import handleTraductions from '../utils/handleTraductions';

export const requireRoles = (roles: string[]) => {
  return (req: IRequest, res: Response, next: NextFunction) => {
    const { lang = 'en' } = req.headers;
    const { t } = handleTraductions(lang);

    const userRole = req.user?.user?.role;

    console.log('userRole', userRole);
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({
        statusCode: 403,
        response: {
          message: t('message.authorization_incorrect'),
        },
      });
    }

    return next();
  };
};


import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../utils/jwtHelper';
import handleTraductions from '../utils/handleTraductions';
import { IRequest } from '../models/Request';
import { NextFunction, Response } from 'express';

const verifyUserToken = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { lang } = req.headers;
  const { t } = handleTraductions(lang);

  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];

      if (!token) {
        throw new Error('Authentication failed!');
      }

      const verified = jwt.verify(token, getJwtSecret());

      if (verified) {
        req.user = verified;
        req.token = token;
        next();
      } else {
        res
          .status(401)
          .send({ message: t('message.authorization_incorrect') });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: t('message.error_unexpected') });
  }
};

export default verifyUserToken;


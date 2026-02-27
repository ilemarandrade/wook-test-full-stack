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
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(401)
        .send({ message: t('message.authorization_incorrect') });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new Error('Authentication failed!');
    }

    const verified = jwt.verify(token, getJwtSecret());

    if (verified) {
      req.user = verified;
      req.token = token;
      return next();
    } else {
      return res
        .status(401)
        .send({ message: t('message.authorization_incorrect') });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .send({ message: t('message.authorization_incorrect') });
  }
};

export default verifyUserToken;


import authServices from '../services/authServices.js';
import jwt from 'jsonwebtoken';
import handleTraductions from '../utils/handleTraductions.js';
import { Response } from 'express';
import { IRequest } from '../models/Request.js';

const login = async (req: IRequest, res: Response) => {
  const { lang = 'en' } = req.headers;
  const user = req.body.user;
  const { statusCode, response } = await authServices.login({ user, lang });

  res.status(statusCode).send(response);
};

const user_information = async (req: IRequest, res: Response) => {
  const { lang = 'en' } = req.headers;
  const { t } = handleTraductions(lang);

  try {
    const token = req.token;
    if (token) {
      const verified = jwt.verify(token, process.env.SECRET_JWT as string);
      return res.status(200).send(verified);
    }

    throw 'Token not exist';
  } catch (err) {
    console.log(err);
    res.status(401).send({ message: t('message.authorization_incorrect') });
  }
};

const createNewUser = async (req: IRequest, res: Response) => {
  const { lang = 'en' } = req.headers;
  const user = req.body.user;

  const { statusCode, response } = await authServices.createUser({
    user,
    lang,
  });

  res.status(statusCode).send(response);
};

const updateUser = async (req: IRequest, res: Response) => {
  const { lang = 'en' } = req.headers;
  const { user: prevUserData } = req.user; // data save from midleware that verify token
  const dataToUpdateUser = req.body.user;

  const { statusCode, response } = await authServices.updateUser({
    langCurrent: lang,
    prevUserData,
    dataToUpdateUser,
  });

  res.status(statusCode).send(response);
};

const forgotPassword = async (req: IRequest, res: Response) => {
  const { lang = 'en' } = req.headers;
  const { email } = req.body;
  const { statusCode, response } = await authServices.forgotPassword({
    lang,
    email,
  });

  res.status(statusCode).send(response);
};

const newPassword = async (req: IRequest, res: Response) => {
  const { lang = 'en' } = req.headers;
  const { password, confirmation_password, token } = req.body;
  const { statusCode, response } = await authServices.newPassword({
    lang,
    password,
    confirmation_password,
    token,
  });

  res.status(statusCode).send(response);
};

export default {
  newPassword,
  forgotPassword,
  login,
  updateUser,
  createNewUser,
  user_information,
};

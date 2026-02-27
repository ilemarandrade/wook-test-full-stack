import authServices from './auth.service';
import { Response } from 'express';
import { IRequest } from '../../models/Request';

const login = async (req: IRequest, res: Response) => {
  const { lang = 'en' } = req.headers;
  const user = req.body.user;
  const { statusCode, response } = await authServices.login({ user, lang });

  res.status(statusCode).send(response);
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

const authController = {
  newPassword,
  forgotPassword,
  login,
  createNewUser,
};

export default authController;



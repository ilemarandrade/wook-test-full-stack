import authServices from '../services/authServices';
import handleTraductions from '../utils/handleTraductions';
import { Response } from 'express';
import { IRequest } from '../models/Request';
import { userRepository } from '../repositories/userRepository';

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
    const userId = req.user.user.id;

    const user = await userRepository.findById(userId);
    if (!user) {
      return res.status(404).send({ message: t('message.login.wrong_data') });
    }

    const userPayload = {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      document: user.document,
      lang: user.lang,
      role: user.role,
    };

    return res.status(200).send({ user: userPayload });
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
  const currentUser = { user: req.user.user }; // from middleware JWT payload
  const dataToUpdateUser = req.body.user;

  const { statusCode, response } = await authServices.updateUser({
    langCurrent: currentUser.user.lang || lang ,
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

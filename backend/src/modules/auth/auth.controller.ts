import authServices from './auth.service';
import { Response } from 'express';
import { IRequest } from '../../models/Request';
import type { LoginDto } from './dtos/LoginDto';

const login = async (req: IRequest<LoginDto>, res: Response) => {
  const { lang = 'en' } = req.headers;
  const dto = req.dto as LoginDto;

  const { statusCode, response } = await authServices.login({
    user: dto.user,
    lang,
  });

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

const authController = {
  login,
  createNewUser,
};

export default authController;



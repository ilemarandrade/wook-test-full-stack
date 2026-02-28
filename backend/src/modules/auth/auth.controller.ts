import authServices from './auth.service';
import { Response } from 'express';
import { IRequest } from '../../models/Request';
import type { LoginDto } from './dtos/LoginDto';
import type { SignupUserDto } from './dtos/SignupUserDto';
import { getRequestLang } from '../../utils/getRequestLang';

const login = async (req: IRequest<LoginDto>, res: Response) => {
  const lang = getRequestLang(req);
  const dto = req.dto as LoginDto;

  const { statusCode, response } = await authServices.login({
    user: dto.user,
    lang,
  });

  res.status(statusCode).send(response);
};

const createNewUser = async (req: IRequest<SignupUserDto>, res: Response) => {
  const lang = getRequestLang(req);
  const dto = req.dto as SignupUserDto;

  const { statusCode, response } = await authServices.createUser({
    user: dto.user,
    lang,
  });

  res.status(statusCode).send(response);
};

const authController = {
  login,
  createNewUser,
};

export default authController;

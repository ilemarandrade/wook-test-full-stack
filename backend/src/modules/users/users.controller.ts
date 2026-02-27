import { Response } from 'express';
import { IRequest } from '../../models/Request';
import handleTraductions from '../../utils/handleTraductions';
import { userRepository } from './users.repository';
import { updateMe as updateMeService, listUsers as listUsersService } from './users.service';
import { toUserDTO } from './dtos/UserDTO';
import type { UpdateMeDto } from './dtos/UpdateMeDto';
import type { ListUsersQueryDto } from './dtos/ListUsersQueryDto';
import { getRequestLang } from '../../utils/getRequestLang';

export const getMe = async (req: IRequest, res: Response) => {
  const lang = getRequestLang(req);
  const { t } = handleTraductions(lang);

  try {
    const userId = req.user.user.id;

    const user = await userRepository.findById(userId);
    if (!user) {
      return res.status(404).send({ message: t('message.login.wrong_data') });
    }

    const userDto = toUserDTO(user);

    return res.status(200).send({ user: userDto });
  } catch (err) {
    console.log(err);
    res.status(401).send({ message: t('message.authorization_incorrect') });
  }
};

export const updateMe = async (req: IRequest<UpdateMeDto>, res: Response) => {
  const lang = getRequestLang(req);
  const currentUser = { user: req.user.user }; // from middleware JWT payload
  const dto = req.dto as UpdateMeDto;
  const dataToUpdateUser = dto.user;

  const { statusCode, response } = await updateMeService({
    langCurrent: currentUser.user.lang || lang,
    dataToUpdateUser: { ...dataToUpdateUser, id: currentUser.user.id },
  });

  res.status(statusCode).send(response);
};

export const listUsers = async (req: IRequest<ListUsersQueryDto>, res: Response) => {
  const dto = req.dto as ListUsersQueryDto;

  const page = dto.page ?? 1;
  const pageSize = dto.pageSize ?? 10;
  const { name, document, phone } = dto;

  const { statusCode, response } = await listUsersService({
    page,
    pageSize,
    name,
    document,
    phone,
  });

  res.status(statusCode).send(response);
};


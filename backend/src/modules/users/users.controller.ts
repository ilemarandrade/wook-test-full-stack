import { Response } from 'express';
import { IRequest } from '../../models/Request';
import handleTraductions from '../../utils/handleTraductions';
import { userRepository } from './users.repository';
import { updateMe as updateMeService } from './users.service';

export const getMe = async (req: IRequest, res: Response) => {
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

export const updateMe = async (req: IRequest, res: Response) => {
  const { lang = 'en' } = req.headers;
  const currentUser = { user: req.user.user }; // from middleware JWT payload
  const dataToUpdateUser = req.body.user;

  const { statusCode, response } = await updateMeService({
    langCurrent: currentUser.user.lang || lang,
    dataToUpdateUser: { ...dataToUpdateUser, id: currentUser.user.id },
  });

  res.status(statusCode).send(response);
};



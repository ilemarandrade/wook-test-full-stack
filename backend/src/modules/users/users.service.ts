import handleTraductions from '../../utils/handleTraductions';
import { IResponseServices, Lang } from '../../models/Request';
import { userRepository } from './users.repository';

interface IUpdateMeInput {
  dataToUpdateUser: {
    id: string;
    name?: string;
    lastname?: string;
    document?: string;
    phone?: string;
    lang?: Lang;
  };
  langCurrent: Lang;
}

export const updateMe = async ({
  dataToUpdateUser,
  langCurrent,
}: IUpdateMeInput): Promise<IResponseServices> => {
  const { t } = handleTraductions(dataToUpdateUser.lang || langCurrent);

  const { id: userId, ...dataToSave } = dataToUpdateUser;
  try {
    await userRepository.update(userId, dataToSave);

    return {
      statusCode: 200,
      response: { message: t('message.success') },
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      response: { message: t('message.error_unexpected') },
    };
  }
};



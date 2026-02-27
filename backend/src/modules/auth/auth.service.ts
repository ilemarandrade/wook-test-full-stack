import jwt from 'jsonwebtoken';
import handleTraductions from '../../utils/handleTraductions';
import { encrypt, compare } from '../../utils/encryptPassword';
import { IResponseServices, Lang } from '../../models/Request';
import { getJwtSecret } from '../../utils/jwtHelper';
import { userRepository } from '../users/users.repository';

interface ILogin {
  user: {
    password: string;
    email: string;
  };
  lang: Lang;
}

interface IResponseLogin {
  jwt?: string;
  message?: string;
}

const login = async ({
  user,
  lang,
}: ILogin): Promise<IResponseServices<IResponseLogin>> => {
  const { t } = handleTraductions(lang);

  try {
    const foundUser = await userRepository.findByEmail(user.email);

    if (!foundUser) {
      return {
        statusCode: 400,
        response: { message: t('message.login.wrong_data') },
      };
    }

    const isCorrectPassword = await compare(user.password, foundUser.password);

    if (!isCorrectPassword) {
      return {
        statusCode: 400,
        response: { message: t('message.login.wrong_data') },
      };
    }

    const userPayload = {
      id: foundUser.id,
      name: foundUser.name,
      lastname: foundUser.lastname,
      email: foundUser.email,
      phone: foundUser.phone,
      document: foundUser.document,
      lang: foundUser.lang,
      role: foundUser.role,
    };

    const token = jwt.sign(
      {
        user: userPayload,
      },
      getJwtSecret(),
      { expiresIn: '5m' }
    );

    return {
      statusCode: 200,
      response: {
        jwt: token,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      response: { message: t('message.error_unexpected') },
    };
  }
};

interface ICreateUserInput {
  user: {
    name: string;
    lastname?: string;
    email: string;
    password: string;
    document: string;
    phone?: string;
    lang?: Lang;
  };
  lang: Lang;
}

const createUser = async ({
  user,
  lang,
}: ICreateUserInput): Promise<IResponseServices> => {
  const { t } = handleTraductions(lang);

  try {
    const userExistWithThisEmail = await userRepository.findByEmail(user.email);
    const userExistWithThisDocument = await userRepository.findByDocument(
      user.document
    );
    const userExistWithThisPhone = user.phone
      ? await userRepository.findByPhone(user.phone)
      : null;

    if (
      userExistWithThisEmail ||
      userExistWithThisDocument ||
      userExistWithThisPhone
    ) {
      return {
        statusCode: 400,
        response: { message: t('message.sign_up.user_exist') },
      };
    }

    const passwordEncrypt = await encrypt(user.password);

    await userRepository.create({
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      password: passwordEncrypt,
      document: user.document,
      phone: user.phone,
      lang: user.lang,
    });

    return {
      statusCode: 200,
      response: { message: t('message.create_user.success') },
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      response: { message: t('message.error_unexpected') },
    };
  }
};

export default { login, createUser };

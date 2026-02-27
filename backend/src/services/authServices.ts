import jwt from 'jsonwebtoken';
import handleTraductions from '../utils/handleTraductions';
import { transporter } from '../utils/sendEmail';
import recoveryPasswordMail from '../constants/mails/recoveryPassword';
import { encrypt, compare } from '../utils/encryptPassword';
import { IResponseServices, Lang } from '../models/Request';
import { userRepository } from '../repositories/userRepository';
import { getJwtSecret } from '../utils/jwtHelper';

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

    if (userExistWithThisEmail || userExistWithThisDocument) {
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

interface IUpdateUser {
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

const updateUser = async ({
  dataToUpdateUser,
  langCurrent,
}: IUpdateUser): Promise<IResponseServices> => {
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

interface IForgotPassword {
  lang: Lang;
  email: string;
}

const forgotPassword = async ({
  lang,
  email,
}: IForgotPassword): Promise<IResponseServices> => {
  const { t } = handleTraductions(lang);

  try {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      return {
        statusCode: 400,
        response: { message: t('message.login.wrong.data') },
      };
    }

    const token_to_reset_password = jwt.sign(
      { User: { id: user.id } },
      getJwtSecret(),
      { expiresIn: '10m' }
    );

    await userRepository.updateResetPasswordToken(user.id, token_to_reset_password);

    await transporter.sendMail({
      from: 'Wallet Andrade',
      to: email,
      subject: t('message.forgot_password.title_email'),
      text: t('message.forgot_password.title_email'),
      html: recoveryPasswordMail[lang](token_to_reset_password),
    });

    return {
      statusCode: 200,
      response: { message: t('message.forgot_password.check_your_email') },
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      response: { message: t('message.error_unexpected') },
    };
  }
};

interface INewPassword {
  lang: Lang;
  password: string;
  confirmation_password: string;
  token: string;
}

interface JwtPayload {
  User: {
    id: string;
  };
}

const newPassword = async ({
  lang,
  password,
  confirmation_password,
  token,
}: INewPassword): Promise<IResponseServices> => {
  const { t } = handleTraductions(lang);

  try {
    if (password !== confirmation_password) {
      return {
        statusCode: 400,
        response: {
          message: t('message.forgot_password.passwords_do_not_match'),
        },
      };
    }

    const {
      User: { id },
    } = jwt.verify(token, getJwtSecret()) as JwtPayload;

    const user = await userRepository.findById(id);

    if (!user || user.token_to_reset_password !== token) {
      throw new Error('Invalid token');
    }

    const newPasswordFormat = await encrypt(password);
    await userRepository.update(id, {
      ...{},
      // password is not part of UpdateUserData, so we update directly via prisma
    });

    await userRepository.updateResetPasswordToken(id, '');

    // Actualizar password directamente usando prisma para no exponerlo en DTOs
    await (await import('../prisma/client')).default.user.update({
      where: { id },
      data: { password: newPasswordFormat },
    });

    return {
      statusCode: 200,
      response: {
        message: t('message.forgot_password.success_update_password'),
      },
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 400,
      response: {
        message: t('message.forgot_password.expired_token'),
      },
    };
  }
};

export default { login, createUser, updateUser, forgotPassword, newPassword };

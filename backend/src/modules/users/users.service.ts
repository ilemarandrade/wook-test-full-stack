import handleTraductions from '../../utils/handleTraductions';
import { IResponseServices, Lang } from '../../models/Request';
import { userRepository } from './users.repository';
import { User } from '@prisma/client';

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

interface IListUsersInput {
  page: number;
  pageSize: number;
}

type UserWithoutPassword = Omit<User, 'password'>;

interface ListUsersResponse {
  users: UserWithoutPassword[];
  itemsTotal: number;
  page: number;
  totalPage: number;
  nextPage?: number;
  prevPage?: number;
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

export const listUsers = async ({
  page,
  pageSize,
}: IListUsersInput): Promise<IResponseServices<ListUsersResponse>> => {
  try {
    const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
    const safePageSize = Number.isNaN(pageSize) || pageSize < 1 ? 10 : pageSize;

    const skip = (safePage - 1) * safePageSize;
    const take = safePageSize;

    const [rawUsers, itemsTotal] = await Promise.all([
      userRepository.findAll({
        skip,
        take,
      }),
      userRepository.countAll(),
    ]);

    const users: UserWithoutPassword[] = rawUsers.map(({ password, ...rest }) => rest);
    const totalPage = itemsTotal > 0 ? Math.ceil(itemsTotal / safePageSize) : 0;

    const response: ListUsersResponse = {
      users,
      itemsTotal,
      page: safePage,
      totalPage,
    };

    if (safePage > 1) {
      response.prevPage = safePage - 1;
    }

    if (totalPage > 0 && safePage < totalPage) {
      response.nextPage = safePage + 1;
    }

    return {
      statusCode: 200,
      response,
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      response: {
        users: [],
        itemsTotal: 0,
        page: 1,
        totalPage: 0,
      },
    };
  }
};


import handleTraductions from '../../utils/handleTraductions';
import { IResponseServices, Lang } from '../../models/Request';
import { userRepository } from './users.repository';
import { Prisma, User } from '@prisma/client';
import { toUserDTO, UserResponseDto } from './dtos/UserDTO';

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
  name?: string;
  document?: string;
  phone?: string;
}

interface ListUsersResponse {
  users: UserResponseDto[];
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

  const dataToSaveCleaned = Object.fromEntries(
    Object.entries(dataToSave).filter(([, value]) => value !== undefined && value !== '')
  );

  try {
    await userRepository.update(userId, dataToSaveCleaned);

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
  name,
  document,
  phone,
}: IListUsersInput): Promise<IResponseServices<ListUsersResponse>> => {
  try {
    const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
    const safePageSize = Number.isNaN(pageSize) || pageSize < 1 ? 10 : pageSize;

    const skip = (safePage - 1) * safePageSize;
    const take = safePageSize;

    const filters: Prisma.UserWhereInput[] = [];

    if (name) {
      filters.push({
        OR: [
          {
            name: {
              contains: name,
              mode: 'insensitive',
            },
          },
          {
            lastname: {
              contains: name,
              mode: 'insensitive',
            },
          },
        ],
      });
    }

    if (document) {
      filters.push({
        document: {
          contains: document,
        },
      });
    }

    if (phone) {
      filters.push({
        phone: {
          contains: phone,
        },
      });
    }

    const where: Prisma.UserWhereInput | undefined =
      filters.length > 0 ? { AND: filters } : undefined;

    const [rawUsers, itemsTotal] = await Promise.all([
      userRepository.findAll({
        skip,
        take,
        where,
      }),
      userRepository.countAll(where),
    ]);

    const users: UserResponseDto[] = rawUsers.map((user: User) => toUserDTO(user));
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


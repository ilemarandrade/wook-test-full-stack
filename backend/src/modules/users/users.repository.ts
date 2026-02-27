import { Prisma, User } from '@prisma/client';
import prisma from '../../prisma/client';

export interface CreateUserData {
  name: string;
  lastname?: string;
  email: string;
  password: string;
  document: string;
  phone?: string;
  lang?: string | null;
}

export interface UpdateUserData {
  name?: string;
  lastname?: string;
  document?: string;
  phone?: string;
  lang?: string | null;
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByDocument(document: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  findAll(params?: { skip?: number; take?: number; where?: Prisma.UserWhereInput }): Promise<User[]>;
  countAll(where?: Prisma.UserWhereInput): Promise<number>;
  create(data: CreateUserData): Promise<User>;
  update(id: string, data: UpdateUserData): Promise<User>;
  updateResetPasswordToken(id: string, token: string): Promise<User>;
  findByResetPasswordToken(token: string): Promise<User | null>;
}

class PrismaUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findByDocument(document: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { document } });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { phone } });
  }

  async findAll(params?: { skip?: number; take?: number; where?: Prisma.UserWhereInput }): Promise<User[]> {
    const { skip, take, where } = params || {};
    return prisma.user.findMany({
      skip,
      take,
      where,
    });
  }

  async countAll(where?: Prisma.UserWhereInput): Promise<number> {
    return prisma.user.count({ where });
  }

  async create(data: CreateUserData): Promise<User> {
    return prisma.user.create({
      data: {
        name: data.name,
        lastname: data.lastname ?? '',
        email: data.email,
        password: data.password,
        document: data.document,
        phone: data.phone ?? '',
        lang: data.lang ?? null,
      },
    });
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateResetPasswordToken(id: string, token: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { token_to_reset_password: token },
    });
  }

  async findByResetPasswordToken(token: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: { token_to_reset_password: token },
    });
  }
}

export const userRepository = new PrismaUserRepository();



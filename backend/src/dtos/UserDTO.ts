import { User } from '@prisma/client';

export interface UserDTO {
  id: string;
  name: string;
  lastname: string;
  email: string;
  document: string;
  phone: string;
  lang: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export const toUserDTO = (user: User): UserDTO => ({
  id: user.id,
  name: user.name,
  lastname: user.lastname,
  email: user.email,
  document: user.document,
  phone: user.phone,
  lang: user.lang ?? null,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});


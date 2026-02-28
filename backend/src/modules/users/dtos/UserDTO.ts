import type { User } from '@prisma/client';

export type UserResponseDto = Omit<
  User,
  'password' | 'token_to_reset_password'
>;

export function toUserDTO(user: User): UserResponseDto {
  const { password, token_to_reset_password, ...rest } = user;
  return rest;
}

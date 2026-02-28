export interface LoginDto {
  user: {
    email: string;
    password: string;
  };
}

/**
 * Mapea el body validado por express-validator a LoginDto.
 * Solo incluye campos permitidos (email, password dentro de user).
 */
export function toLoginDto(body: unknown): LoginDto {
  const b = body as { user?: { email?: string; password?: string } };

  return {
    user: {
      email: b.user?.email ?? '',
      password: b.user?.password ?? '',
    },
  };
}

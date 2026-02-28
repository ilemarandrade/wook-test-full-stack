import { Lang } from '../../../models/Request';

export interface SignupUserDto {
  user: {
    name: string;
    lastname: string;
    email: string;
    password: string;
    document: string;
    phone: string;
    lang?: Lang;
  };
}

/**
 * Mapea el body validado por express-validator a SignupUserDto.
 * Solo incluye los campos permitidos dentro de user.
 */
export function toSignupUserDto(body: unknown): SignupUserDto {
  const b = body as {
    user?: {
      name?: string;
      lastname?: string;
      email?: string;
      password?: string;
      document?: string;
      phone?: string;
      lang?: Lang;
    };
  };

  return {
    user: {
      name: b.user?.name ?? '',
      lastname: b.user?.lastname ?? '',
      email: b.user?.email ?? '',
      password: b.user?.password ?? '',
      document: b.user?.document ?? '',
      phone: b.user?.phone ?? '',
      lang: b.user?.lang,
    },
  };
}

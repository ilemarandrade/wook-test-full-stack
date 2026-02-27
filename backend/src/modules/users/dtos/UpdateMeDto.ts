import { Lang } from '../../../models/Request';

export interface UpdateMeDto {
  user: {
    name?: string;
    lastname?: string;
    document?: string;
    phone?: string;
    lang?: Lang;
  };
}

/**
 * Mapea el body validado por express-validator a UpdateMeDto.
 * Solo incluye los campos permitidos dentro de user.
 */
export function toUpdateMeDto(body: unknown): UpdateMeDto {
  const b = body as {
    user?: {
      name?: string;
      lastname?: string;
      document?: string;
      phone?: string;
      lang?: Lang;
    };
  };

  return {
    user: {
      name: b.user?.name,
      lastname: b.user?.lastname,
      document: b.user?.document,
      phone: b.user?.phone,
      lang: b.user?.lang,
    },
  };
}


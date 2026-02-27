import { IRequest, Lang } from '../models/Request';

export function getRequestLang(req: IRequest): Lang {
  const headerLang = req.headers.lang;
  const userLang = (req.user?.user?.lang as Lang | undefined) ?? undefined;

  if (headerLang === 'es' || headerLang === 'en') {
    return headerLang;
  }

  if (userLang === 'es' || userLang === 'en') {
    return userLang;
  }

  return 'es';
}


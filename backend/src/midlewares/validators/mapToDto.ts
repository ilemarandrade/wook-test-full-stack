import { NextFunction, Response } from 'express';
import { IRequest } from '../../models/Request';

type Source = 'body' | 'query' | 'params';

/**
 * Asigna req.dto con el resultado de mapear req[source].
 * Debe usarse después de los validadores de express-validator y validateRequest.
 */
export function mapToDto<T>(mapper: (data?: unknown) => T, source: Source = 'body') {
  return (req: IRequest, _res: Response, next: NextFunction) => {
    const data = source === 'body' ? req.body : source === 'query' ? req.query : req.params;
    req.dto = mapper(data) as T;
    next();
  };
}

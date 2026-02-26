import { Request } from 'express';

export type Lang = 'es' | 'en';

export interface IResponse {
  message: string;
}
export interface IResponseServices<GResponse = IResponse> {
  statusCode: number;
  response: GResponse;
}

export interface ICommonServices {
  user_id: number;
  lang: Lang;
}

interface Header {
  lang?: Lang;
}

export interface IRequest extends Request {
  token?: string;
  user?: any;
  headers: Request['headers'] & Header;
}

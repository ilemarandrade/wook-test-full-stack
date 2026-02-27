import { Response } from 'express';
import { mapToDto } from '../../../src/midlewares/validators/mapToDto';
import { IRequest } from '../../../src/models/Request';

describe('mapToDto', () => {
  let req: Partial<IRequest>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = { body: {}, query: {}, params: {} };
    res = {};
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should use source "body": mapper receives req.body and req.dto is set', () => {
    const body = { email: 'a@b.com', password: 'secret' };
    req.body = body;
    const mapper = jest.fn((data: unknown) => ({ ...(data as object), mapped: true }));

    const middleware = mapToDto(mapper, 'body');
    middleware(req as IRequest, res as Response, next);

    expect(mapper).toHaveBeenCalledWith(body);
    expect(req.dto).toEqual({ ...body, mapped: true });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should use source "query": mapper receives req.query', () => {
    const query = { page: '1', limit: '10' };
    req.query = query;
    const mapper = jest.fn((data: unknown) => data);

    const middleware = mapToDto(mapper, 'query');
    middleware(req as IRequest, res as Response, next);

    expect(mapper).toHaveBeenCalledWith(query);
    expect(req.dto).toEqual(query);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should use source "params": mapper receives req.params', () => {
    const params = { id: '123' };
    req.params = params;
    const mapper = jest.fn((data: unknown) => data);

    const middleware = mapToDto(mapper, 'params');
    middleware(req as IRequest, res as Response, next);

    expect(mapper).toHaveBeenCalledWith(params);
    expect(req.dto).toEqual(params);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should call next() once', () => {
    const mapper = jest.fn(() => ({}));
    const middleware = mapToDto(mapper, 'body');
    middleware(req as IRequest, res as Response, next);
    expect(next).toHaveBeenCalledTimes(1);
  });
});

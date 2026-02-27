import { Response } from 'express';
import { errorHandler } from '../../src/midlewares/errorHandler';
import { IRequest } from '../../src/models/Request';

jest.mock('../../src/utils/handleTraductions', () => ({
  __esModule: true,
  default: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../../src/utils/getRequestLang', () => ({
  getRequestLang: jest.fn(() => 'es'),
}));

describe('errorHandler', () => {
  let req: Partial<IRequest>;
  let res: Partial<Response> & { headersSent?: boolean };
  let next: jest.Mock;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      headersSent: false,
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should call next(err) without sending response when res.headersSent is true', () => {
    res.headersSent = true;
    const err = new Error('Some error');

    errorHandler(err, req as IRequest, res as Response, next);

    expect(next).toHaveBeenCalledWith(err);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return 500 with translated message when res.headersSent is false', () => {
    res.headersSent = false;
    const err = new Error('Unexpected error');

    errorHandler(err, req as IRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'message.error_unexpected',
    });
    expect(next).not.toHaveBeenCalled();
  });
});

import { Response } from 'express';
import { requireRoles } from '../../src/midlewares/requireRoles';
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

describe('requireRoles', () => {
  let req: Partial<IRequest>;
  let res: Partial<Response>;
  let next: jest.Mock;
  let middleware: ReturnType<typeof requireRoles>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    middleware = requireRoles(['ADMIN']);
    jest.clearAllMocks();
  });

  it('should return 403 when req.user is undefined', () => {
    req.user = undefined;

    middleware(req as IRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 403,
      response: {
        message: 'message.authorization_incorrect',
      },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 when req.user.user.role is not in the roles array', () => {
    req.user = { user: { role: 'USER' } };

    middleware(req as IRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 403,
      response: {
        message: 'message.authorization_incorrect',
      },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next() when req.user.user.role is ADMIN and roles includes ADMIN', () => {
    req.user = { user: { role: 'ADMIN' } };

    middleware(req as IRequest, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});

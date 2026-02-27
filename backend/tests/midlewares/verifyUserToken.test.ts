import { Response } from 'express';
import verifyUserToken from '../../src/midlewares/verifyUserToken';
import { IRequest } from '../../src/models/Request';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

jest.mock('../../src/utils/jwtHelper', () => ({
  getJwtSecret: jest.fn(() => 'test-secret'),
}));

jest.mock('../../src/utils/handleTraductions', () => ({
  __esModule: true,
  default: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../../src/utils/getRequestLang', () => ({
  getRequestLang: jest.fn(() => 'es'),
}));

const jwt = jest.requireMock('jsonwebtoken') as { verify: jest.Mock };

describe('verifyUserToken', () => {
  let req: Partial<IRequest>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should return 401 when Authorization header is absent', async () => {
    req.headers = {};

    await verifyUserToken(
      req as IRequest,
      res as Response,
      next
    );

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({
      message: 'message.authorization_incorrect',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when authorization has no Bearer or token', async () => {
    req.headers = { authorization: 'InvalidFormat' };

    await verifyUserToken(
      req as IRequest,
      res as Response,
      next
    );

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({
      message: 'message.authorization_incorrect',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when token is empty after Bearer', async () => {
    req.headers = { authorization: 'Bearer ' };

    await verifyUserToken(
      req as IRequest,
      res as Response,
      next
    );

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({
      message: 'message.authorization_incorrect',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should set req.user and req.token and call next() when token is valid', async () => {
    const token = 'valid.jwt.token';
    const payload = { user: { id: 1, role: 'ADMIN' } };
    req.headers = { authorization: `Bearer ${token}` };
    jwt.verify.mockReturnValue(payload);

    await verifyUserToken(
      req as IRequest,
      res as Response,
      next
    );

    expect(req.user).toEqual(payload);
    expect(req.token).toBe(token);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });

  it('should return 401 when jwt.verify throws (invalid token)', async () => {
    req.headers = { authorization: 'Bearer invalid.token' };
    jwt.verify.mockImplementation(() => {
      throw new Error('invalid token');
    });

    await verifyUserToken(
      req as IRequest,
      res as Response,
      next
    );

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({
      message: 'message.authorization_incorrect',
    });
    expect(next).not.toHaveBeenCalled();
  });
});

import { Response } from 'express';
import validateRequest from '../../../src/midlewares/validators/validateRequest';
import { IRequest } from '../../../src/models/Request';

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

jest.mock('../../../src/utils/handleTraductions', () => ({
  __esModule: true,
  default: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../../../src/utils/getRequestLang', () => ({
  getRequestLang: jest.fn(() => 'es'),
}));

const { validationResult } = jest.requireMock('express-validator') as {
  validationResult: jest.Mock;
};

describe('validateRequest', () => {
  let req: Partial<IRequest>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should call next() when validationResult is empty', () => {
    validationResult.mockReturnValue({
      isEmpty: () => true,
    });

    validateRequest(req as IRequest, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return 400 with message and errors when validationResult has errors', () => {
    const errorsMapped = { email: { msg: 'Invalid email' } };
    validationResult.mockReturnValue({
      isEmpty: () => false,
      mapped: () => errorsMapped,
    });

    validateRequest(req as IRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'message.bad_request.dto_invalid',
      errors: errorsMapped,
    });
    expect(next).not.toHaveBeenCalled();
  });
});

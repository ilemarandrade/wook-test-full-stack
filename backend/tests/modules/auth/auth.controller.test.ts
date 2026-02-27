import { Response } from 'express';
import authController from '../../../src/modules/auth/auth.controller';
import authServices from '../../../src/modules/auth/auth.service';
import type { LoginDto } from '../../../src/modules/auth/dtos/LoginDto';
import type { SignupUserDto } from '../../../src/modules/auth/dtos/SignupUserDto';
import { IRequest } from '../../../src/models/Request';

jest.mock('../../../src/modules/auth/auth.service', () => ({
  __esModule: true,
  default: {
    login: jest.fn(),
    createUser: jest.fn(),
  },
}));

jest.mock('../../../src/utils/getRequestLang', () => ({
  getRequestLang: jest.fn(() => 'en'),
}));

describe('auth.controller', () => {
  let req: Partial<IRequest<LoginDto | SignupUserDto>>;
  let res: Partial<Response>;
  const mockSend = jest.fn();
  const mockStatus = jest.fn().mockReturnValue({ send: mockSend });

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      dto: undefined,
      headers: { lang: 'en' },
    };
    res = {
      status: mockStatus,
      send: mockSend,
    };
  });

  describe('login', () => {
    it('should call authServices.login with dto.user and lang, then res.status(statusCode).send(response)', async () => {
      const dto: LoginDto = {
        user: { email: 'john@example.com', password: 'secret' },
      };
      req.dto = dto;

      const serviceResponse = { statusCode: 200, response: { jwt: 'fake-jwt' } };
      (authServices.login as jest.Mock).mockResolvedValue(serviceResponse);

      await authController.login(req as IRequest<LoginDto>, res as Response);

      expect(authServices.login).toHaveBeenCalledWith({
        user: dto.user,
        lang: 'en',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(serviceResponse.response);
    });

    it('should send 401 response when service returns 401', async () => {
      req.dto = { user: { email: 'bad@example.com', password: 'wrong' } };

      (authServices.login as jest.Mock).mockResolvedValue({
        statusCode: 401,
        response: { message: 'message.login.wrong_data' },
      });

      await authController.login(req as IRequest<LoginDto>, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({ message: 'message.login.wrong_data' });
    });
  });

  describe('createNewUser', () => {
    it('should call authServices.createUser with dto.user and lang, then res.status(statusCode).send(response)', async () => {
      const dto: SignupUserDto = {
        user: {
          name: 'Jane',
          lastname: 'Doe',
          email: 'jane@example.com',
          password: 'secret',
          document: '87654321',
          phone: '555-1234',
        },
      };
      req.dto = dto;

      const serviceResponse = { statusCode: 200, response: { message: 'message.create_user.success' } };
      (authServices.createUser as jest.Mock).mockResolvedValue(serviceResponse);

      await authController.createNewUser(req as IRequest<SignupUserDto>, res as Response);

      expect(authServices.createUser).toHaveBeenCalledWith({
        user: dto.user,
        lang: 'en',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(serviceResponse.response);
    });

    it('should send 400 response when service returns user exists', async () => {
      req.dto = {
        user: {
          name: 'Jane',
          lastname: 'Doe',
          email: 'existing@example.com',
          password: 'secret',
          document: '87654321',
          phone: '555-1234',
        },
      };

      (authServices.createUser as jest.Mock).mockResolvedValue({
        statusCode: 400,
        response: { message: 'message.sign_up.user_exist' },
      });

      await authController.createNewUser(req as IRequest<SignupUserDto>, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ message: 'message.sign_up.user_exist' });
    });
  });
});

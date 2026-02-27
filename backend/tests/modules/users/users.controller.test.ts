import { Response } from 'express';
import * as usersController from '../../../src/modules/users/users.controller';
import { userRepository } from '../../../src/modules/users/users.repository';
import * as usersService from '../../../src/modules/users/users.service';
import type { UpdateMeDto } from '../../../src/modules/users/dtos/UpdateMeDto';
import type { ListUsersQueryDto } from '../../../src/modules/users/dtos/ListUsersQueryDto';
import { IRequest } from '../../../src/models/Request';
import type { User } from '@prisma/client';

jest.mock('../../../src/modules/users/users.repository', () => ({
  userRepository: {
    findById: jest.fn(),
  },
}));

jest.mock('../../../src/modules/users/users.service', () => ({
  updateMe: jest.fn(),
  listUsers: jest.fn(),
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

describe('users.controller', () => {
  let req: Partial<IRequest>;
  let res: Partial<Response>;
  const mockSend = jest.fn();
  const mockStatus = jest.fn().mockReturnValue({ send: mockSend });

  const mockUserFromDb: User = {
    id: 'user-123',
    name: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
    password: 'hashed',
    document: '12345678',
    phone: '555-555',
    lang: 'en',
    role: 'USER',
    token_to_reset_password: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      user: { user: { id: 'user-123', lang: 'en' } },
      headers: {},
    };
    res = {
      status: mockStatus,
      send: mockSend,
    };
  });

  describe('getMe', () => {
    it('should return 200 and { user: userDto } when user exists', async () => {
      (userRepository.findById as jest.Mock).mockResolvedValue(mockUserFromDb);

      await usersController.getMe(req as IRequest, res as Response);

      expect(userRepository.findById).toHaveBeenCalledWith('user-123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        user: {
          id: mockUserFromDb.id,
          name: mockUserFromDb.name,
          lastname: mockUserFromDb.lastname,
          email: mockUserFromDb.email,
          document: mockUserFromDb.document,
          phone: mockUserFromDb.phone,
          lang: mockUserFromDb.lang,
          role: mockUserFromDb.role,
          createdAt: mockUserFromDb.createdAt,
          updatedAt: mockUserFromDb.updatedAt,
        },
      });
    });

    it('should return 404 with message when user not found', async () => {
      (userRepository.findById as jest.Mock).mockResolvedValue(null);

      await usersController.getMe(req as IRequest, res as Response);

      expect(userRepository.findById).toHaveBeenCalledWith('user-123');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: 'message.login.wrong_data' });
    });

    it('should return 401 when findById throws', async () => {
      (userRepository.findById as jest.Mock).mockRejectedValue(new Error('DB error'));

      await usersController.getMe(req as IRequest, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({ message: 'message.authorization_incorrect' });
    });
  });

  describe('updateMe', () => {
    it('should call updateMeService with dataToUpdateUser (including id from token) and langCurrent', async () => {
      const dto: UpdateMeDto = {
        user: { name: 'Jane', lastname: 'Smith' },
      };
      req.dto = dto;
      req.user = { user: { id: 'user-123', lang: 'en' } };

      (usersService.updateMe as jest.Mock).mockResolvedValue({
        statusCode: 200,
        response: { message: 'message.success' },
      });

      await usersController.updateMe(req as IRequest<UpdateMeDto>, res as Response);

      expect(usersService.updateMe).toHaveBeenCalledWith({
        langCurrent: 'en',
        dataToUpdateUser: {
          ...dto.user,
          id: 'user-123',
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ message: 'message.success' });
    });
  });

  describe('listUsers', () => {
    it('should call listUsersService with page, pageSize, name, document, phone from dto', async () => {
      const dto: ListUsersQueryDto = {
        page: 2,
        pageSize: 5,
        name: 'John',
        document: '12',
        phone: '555',
      };
      req.dto = dto;

      const serviceResponse = {
        statusCode: 200,
        response: {
          users: [],
          itemsTotal: 0,
          page: 2,
          totalPage: 0,
        },
      };
      (usersService.listUsers as jest.Mock).mockResolvedValue(serviceResponse);

      await usersController.listUsers(req as IRequest<ListUsersQueryDto>, res as Response);

      expect(usersService.listUsers).toHaveBeenCalledWith({
        page: 2,
        pageSize: 5,
        name: 'John',
        document: '12',
        phone: '555',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(serviceResponse.response);
    });

    it('should use defaults page 1 and pageSize 10 when dto has no page/pageSize', async () => {
      req.dto = {};

      (usersService.listUsers as jest.Mock).mockResolvedValue({
        statusCode: 200,
        response: { users: [], itemsTotal: 0, page: 1, totalPage: 0 },
      });

      await usersController.listUsers(req as IRequest<ListUsersQueryDto>, res as Response);

      expect(usersService.listUsers).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        name: undefined,
        document: undefined,
        phone: undefined,
      });
    });
  });
});

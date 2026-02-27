import * as usersService from '../../../src/modules/users/users.service';

jest.mock('../../../src/modules/users/users.repository', () => ({
  __esModule: true,
  userRepository: {
    update: jest.fn(),
    findAll: jest.fn(),
    countAll: jest.fn(),
  },
}));

jest.mock('../../../src/utils/handleTraductions', () => ({
  __esModule: true,
  default: () => ({
    t: (key: string) => key,
  }),
}));

const { userRepository } = jest.requireMock(
  '../../../src/modules/users/users.repository'
) as {
  userRepository: {
    update: jest.Mock;
    findAll: jest.Mock;
    countAll: jest.Mock;
  };
};

describe('users.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateMe', () => {
    it('should pass only defined non-empty fields to update', async () => {
      userRepository.update.mockResolvedValue({});

      await usersService.updateMe({
        dataToUpdateUser: {
          id: 'user-1',
          name: 'John',
          lastname: '',
          document: undefined,
          phone: '555',
        },
        langCurrent: 'en',
      });

      expect(userRepository.update).toHaveBeenCalledWith('user-1', {
        name: 'John',
        phone: '555',
      });
    });

    it('should return 200 with success message on success', async () => {
      userRepository.update.mockResolvedValue({});

      const result = await usersService.updateMe({
        dataToUpdateUser: { id: 'user-1', name: 'Jane' },
        langCurrent: 'en',
      });

      expect(result.statusCode).toBe(200);
      expect(result.response.message).toBe('message.success');
    });

    it('should return 500 when update throws', async () => {
      userRepository.update.mockRejectedValue(new Error('DB error'));

      const result = await usersService.updateMe({
        dataToUpdateUser: { id: 'user-1', name: 'Jane' },
        langCurrent: 'en',
      });

      expect(result.statusCode).toBe(500);
      expect(result.response.message).toBe('message.error_unexpected');
    });
  });

  describe('listUsers', () => {
    const mockUserRow = {
      id: 'u1',
      name: 'John',
      lastname: 'Doe',
      email: 'j@x.com',
      password: 'hash',
      document: '123',
      phone: '555',
      lang: 'en',
      role: 'USER',
      token_to_reset_password: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should normalize invalid page to 1 and invalid pageSize to 10', async () => {
      userRepository.findAll.mockResolvedValue([]);
      userRepository.countAll.mockResolvedValue(0);

      await usersService.listUsers({
        page: NaN,
        pageSize: -1,
      });

      expect(userRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 10,
        })
      );
    });

    it('should build name filter with OR name/lastname contains (insensitive)', async () => {
      userRepository.findAll.mockResolvedValue([]);
      userRepository.countAll.mockResolvedValue(0);

      await usersService.listUsers({
        page: 1,
        pageSize: 10,
        name: 'john',
      });

      const call = userRepository.findAll.mock.calls[0][0];
      expect(call.where).toEqual({
        AND: [
          {
            OR: [
              { name: { contains: 'john', mode: 'insensitive' } },
              { lastname: { contains: 'john', mode: 'insensitive' } },
            ],
          },
        ],
      });
    });

    it('should build document and phone filters', async () => {
      userRepository.findAll.mockResolvedValue([]);
      userRepository.countAll.mockResolvedValue(0);

      await usersService.listUsers({
        page: 1,
        pageSize: 10,
        document: '123',
        phone: '555',
      });

      const call = userRepository.findAll.mock.calls[0][0];
      expect(call.where.AND).toContainEqual({
        document: { contains: '123' },
      });
      expect(call.where.AND).toContainEqual({
        phone: { contains: '555' },
      });
    });

    it('should return 200 with users, pagination and nextPage/prevPage when applicable', async () => {
      userRepository.findAll.mockResolvedValue([mockUserRow]);
      userRepository.countAll.mockResolvedValue(25);

      const result = await usersService.listUsers({
        page: 2,
        pageSize: 10,
      });

      expect(result.statusCode).toBe(200);
      expect(result.response.users).toHaveLength(1);
      expect(result.response.users[0]).not.toHaveProperty('password');
      expect(result.response.users[0]).not.toHaveProperty('token_to_reset_password');
      expect(result.response.itemsTotal).toBe(25);
      expect(result.response.page).toBe(2);
      expect(result.response.totalPage).toBe(3);
      expect(result.response.prevPage).toBe(1);
      expect(result.response.nextPage).toBe(3);
    });

    it('should not include prevPage on first page', async () => {
      userRepository.findAll.mockResolvedValue([]);
      userRepository.countAll.mockResolvedValue(5);

      const result = await usersService.listUsers({
        page: 1,
        pageSize: 10,
      });

      expect(result.response.page).toBe(1);
      expect(result.response).not.toHaveProperty('prevPage');
      expect(result.response.nextPage).toBeUndefined();
    });

    it('should return 500 with empty structure when repository throws', async () => {
      userRepository.findAll.mockRejectedValue(new Error('DB error'));
      userRepository.countAll.mockRejectedValue(new Error('DB error'));

      const result = await usersService.listUsers({
        page: 1,
        pageSize: 10,
      });

      expect(result.statusCode).toBe(500);
      expect(result.response.users).toEqual([]);
      expect(result.response.itemsTotal).toBe(0);
      expect(result.response.page).toBe(1);
      expect(result.response.totalPage).toBe(0);
    });
  });
});

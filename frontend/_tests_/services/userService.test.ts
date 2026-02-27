import { afterEach, describe, expect, it, vi } from 'vitest';

const mockGet = vi.fn();

vi.mock('../../src/config/axiosInstance', () => ({
  apiClient: {
    get: mockGet,
  },
}));

const { userService } = await import('../../src/services/userService');

describe('userService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('listUsers', () => {
    it('calls apiClient.get with /users and params { page, pageSize, name, document, phone }', async () => {
      const params = {
        page: 1,
        pageSize: 10,
        name: 'John',
        document: '123',
        phone: '999',
      };
      const resolved = {
        users: [],
        itemsTotal: 0,
        page: 1,
        totalPage: 0,
      };
      mockGet.mockResolvedValue(resolved);

      const result = await userService.listUsers(params);

      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith('/users', {
        params: {
          page: params.page,
          pageSize: params.pageSize,
          name: params.name,
          document: params.document,
          phone: params.phone,
        },
      });
      expect(result).toEqual(resolved);
    });

    it('sends optional filters as undefined when empty so query is not polluted', async () => {
      const resolved = {
        users: [],
        itemsTotal: 0,
        page: 2,
        totalPage: 1,
        nextPage: undefined,
        prevPage: 1,
      };
      mockGet.mockResolvedValue(resolved);

      await userService.listUsers({
        page: 2,
        pageSize: 20,
        name: '',
        document: '',
        phone: '',
      });

      expect(mockGet).toHaveBeenCalledWith('/users', {
        params: {
          page: 2,
          pageSize: 20,
          name: undefined,
          document: undefined,
          phone: undefined,
        },
      });
    });

    it('resolves with the object returned by get (users, itemsTotal, page, totalPage, nextPage, prevPage)', async () => {
      const resolved = {
        users: [
          {
            id: '1',
            name: 'A',
            lastname: 'B',
            email: 'a@b.com',
            document: '111',
            phone: '111',
            lang: 'es',
            role: 'user',
          },
        ],
        itemsTotal: 1,
        page: 1,
        totalPage: 1,
        nextPage: undefined,
        prevPage: undefined,
      };
      mockGet.mockResolvedValue(resolved);

      const result = await userService.listUsers({
        page: 1,
        pageSize: 10,
      });

      expect(result).toEqual(resolved);
      expect(result.users).toHaveLength(1);
      expect(result.itemsTotal).toBe(1);
    });
  });
});

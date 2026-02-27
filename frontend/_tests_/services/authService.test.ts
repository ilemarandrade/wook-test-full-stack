import { afterEach, describe, expect, it, vi } from 'vitest';

const mockPost = vi.fn();
const mockPut = vi.fn();
const mockGet = vi.fn();

vi.mock('../../src/config/axiosInstance', () => ({
  apiClient: {
    post: mockPost,
    put: mockPut,
    get: mockGet,
  },
}));

const { authService } = await import('../../src/services/authService');

describe('authService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('calls apiClient.post once with /auth/login and body { user: { email, password } }', async () => {
      const values = { email: 'a@b.com', password: 'secret123' };
      const resolved = { jwt: 'token-xyz' };
      mockPost.mockResolvedValue(resolved);

      const result = await authService.login(values);

      expect(mockPost).toHaveBeenCalledTimes(1);
      expect(mockPost).toHaveBeenCalledWith('/auth/login', {
        user: { email: values.email, password: values.password },
      });
      expect(result).toEqual(resolved);
    });

    it('returns the value that apiClient.post resolves to', async () => {
      const values = { email: 'x@y.com', password: 'pass456' };
      const resolved = { jwt: 'another-token' };
      mockPost.mockResolvedValue(resolved);

      const result = await authService.login(values);

      expect(result).toBe(resolved);
    });

    it('rejects with the same error when apiClient.post rejects', async () => {
      const values = { email: 'a@b.com', password: 'wrong' };
      const err = { message: 'Invalid credentials' };
      mockPost.mockRejectedValue(err);

      await expect(authService.login(values)).rejects.toEqual(err);
    });
  });

  describe('register', () => {
    it('calls apiClient.post with /auth/register and body including user (name, lastname, email, document, phone, password)', async () => {
      const values = {
        name: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        document: '12345678',
        phone: '9876543210',
        password: 'secret123',
        confirmPassword: 'secret123',
      };
      const resolved = { message: 'OK' };
      mockPost.mockResolvedValue(resolved);

      const result = await authService.register(values);

      expect(mockPost).toHaveBeenCalledTimes(1);
      expect(mockPost).toHaveBeenCalledWith('/auth/register', {
        user: {
          name: values.name,
          lastname: values.lastname,
          email: values.email,
          document: values.document,
          phone: values.phone,
          password: values.password,
        },
      });
      expect(result).toEqual(resolved);
    });
  });

  describe('updateProfile', () => {
    it('calls apiClient.put with /users/me and body { user } with id, name, lastname, document, phone, lang', async () => {
      const partialUser = {
        id: 'user-1',
        name: 'Jane',
        lastname: 'Smith',
        document: '87654321',
        phone: '1122334455',
        lang: 'en',
      };
      const resolved = { message: 'Updated' };
      mockPut.mockResolvedValue(resolved);

      const result = await authService.updateProfile(partialUser);

      expect(mockPut).toHaveBeenCalledTimes(1);
      expect(mockPut).toHaveBeenCalledWith('/users/me', {
        user: {
          id: partialUser.id,
          name: partialUser.name,
          lastname: partialUser.lastname,
          document: partialUser.document,
          phone: partialUser.phone,
          lang: partialUser.lang,
        },
      });
      expect(result).toEqual(resolved);
    });
  });

  describe('getCurrentUser', () => {
    it('calls apiClient.get with /users/me', async () => {
      const mockUser = {
        id: 'u1',
        name: 'Test',
        lastname: 'User',
        email: 't@t.com',
        document: '111',
        phone: '999',
        lang: 'es',
        role: 'user',
      };
      mockGet.mockResolvedValue({ user: mockUser });

      const result = await authService.getCurrentUser();

      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith('/users/me');
      expect(result).toEqual(mockUser);
    });

    it('returns data.user from the get response', async () => {
      const mockUser = {
        id: 'u2',
        name: 'Other',
        lastname: 'Person',
        email: 'o@o.com',
        document: '222',
        phone: '888',
        lang: null,
        role: 'admin',
      };
      mockGet.mockResolvedValue({ user: mockUser });

      const result = await authService.getCurrentUser();

      expect(result).toBe(mockUser);
    });
  });
});

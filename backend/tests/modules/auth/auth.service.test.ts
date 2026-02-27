import jwt from 'jsonwebtoken';
import authService from '../../../src/modules/auth/auth.service';

process.env.JWT_SECRET = 'test-secret';

jest.mock('../../../src/modules/users/users.repository', () => ({
  __esModule: true,
  userRepository: {
    findByEmail: jest.fn(),
    findByDocument: jest.fn(),
    findByPhone: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateResetPasswordToken: jest.fn(),
    findByResetPasswordToken: jest.fn(),
  },
}));

jest.mock('../../../src/utils/encryptPassword', () => ({
  __esModule: true,
  encrypt: jest.fn(),
  compare: jest.fn(),
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
    findByEmail: jest.Mock;
    findByDocument: jest.Mock;
    findByPhone: jest.Mock;
    create: jest.Mock;
  };
};

const { encrypt, compare } = jest.requireMock(
  '../../../src/utils/encryptPassword'
) as {
  encrypt: jest.Mock;
  compare: jest.Mock;
};

const mockUser = {
  id: 'user-id',
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

describe('auth.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return 401 when user does not exist', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      const result = await authService.login({
        user: { email: 'notfound@example.com', password: 'secret' },
        lang: 'en',
      });

      expect(result.statusCode).toBe(401);
      expect(result.response.message).toBe('message.login.wrong_data');
      expect(compare).not.toHaveBeenCalled();
    });

    it('should return 401 when password is incorrect', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      compare.mockResolvedValue(false);

      const result = await authService.login({
        user: { email: 'john@example.com', password: 'wrong' },
        lang: 'en',
      });

      expect(result.statusCode).toBe(401);
      expect(result.response.message).toBe('message.login.wrong_data');
      expect(compare).toHaveBeenCalledWith('wrong', 'hashed');
    });

    it('should return 200 and jwt with correct payload on successful login', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      compare.mockResolvedValue(true);

      const result = await authService.login({
        user: { email: 'john@example.com', password: 'secret' },
        lang: 'en',
      });

      expect(result.statusCode).toBe(200);
      expect(result.response.jwt).toBeDefined();
      expect(typeof result.response.jwt).toBe('string');

      const decoded = jwt.decode(result.response.jwt as string) as {
        user: {
          id: string;
          email: string;
          role: string;
          name: string;
          lastname: string;
          phone: string;
          document: string;
          lang: string;
        };
      };
      expect(decoded.user).toBeDefined();
      expect(decoded.user.id).toBe('user-id');
      expect(decoded.user.email).toBe('john@example.com');
      expect(decoded.user.role).toBe('USER');
      expect(decoded.user.name).toBe('John');
      expect(decoded.user.lastname).toBe('Doe');
      expect(decoded.user).not.toHaveProperty('password');
    });
  });

  describe('createUser', () => {
    it('should return 400 when user with same email exists', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      userRepository.findByDocument.mockResolvedValue(null);
      userRepository.findByPhone.mockResolvedValue(null);

      const result = await authService.createUser({
        user: {
          name: 'Jane',
          email: 'john@example.com',
          password: 'pass',
          document: '999',
          phone: '111',
        },
        lang: 'en',
      });

      expect(result.statusCode).toBe(400);
      expect(result.response.message).toBe('message.sign_up.user_exist');
      expect(userRepository.create).not.toHaveBeenCalled();
    });

    it('should return 400 when user with same document exists', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.findByDocument.mockResolvedValue(mockUser);
      userRepository.findByPhone.mockResolvedValue(null);

      const result = await authService.createUser({
        user: {
          name: 'Jane',
          email: 'jane@example.com',
          password: 'pass',
          document: '12345678',
          phone: '111',
        },
        lang: 'en',
      });

      expect(result.statusCode).toBe(400);
      expect(result.response.message).toBe('message.sign_up.user_exist');
      expect(userRepository.create).not.toHaveBeenCalled();
    });

    it('should return 400 when user with same phone exists', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.findByDocument.mockResolvedValue(null);
      userRepository.findByPhone.mockResolvedValue(mockUser);

      const result = await authService.createUser({
        user: {
          name: 'Jane',
          email: 'jane@example.com',
          password: 'pass',
          document: '999',
          phone: '555-555',
        },
        lang: 'en',
      });

      expect(result.statusCode).toBe(400);
      expect(result.response.message).toBe('message.sign_up.user_exist');
      expect(userRepository.create).not.toHaveBeenCalled();
    });

    it('should create user and return 200 when no duplicates', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.findByDocument.mockResolvedValue(null);
      userRepository.findByPhone.mockResolvedValue(null);
      encrypt.mockResolvedValue('hashed-password');
      userRepository.create.mockResolvedValue({});

      const result = await authService.createUser({
        user: {
          name: 'Jane',
          lastname: 'Smith',
          email: 'jane@example.com',
          password: 'plain-pass',
          document: '87654321',
          phone: '444-444',
          lang: 'es',
        },
        lang: 'en',
      });

      expect(encrypt).toHaveBeenCalledWith('plain-pass');
      expect(userRepository.create).toHaveBeenCalledWith({
        name: 'Jane',
        lastname: 'Smith',
        email: 'jane@example.com',
        password: 'hashed-password',
        document: '87654321',
        phone: '444-444',
        lang: 'es',
      });
      expect(result.statusCode).toBe(200);
      expect(result.response.message).toBe('message.create_user.success');
    });
  });
});

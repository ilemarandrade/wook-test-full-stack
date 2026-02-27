import authService from '../../src/modules/auth/auth.service';

// Forzar un valor de JWT_SECRET en el entorno de test
process.env.JWT_SECRET = 'test-secret';

jest.mock('../../src/modules/users/users.repository', () => ({
  __esModule: true,
  userRepository: {
    findByEmail: jest.fn(),
    findByDocument: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateResetPasswordToken: jest.fn(),
    findByResetPasswordToken: jest.fn(),
  },
}));

jest.mock('../../src/utils/encryptPassword', () => ({
  __esModule: true,
  encrypt: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('../../src/utils/handleTraductions', () => ({
  __esModule: true,
  default: () => ({
    t: (key: string) => key,
  }),
}));

describe('authService.login', () => {
  const { userRepository } = jest.requireMock(
    '../../src/modules/users/users.repository'
  ) as {
    userRepository: {
      findByEmail: jest.Mock;
    };
  };

  const { compare } = jest.requireMock(
    '../../src/utils/encryptPassword'
  ) as {
    compare: jest.Mock;
  };

  it('should return 401 when user does not exist', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    const result = await authService.login({
      user: { email: 'notfound@example.com', password: 'secret' },
      lang: 'en',
    });

    expect(result.statusCode).toBe(401);
    expect(result.response.message).toBe('message.login.wrong_data');
  });

  it('should return jwt on successful login', async () => {
    userRepository.findByEmail.mockResolvedValue({
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
    });

    compare.mockResolvedValue(true);

    const result = await authService.login({
      user: { email: 'john@example.com', password: 'secret' },
      lang: 'en',
    });

    expect(result.statusCode).toBe(200);
    expect(result.response.jwt).toBeDefined();
  });
});


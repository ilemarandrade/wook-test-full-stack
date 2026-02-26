import authServices from '../../src/services/authServices.js';

// Forzar un valor de JWT_SECRET en el entorno de test
process.env.JWT_SECRET = 'test-secret';

jest.mock('../../src/repositories/userRepository.js', () => ({
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

jest.mock('../../src/utils/encryptPassword.js', () => ({
  __esModule: true,
  encrypt: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('../../src/utils/handleTraductions.js', () => ({
  __esModule: true,
  default: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../../src/utils/sendEmail.js', () => ({
  __esModule: true,
  transporter: {
    sendMail: jest.fn(),
  },
}));

jest.mock('../../src/constants/mails/recoveryPassword.js', () => ({
  __esModule: true,
  default: {
    en: (token: string) => `<html>${token}</html>`,
    es: (token: string) => `<html>${token}</html>`,
  },
}));

describe('authServices.login', () => {
  const { userRepository } = jest.requireMock(
    '../../src/repositories/userRepository.js'
  ) as {
    userRepository: {
      findByEmail: jest.Mock;
    };
  };

  const { compare } = jest.requireMock(
    '../../src/utils/encryptPassword.js'
  ) as {
    compare: jest.Mock;
  };

  it('should return 400 when user does not exist', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    const result = await authServices.login({
      user: { email: 'notfound@example.com', password: 'secret' },
      lang: 'en',
    });

    expect(result.statusCode).toBe(400);
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

    const result = await authServices.login({
      user: { email: 'john@example.com', password: 'secret' },
      lang: 'en',
    });

    expect(result.statusCode).toBe(200);
    expect(result.response.jwt).toBeDefined();
  });
});


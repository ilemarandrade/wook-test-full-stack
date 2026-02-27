jest.mock('../../src/prisma/client', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

import { userRepository } from '../../src/modules/users/users.repository';
import prisma from '../../src/prisma/client';

describe('PrismaUserRepository', () => {
  const mockedPrisma = prisma as unknown as {
    user: {
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('findByEmail should call prisma.user.findUnique with email', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue(null);

    await userRepository.findByEmail('john@example.com');

    expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'john@example.com' },
    });
  });

  it('create should call prisma.user.create with proper data', async () => {
    mockedPrisma.user.create.mockResolvedValue({
      id: 'user-id',
    });

    await userRepository.create({
      name: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: 'hashed',
      document: '12345678',
      phone: '555-555',
      lang: 'en',
    });

    expect(mockedPrisma.user.create).toHaveBeenCalledWith({
      data: {
        name: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        password: 'hashed',
        document: '12345678',
        phone: '555-555',
        lang: 'en',
      },
    });
  });
});


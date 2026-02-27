jest.mock('../../src/prisma/client', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
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
      findMany: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('findById should call prisma.user.findUnique with id', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue(null);

    await userRepository.findById('user-id-123');

    expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'user-id-123' },
    });
  });

  it('findByEmail should call prisma.user.findUnique with email', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue(null);

    await userRepository.findByEmail('john@example.com');

    expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'john@example.com' },
    });
  });

  it('findByDocument should call prisma.user.findFirst with document', async () => {
    mockedPrisma.user.findFirst.mockResolvedValue(null);

    await userRepository.findByDocument('12345678');

    expect(mockedPrisma.user.findFirst).toHaveBeenCalledWith({
      where: { document: '12345678' },
    });
  });

  it('findByPhone should call prisma.user.findFirst with phone', async () => {
    mockedPrisma.user.findFirst.mockResolvedValue(null);

    await userRepository.findByPhone('555-555');

    expect(mockedPrisma.user.findFirst).toHaveBeenCalledWith({
      where: { phone: '555-555' },
    });
  });

  it('findAll should call prisma.user.findMany with skip, take, where', async () => {
    const where = { name: 'John' };
    mockedPrisma.user.findMany.mockResolvedValue([]);

    await userRepository.findAll({ skip: 0, take: 10, where });

    expect(mockedPrisma.user.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      where,
    });
  });

  it('countAll should call prisma.user.count with where', async () => {
    const where = { name: 'John' };
    mockedPrisma.user.count.mockResolvedValue(5);

    const result = await userRepository.countAll(where);

    expect(mockedPrisma.user.count).toHaveBeenCalledWith({ where });
    expect(result).toBe(5);
  });

  it('create should call prisma.user.create with data (lastname/phone empty when not provided)', async () => {
    mockedPrisma.user.create.mockResolvedValue({ id: 'user-id' });

    await userRepository.create({
      name: 'John',
      email: 'john@example.com',
      password: 'hashed',
      document: '12345678',
    });

    expect(mockedPrisma.user.create).toHaveBeenCalledWith({
      data: {
        name: 'John',
        lastname: '',
        email: 'john@example.com',
        password: 'hashed',
        document: '12345678',
        phone: '',
        lang: null,
      },
    });
  });

  it('create should call prisma.user.create with full data when all fields provided', async () => {
    mockedPrisma.user.create.mockResolvedValue({ id: 'user-id' });

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

  it('update should call prisma.user.update with id and data', async () => {
    const updated = { id: 'user-id', name: 'Jane' };
    mockedPrisma.user.update.mockResolvedValue(updated);

    const result = await userRepository.update('user-id', { name: 'Jane' });

    expect(mockedPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-id' },
      data: { name: 'Jane' },
    });
    expect(result).toEqual(updated);
  });
});


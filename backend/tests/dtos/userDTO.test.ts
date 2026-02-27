import { toUserDTO } from '../../src/modules/users/dtos/UserDTO';
import { User } from '@prisma/client';

describe('UserDTO', () => {
  it('should map User to UserDTO without exposing password', () => {
    const now = new Date();

    const user = {
      id: 'user-id',
      name: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: 'hashed-password',
      document: '12345678',
      phone: '555-555',
      lang: 'en',
      role: 'USER',
      token_to_reset_password: '',
      createdAt: now,
      updatedAt: now,
    } as unknown as User;

    const dto = toUserDTO(user);

    expect(dto).toMatchObject({
      id: 'user-id',
      name: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      document: '12345678',
      phone: '555-555',
      lang: 'en',
      role: 'USER',
      createdAt: now,
      updatedAt: now,
    });

    expect((dto as unknown as { password?: string }).password).toBeUndefined();
    expect((dto as unknown as { token_to_reset_password?: string }).token_to_reset_password).toBeUndefined();
  });
});


import { toLoginDto } from '../../../../src/modules/auth/dtos/LoginDto';

describe('LoginDto', () => {
  it('should map body with user.email and user.password to LoginDto', () => {
    const body = {
      user: {
        email: 'john@example.com',
        password: 'secret123',
      },
    };

    const dto = toLoginDto(body);

    expect(dto).toEqual({
      user: {
        email: 'john@example.com',
        password: 'secret123',
      },
    });
  });

  it('should return empty strings when user fields are missing', () => {
    const dto = toLoginDto({});

    expect(dto).toEqual({
      user: {
        email: '',
        password: '',
      },
    });
  });

  it('should handle partial user object', () => {
    const body = { user: { email: 'only@email.com' } };
    const dto = toLoginDto(body);

    expect(dto.user.email).toBe('only@email.com');
    expect(dto.user.password).toBe('');
  });
});

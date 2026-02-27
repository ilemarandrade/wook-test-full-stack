import { toSignupUserDto } from '../../../../src/modules/auth/dtos/SignupUserDto';

describe('SignupUserDto', () => {
  it('should map body with full user to SignupUserDto', () => {
    const body = {
      user: {
        name: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        password: 'secret123',
        document: '12345678',
        phone: '555-555',
        lang: 'en' as const,
      },
    };

    const dto = toSignupUserDto(body);

    expect(dto).toEqual({
      user: {
        name: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        password: 'secret123',
        document: '12345678',
        phone: '555-555',
        lang: 'en',
      },
    });
  });

  it('should return empty strings for missing required fields', () => {
    const dto = toSignupUserDto({});

    expect(dto.user).toEqual({
      name: '',
      lastname: '',
      email: '',
      password: '',
      document: '',
      phone: '',
      lang: undefined,
    });
  });

  it('should handle partial user and preserve lang when provided', () => {
    const body = {
      user: {
        name: 'Jane',
        email: 'jane@example.com',
        document: '87654321',
        lang: 'es' as const,
      },
    };

    const dto = toSignupUserDto(body);

    expect(dto.user.name).toBe('Jane');
    expect(dto.user.lastname).toBe('');
    expect(dto.user.email).toBe('jane@example.com');
    expect(dto.user.document).toBe('87654321');
    expect(dto.user.lang).toBe('es');
  });
});

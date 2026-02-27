import { toUpdateMeDto } from '../../../../src/modules/users/dtos/UpdateMeDto';

describe('UpdateMeDto', () => {
  it('should map body with partial user to UpdateMeDto', () => {
    const body = {
      user: {
        name: 'John',
        lastname: 'Updated',
        document: '12345678',
        phone: '555-999',
        lang: 'en' as const,
      },
    };

    const dto = toUpdateMeDto(body);

    expect(dto).toEqual({
      user: {
        name: 'John',
        lastname: 'Updated',
        document: '12345678',
        phone: '555-999',
        lang: 'en',
      },
    });
  });

  it('should handle empty body with undefined user fields', () => {
    const dto = toUpdateMeDto({});

    expect(dto.user).toEqual({
      name: undefined,
      lastname: undefined,
      document: undefined,
      phone: undefined,
      lang: undefined,
    });
  });

  it('should include only provided fields', () => {
    const body = { user: { name: 'OnlyName' } };
    const dto = toUpdateMeDto(body);

    expect(dto.user.name).toBe('OnlyName');
    expect(dto.user.lastname).toBeUndefined();
    expect(dto.user.document).toBeUndefined();
    expect(dto.user.phone).toBeUndefined();
    expect(dto.user.lang).toBeUndefined();
  });
});

import { toListUsersQueryDto } from '../../../../src/modules/users/dtos/ListUsersQueryDto';

describe('ListUsersQueryDto', () => {
  it('should map query with page, pageSize, name, document, phone to ListUsersQueryDto', () => {
    const query = {
      page: 1,
      pageSize: 10,
      name: 'John',
      document: '12345678',
      phone: '555-555',
    };

    const dto = toListUsersQueryDto(query);

    expect(dto).toEqual({
      page: 1,
      pageSize: 10,
      name: 'John',
      document: '12345678',
      phone: '555-555',
    });
  });

  it('should coerce string page and pageSize to numbers', () => {
    const query = { page: '2', pageSize: '20' };
    const dto = toListUsersQueryDto(query);

    expect(dto.page).toBe(2);
    expect(dto.pageSize).toBe(20);
  });

  it('should return undefined for invalid or missing values', () => {
    const dto = toListUsersQueryDto({});

    expect(dto.page).toBeUndefined();
    expect(dto.pageSize).toBeUndefined();
    expect(dto.name).toBeUndefined();
    expect(dto.document).toBeUndefined();
    expect(dto.phone).toBeUndefined();
  });

  it('should ignore non-string name/document/phone', () => {
    const query = { name: 123, document: null, phone: undefined };
    const dto = toListUsersQueryDto(query);

    expect(dto.name).toBeUndefined();
    expect(dto.document).toBeUndefined();
    expect(dto.phone).toBeUndefined();
  });

  it('should return undefined for NaN page/pageSize', () => {
    const query = { page: 'invalid', pageSize: NaN };
    const dto = toListUsersQueryDto(query);

    expect(dto.page).toBeUndefined();
    expect(dto.pageSize).toBeUndefined();
  });
});

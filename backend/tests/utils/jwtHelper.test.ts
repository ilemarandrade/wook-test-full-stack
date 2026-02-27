import { getJwtSecret } from '../../src/utils/jwtHelper';

describe('jwtHelper.getJwtSecret', () => {
  const originalJwtSecret = process.env.JWT_SECRET;

  afterEach(() => {
    if (originalJwtSecret !== undefined) {
      process.env.JWT_SECRET = originalJwtSecret;
    } else {
      delete process.env.JWT_SECRET;
    }
  });

  it('returns process.env.JWT_SECRET when set to "secret"', () => {
    process.env.JWT_SECRET = 'secret';
    expect(getJwtSecret()).toBe('secret');
  });

  it('restores env after test (no side effects)', () => {
    process.env.JWT_SECRET = 'test-value';
    getJwtSecret();
    expect(process.env.JWT_SECRET).toBe('test-value');
  });
});

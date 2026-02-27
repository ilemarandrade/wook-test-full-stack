import {
  validateEnvSchema,
  validateEnv,
  EnvValidationError,
} from '../../src/config/envSchema';

describe('config/envSchema', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    jest.restoreAllMocks();
  });

  describe('validateEnvSchema', () => {
    it('returns at least one error when JWT_SECRET is empty or missing', () => {
      delete process.env.JWT_SECRET;
      const errors = validateEnvSchema();
      const jwtError = errors.find((e: EnvValidationError) => e.key === 'JWT_SECRET');
      expect(jwtError).toBeDefined();
      expect(errors.length).toBeGreaterThanOrEqual(1);
    });

    it('returns error when JWT_SECRET is empty string', () => {
      process.env.JWT_SECRET = '';
      const errors = validateEnvSchema();
      const jwtError = errors.find((e: EnvValidationError) => e.key === 'JWT_SECRET');
      expect(jwtError).toBeDefined();
    });

    it('returns error when DATABASE_URL does not start with postgresql:// or postgres://', () => {
      process.env.JWT_SECRET = 'secret';
      process.env.DATABASE_URL = 'mysql://localhost/db';
      const errors = validateEnvSchema();
      const dbError = errors.find(
        (e: EnvValidationError) => e.key === 'DATABASE_URL'
      );
      expect(dbError).toBeDefined();
    });

    it('returns empty array when all variables are valid', () => {
      process.env.JWT_SECRET = 'secret';
      process.env.DATABASE_URL = 'postgresql://user:pass@host:5432/db';
      const errors = validateEnvSchema();
      expect(errors).toEqual([]);
    });

    it('accepts postgres:// prefix for DATABASE_URL', () => {
      process.env.JWT_SECRET = 'secret';
      process.env.DATABASE_URL = 'postgres://user:pass@host:5432/db';
      const errors = validateEnvSchema();
      expect(errors).toEqual([]);
    });
  });

  describe('validateEnv', () => {
    it('calls process.exit(1) when there are errors', () => {
      const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      delete process.env.JWT_SECRET;
      delete process.env.DATABASE_URL;

      validateEnv();

      expect(exitSpy).toHaveBeenCalledWith(1);
      consoleSpy.mockRestore();
    });

    it('does not call process.exit when there are no errors', () => {
      const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);

      process.env.JWT_SECRET = 'secret';
      process.env.DATABASE_URL = 'postgresql://user:pass@host:5432/db';

      validateEnv();

      expect(exitSpy).not.toHaveBeenCalled();
    });
  });
});

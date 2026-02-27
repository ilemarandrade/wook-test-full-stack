import { encrypt, compare } from '../../src/utils/encryptPassword';

describe('encryptPassword', () => {
  describe('encrypt', () => {
    it('encrypt("password") returns a string different from "password"', async () => {
      const hash = await encrypt('password');
      expect(hash).not.toBe('password');
      expect(typeof hash).toBe('string');
    });

    it('encrypt produces hash of reasonable length (bcrypt)', async () => {
      const hash = await encrypt('password');
      expect(hash.length).toBeGreaterThan(50);
      expect(hash.length).toBeLessThan(100);
    });

    it('two calls to encrypt("same") produce different hashes (salt)', async () => {
      const hash1 = await encrypt('same');
      const hash2 = await encrypt('same');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('compare', () => {
    it('compare("password", hash) with correct hash returns true', async () => {
      const hash = await encrypt('password');
      const result = await compare('password', hash);
      expect(result).toBe(true);
    });

    it('compare("wrong", hash) returns false', async () => {
      const hash = await encrypt('password');
      const result = await compare('wrong', hash);
      expect(result).toBe(false);
    });
  });
});

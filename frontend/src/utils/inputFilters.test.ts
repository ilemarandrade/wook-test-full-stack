import { filterLetters, filterNumbers } from './inputFilters';

describe('inputFilters', () => {
  describe('filterNumbers', () => {
    it('keeps only digits 0-9', () => {
      expect(filterNumbers('abc123def456')).toBe('123456');
      expect(filterNumbers(' 98-76 ')).toBe('9876');
    });

    it('returns empty string for non-string input when cast', () => {
      // @ts-expect-error - testing runtime guard
      expect(filterNumbers(null)).toBe('');
    });
  });

  describe('filterLetters', () => {
    it('keeps letters (including accents) and spaces', () => {
      expect(filterLetters('Juan Pérez 123')).toBe('Juan Pérez ');
      expect(filterLetters('Ñandú!')).toBe('Ñandú');
    });

    it('returns empty string for non-string input when cast', () => {
      // @ts-expect-error - testing runtime guard
      expect(filterLetters(undefined)).toBe('');
    });
  });
});


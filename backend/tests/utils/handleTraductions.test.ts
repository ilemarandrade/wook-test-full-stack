import handleTraductions from '../../src/utils/handleTraductions';

describe('handleTraductions', () => {
  describe('t(key) with lang === "en"', () => {
    it('t("message.login.wrong_data") returns English text', () => {
      const { t } = handleTraductions('en');
      expect(t('message.login.wrong_data')).toBe(
        'Email or password was not correct'
      );
    });
  });

  describe('t(key) with lang === "es"', () => {
    it('t("message.login.wrong_data") returns Spanish text', () => {
      const { t } = handleTraductions('es');
      expect(t('message.login.wrong_data')).toBe(
        'El email o la contraseña no son correctos'
      );
    });
  });

  describe('lang unknown or invalid', () => {
    it('uses fallback (es) when lang is empty string', () => {
      const { t } = handleTraductions('');
      expect(t('message.login.wrong_data')).toBe(
        'El email o la contraseña no son correctos'
      );
    });

    it('uses fallback (es) when lang is "fr"', () => {
      const { t } = handleTraductions('fr');
      expect(t('message.login.wrong_data')).toBe(
        'El email o la contraseña no son correctos'
      );
    });

    it('uses fallback (es) when lang is undefined (default param)', () => {
      const { t } = handleTraductions();
      expect(t('message.login.wrong_data')).toBe(
        'El email o la contraseña no son correctos'
      );
    });
  });

  describe('nonexistent key', () => {
    it('returns empty string for key that does not exist', () => {
      const { t } = handleTraductions('en');
      expect(t('message.nonexistent.key')).toBe('');
    });
  });
});

import { getRequestLang } from '../../src/utils/getRequestLang';

type MockReq = {
  headers: { lang?: string };
  user?: { user?: { lang?: string } };
};

describe('getRequestLang', () => {
  it('headers.lang === "es" returns "es"', () => {
    const req = { headers: { lang: 'es' } } as MockReq;
    expect(getRequestLang(req as any)).toBe('es');
  });

  it('headers.lang === "en" returns "en"', () => {
    const req = { headers: { lang: 'en' } } as MockReq;
    expect(getRequestLang(req as any)).toBe('en');
  });

  it('invalid header but req.user.user.lang === "es" returns "es"', () => {
    const req = {
      headers: { lang: 'fr' },
      user: { user: { lang: 'es' } },
    } as MockReq;
    expect(getRequestLang(req as any)).toBe('es');
  });

  it('invalid header but req.user.user.lang === "en" returns "en"', () => {
    const req = {
      headers: { lang: 'de' },
      user: { user: { lang: 'en' } },
    } as MockReq;
    expect(getRequestLang(req as any)).toBe('en');
  });

  it('neither valid header nor user lang returns default "es"', () => {
    const req = { headers: {}, user: undefined } as MockReq;
    expect(getRequestLang(req as any)).toBe('es');
  });

  it('invalid header and invalid user lang returns default "es"', () => {
    const req = {
      headers: { lang: 'xx' },
      user: { user: { lang: 'fr' } },
    } as MockReq;
    expect(getRequestLang(req as any)).toBe('es');
  });
});

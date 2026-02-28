import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const AUTH_STORAGE_KEY = 'woow_auth';
const LANG_STORAGE_KEY = 'woow_lang';

let requestFulfilled: (config: { headers?: Record<string, string> }) => any;
let responseFulfilled: (response: { data: unknown }) => any;
let responseRejected: (error: unknown) => Promise<never>;

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: {
        request: {
          use: (onFulfilled: typeof requestFulfilled) => {
            requestFulfilled = onFulfilled;
          },
        },
        response: {
          use: (
            onFulfilled: typeof responseFulfilled,
            onRejected: typeof responseRejected
          ) => {
            responseFulfilled = onFulfilled;
            responseRejected = onRejected;
          },
        },
      },
    })),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn() },
}));

vi.mock('../../src/i18n/config', () => ({
  default: { t: (key: string) => key },
}));

const { getApiErrorMessage, DEFAULT_ERROR_MESSAGE } =
  await import('../../src/config/axiosInstance');

describe('axiosInstance', () => {
  describe('getApiErrorMessage', () => {
    it('returns message when err has message (ApiErrorData)', () => {
      expect(getApiErrorMessage({ message: 'Server error' })).toBe(
        'Server error'
      );
      expect(getApiErrorMessage({ message: 'Validation failed' })).toBe(
        'Validation failed'
      );
    });

    it('returns DEFAULT_ERROR_MESSAGE when err is null or undefined', () => {
      expect(getApiErrorMessage(null)).toBe(DEFAULT_ERROR_MESSAGE);
      expect(getApiErrorMessage(undefined)).toBe(DEFAULT_ERROR_MESSAGE);
    });

    it('returns DEFAULT_ERROR_MESSAGE when err has no message', () => {
      expect(getApiErrorMessage({})).toBe(DEFAULT_ERROR_MESSAGE);
      expect(getApiErrorMessage({ code: 500 })).toBe(DEFAULT_ERROR_MESSAGE);
    });

    it('converts message to string when message is number or other type', () => {
      expect(getApiErrorMessage({ message: 404 })).toBe('404');
      expect(getApiErrorMessage({ message: true })).toBe('true');
    });
  });

  describe('request interceptor', () => {
    let getItemSpy: ReturnType<typeof vi.spyOn<Storage, 'getItem'>>;

    beforeEach(() => {
      getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
    });

    afterEach(() => {
      getItemSpy.mockRestore();
    });

    it('does not add Authorization when localStorage is empty or has no token', () => {
      getItemSpy.mockReturnValue(null);
      const config = { headers: {} as Record<string, string> };
      const result = requestFulfilled(config);
      expect(result.headers.Authorization).toBeUndefined();
      expect(getItemSpy).toHaveBeenCalledWith(AUTH_STORAGE_KEY);
    });

    it('adds Authorization Bearer when token is in localStorage', () => {
      getItemSpy.mockImplementation((key: unknown) => {
        if (key === AUTH_STORAGE_KEY)
          return JSON.stringify({ token: 'jwt-123' });
        return null;
      });
      const config = { headers: {} as Record<string, string> };
      requestFulfilled(config);
      expect(config.headers.Authorization).toBe('Bearer jwt-123');
    });

    it('uses user.lang when present in auth storage for lang header', () => {
      getItemSpy.mockImplementation((key: unknown) => {
        if (key === AUTH_STORAGE_KEY)
          return JSON.stringify({ token: 'x', user: { lang: 'en' } });
        return null;
      });
      const config = { headers: {} as Record<string, string> };
      requestFulfilled(config);
      expect(config.headers.lang).toBe('en');
    });

    it('uses woow_lang from localStorage when es or en, over auth.user.lang', () => {
      getItemSpy.mockImplementation((key: unknown) => {
        if (key === AUTH_STORAGE_KEY)
          return JSON.stringify({ token: 'x', user: { lang: 'en' } });
        if (key === LANG_STORAGE_KEY) return 'es';
        return null;
      });
      const config = { headers: {} as Record<string, string> };
      requestFulfilled(config);
      expect(config.headers.lang).toBe('es');
    });

    it('defaults lang to es when no woow_lang and no user.lang', () => {
      getItemSpy.mockImplementation((key: unknown) => {
        if (key === AUTH_STORAGE_KEY) return JSON.stringify({ token: 'x' });
        return null;
      });
      const config = { headers: {} as Record<string, string> };
      requestFulfilled(config);
      expect(config.headers.lang).toBe('es');
    });
  });

  describe('response interceptor', () => {
    let removeItemSpy: ReturnType<typeof vi.spyOn>;
    let replaceMock: ReturnType<typeof vi.fn>;
    let getItemSpy: ReturnType<typeof vi.spyOn<Storage, 'getItem'>>;
    const originalLocation = window.location;

    beforeEach(() => {
      removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');
      replaceMock = vi.fn();
      getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
      // Use replaceable location object (jsdom's location.replace is not redefinable)
      Object.defineProperty(window, 'location', {
        value: { ...originalLocation, pathname: '/', replace: replaceMock },
        configurable: true,
        writable: true,
      });
    });

    afterEach(() => {
      removeItemSpy.mockRestore();
      getItemSpy.mockRestore();
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        configurable: true,
        writable: true,
      });
      vi.useRealTimers();
    });

    it('returns response.data on success', () => {
      const data = { id: 1, name: 'test' };
      const response = { data };
      expect(responseFulfilled(response)).toBe(data);
    });

    it('rejects with object containing message when response.data.message exists', async () => {
      const error = {
        response: { status: 400, data: { message: 'Bad request' } },
      };
      await expect(responseRejected(error)).rejects.toEqual(
        expect.objectContaining({ message: 'Bad request' })
      );
    });

    it('rejects with DEFAULT_ERROR_MESSAGE when response.data has no message', async () => {
      const error = { response: { status: 500, data: {} } };
      await expect(responseRejected(error)).rejects.toEqual({
        message: DEFAULT_ERROR_MESSAGE,
      });
    });

    it('rejects with DEFAULT_ERROR_MESSAGE when no response.data', async () => {
      const error = { response: undefined };
      await expect(responseRejected(error)).rejects.toEqual({
        message: DEFAULT_ERROR_MESSAGE,
      });
    });

    it('on 401 removes auth from localStorage and redirects to /login when not on /login', async () => {
      Object.defineProperty(window, 'location', {
        value: {
          ...originalLocation,
          pathname: '/dashboard',
          replace: replaceMock,
        },
        configurable: true,
        writable: true,
      });
      vi.useFakeTimers();
      const error = { response: { status: 401 } };
      const rejectPromise = responseRejected(error);
      await expect(rejectPromise).rejects.toBeDefined();
      await vi.advanceTimersByTimeAsync(1100);
      expect(removeItemSpy).toHaveBeenCalledWith(AUTH_STORAGE_KEY);
      expect(replaceMock).toHaveBeenCalledWith('/login');
    });

    it('on 401 does not redirect when already on /login', async () => {
      Object.defineProperty(window, 'location', {
        value: {
          ...originalLocation,
          pathname: '/login',
          replace: replaceMock,
        },
        configurable: true,
        writable: true,
      });
      vi.useFakeTimers();
      const error = { response: { status: 401 } };
      const rejectPromise = responseRejected(error);
      await expect(rejectPromise).rejects.toBeDefined();
      await vi.advanceTimersByTimeAsync(1100);
      expect(removeItemSpy).toHaveBeenCalledWith(AUTH_STORAGE_KEY);
      expect(replaceMock).not.toHaveBeenCalled();
    });
  });
});

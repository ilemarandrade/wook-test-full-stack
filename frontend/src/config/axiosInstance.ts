import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

const apiUrl =
  (import.meta as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL ||
  'http://localhost:4000';

const baseURL = `${apiUrl}/api/v1`;

export const DEFAULT_ERROR_MESSAGE = 'Unexpected error';

export interface ApiErrorData {
  message: string;
  // allow any extra fields the backend might send
  [key: string]: unknown;
}

export interface TypedAxiosInstance extends AxiosInstance {
  get<T = unknown, R = T>(url: string, config?: AxiosRequestConfig): Promise<R>;
  post<T = unknown, R = T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<R>;
  put<T = unknown, R = T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<R>;
}

const AUTH_STORAGE_KEY = 'woow_auth';

function getAuthFromStorage(): { token?: string; user?: { lang?: string | null } } | null {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as { token?: string; user?: { lang?: string | null } };
  } catch {
    return null;
  }
}

export const apiClient: TypedAxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
}) as TypedAxiosInstance;

apiClient.interceptors.request.use((config) => {
  const auth = getAuthFromStorage();
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  const lang = auth?.user?.lang ?? 'en';
  config.headers.lang = lang;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error?.response?.status as number | undefined;
    if (status === 401) {
      // Sesión vencida / token inválido
      localStorage.removeItem(AUTH_STORAGE_KEY);
      if (window.location.pathname !== '/login') {
        toast.error('Se venció la sesión. Inicia sesión nuevamente.');

        setTimeout(() => {
          window.location.replace('/login');
        }, 1000);
      } else {
        toast.error('Se venció la sesión. Inicia sesión nuevamente.');
      }
    }

    const rawData = error.response?.data;

    if (rawData && typeof rawData === 'object') {
      const data: ApiErrorData = {
        message:
          (rawData as { message?: unknown }).message != null
            ? String((rawData as { message?: unknown }).message)
            : DEFAULT_ERROR_MESSAGE,
        ...(rawData as Record<string, unknown>),
      };
      return Promise.reject(data);
    }

    const fallback: ApiErrorData = { message: DEFAULT_ERROR_MESSAGE };
    return Promise.reject(fallback);
  }
);

export function getApiErrorMessage(err: unknown): string {
  return (err as ApiErrorData)?.message ?? DEFAULT_ERROR_MESSAGE;
}

export default apiClient;

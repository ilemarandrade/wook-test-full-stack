import { apiClient } from '../config/axiosInstance';
import type { LoginFormValues } from '../schemas/authSchemas';
import type { RegisterFormValues } from '../schemas/authSchemas';
import type { ProfileFormValues } from '../schemas/authSchemas';

export interface LoginResponse {
  jwt: string;
}

export interface RegisterResponse {
  message?: string;
}

export interface UpdateProfileResponse {
  message?: string;
}

export const authService = {
  login: async (values: LoginFormValues): Promise<LoginResponse> => {
    const data = (await apiClient.post<LoginResponse>('/login', {
      user: { email: values.email, password: values.password },
    }));

    return data;
  },

  register: async (values: RegisterFormValues): Promise<RegisterResponse> => {
    const data = (await apiClient.post<RegisterResponse>(
      '/signup',
      {
        user: {
          name: values.name,
          lastname: values.lastname,
          email: values.email,
          document: values.document,
          phone: values.phone,
          password: values.password,
        },
      }
    ));

    return data;
  },

  updateProfile: async (values: ProfileFormValues): Promise<UpdateProfileResponse> => {
    const data = (await apiClient.put<UpdateProfileResponse>(
      '/update_user',
      {
        user: {
          name: values.name,
          lastname: values.lastname,
          document: values.document,
          phone: values.phone,
          lang: values.lang,
        },
      }
    ));
    
    return data;
  },
};

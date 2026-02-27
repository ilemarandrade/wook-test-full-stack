import { apiClient } from '../config/axiosInstance';
import type { LoginFormValues } from '../schemas/authSchemas';
import type { RegisterFormValues } from '../schemas/authSchemas';
import type { ProfileFormValues } from '../schemas/authSchemas';
import type { User } from '../context/AuthContext';

export interface LoginResponse {
  jwt: string;
}

export interface UserInformationResponse {
  user: User;
}

export interface RegisterResponse {
  message?: string;
}

export interface UpdateProfileResponse {
  message?: string;
}

export const authService = {
  login: async (values: LoginFormValues): Promise<LoginResponse> => {
    const data = (await apiClient.post<LoginResponse>('/auth/login', {
      user: { email: values.email, password: values.password },
    }));

    return data;
  },

  register: async (values: RegisterFormValues): Promise<RegisterResponse> => {
    const data = (await apiClient.post<RegisterResponse>(
      '/auth/register',
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

  updateProfile: async (values: Partial<User>): Promise<UpdateProfileResponse> => {
    const data = (await apiClient.put<UpdateProfileResponse>(
      '/users/me',
      {
        user: {
          id: values.id,
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

  getCurrentUser: async (): Promise<User> => {
    const data = await apiClient.get<UserInformationResponse>('/users/me');
    return data.user;
  },
};

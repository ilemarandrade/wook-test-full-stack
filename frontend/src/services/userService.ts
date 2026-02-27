import { apiClient } from "../config/axiosInstance";
import type { User } from "../context/AuthContext";

export interface ListUsersResponse {
  users: User[];
  itemsTotal: number;
  page: number;
  totalPage: number;
  nextPage?: number;
  prevPage?: number;
}

export interface ListUsersParams {
  page: number;
  pageSize: number;
  name?: string;
  document?: string;
  phone?: string;
}

export const userService = {
  listUsers: async ({
    page,
    pageSize,
    name,
    document,
    phone,
  }: ListUsersParams): Promise<ListUsersResponse> => {
    const data = await apiClient.get<ListUsersResponse>("/users", {
      params: {
        page,
        pageSize,
        name: name || undefined,
        document: document || undefined,
        phone: phone || undefined,
      },
    });
    return data;
  },
};

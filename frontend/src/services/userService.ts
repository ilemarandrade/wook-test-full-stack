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

export const userService = {
  listUsers: async (): Promise<ListUsersResponse> => {
    const data = await apiClient.get<ListUsersResponse>("/users");
    return data;
  },
};

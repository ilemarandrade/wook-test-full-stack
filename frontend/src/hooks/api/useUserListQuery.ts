import { useQuery } from '@tanstack/react-query';
import type { User } from '../../context/AuthContext';
import type { ApiErrorData } from '../../config/axiosInstance';
import { ListUsersResponse, userService } from '../../services/userService';
import type { UserFilterValues } from '../users/useUserFilters';

export interface UseUserListQueryArgs {
  page: number;
  pageSize: number;
  filters: UserFilterValues;
  searchVersion: number;
}

export interface UserListQueryData {
  users: User[];
  total: number;
}

const USER_LIST_QUERY_KEY = ['user_list'] as const;

export function useUserListQuery({
  page,
  pageSize,
  filters,
  searchVersion,
}: UseUserListQueryArgs) {
  return useQuery<ListUsersResponse, ApiErrorData>({
    queryKey: [...USER_LIST_QUERY_KEY, { page, pageSize, filters, searchVersion }],
    queryFn: async () => {
      return await userService.listUsers();
    },
  });
}


import { useQuery } from '@tanstack/react-query';
import type { ApiErrorData } from '../../config/axiosInstance';
import { ListUsersResponse, userService } from '../../services/userService';
import type { UserFilterValues } from '../users/useUserFilters';

export interface UseUserListQueryArgs {
  page: number;
  pageSize: number;
  filters: UserFilterValues;
}

const USER_LIST_QUERY_KEY = ['user_list'] as const;

export function useUserListQuery({
  page,
  pageSize,
  filters,
}: UseUserListQueryArgs) {
  return useQuery<ListUsersResponse, ApiErrorData>({
    queryKey: [...USER_LIST_QUERY_KEY, { page, pageSize, filters }],
    queryFn: async () => {
      return await userService.listUsers({
        page,
        pageSize,
        name: filters.name,
        document: filters.document,
        phone: filters.phone,
      });
    },
  });
}


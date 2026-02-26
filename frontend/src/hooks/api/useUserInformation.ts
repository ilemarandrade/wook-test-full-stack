import { useQuery } from '@tanstack/react-query';
import { authService } from '../../services/authService';

const USER_INFORMATION_QUERY_KEY = ['user_information'] as const;

export function useUserInformation(enabled: boolean) {
  return useQuery({
    queryKey: USER_INFORMATION_QUERY_KEY,
    queryFn: () => authService.getCurrentUser(),
    enabled,
  });
}

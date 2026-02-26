import { useMutation } from '@tanstack/react-query';
import type { ProfileFormValues } from '../../schemas/authSchemas';
import { authService } from '../../services/authService';

export function useUpdateProfileMutation(token: string | null) {
  return useMutation({
    mutationFn: (values: ProfileFormValues) => authService.updateProfile(values),
  });
}

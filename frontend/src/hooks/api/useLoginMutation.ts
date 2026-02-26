import { useMutation } from '@tanstack/react-query';
import type { LoginFormValues } from '../../schemas/authSchemas';
import { authService } from '../../services/authService';

export function useLoginMutation() {
  return useMutation({
    mutationFn: (values: LoginFormValues) => authService.login(values),
  });
}

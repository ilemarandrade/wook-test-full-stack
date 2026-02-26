import { useMutation } from '@tanstack/react-query';
import type { RegisterFormValues } from '../../schemas/authSchemas';
import { authService } from '../../services/authService';

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (values: RegisterFormValues) => authService.register(values),
  });
}

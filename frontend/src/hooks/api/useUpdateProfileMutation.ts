import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/authService';
import { User } from '../../context/AuthContext';

export function useUpdateProfileMutation() {
  return useMutation({
    mutationFn: (values: Partial<User>) => authService.updateProfile(values),
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout as apiLogout } from '../../services/apiAuth';
import { useNavigate } from 'react-router-dom';

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logout, isPending: isLoading } = useMutation({
    mutationFn: apiLogout,
    onSuccess: () => {
      queryClient.removeQueries();
      navigate('/login', { replace: true });
    },
  });

  return { logout, isLoading };
}

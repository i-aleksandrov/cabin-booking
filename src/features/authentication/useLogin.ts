import { useMutation } from '@tanstack/react-query';
import { login as apiLogin } from '../../services/apiAuth';
import { useNavigate } from 'react-router-dom';
import type { AuthCredentials } from '../../models/auth.model';
import toast from 'react-hot-toast';

export function useLogin() {
  const navigate = useNavigate();

  const { mutate: login, isPending: isLoading } = useMutation({
    mutationFn: (credentials: AuthCredentials) => apiLogin(credentials),
    onSuccess: () => {
      navigate('/dashboard', { replace: true });
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.message);
    },
  });

  return { login, isLoading };
}

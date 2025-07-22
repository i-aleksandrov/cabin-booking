import { useMutation } from '@tanstack/react-query';
import { signup as apiSignup } from '../../services/apiAuth';
import toast from 'react-hot-toast';

export function useSignup() {
  const { mutate: signup, isPending: isLoading } = useMutation({
    mutationFn: apiSignup,
    onSuccess: () => {
      toast.success('Acccount successfully created!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { signup, isLoading };
}

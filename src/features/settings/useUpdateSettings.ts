import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSetting } from '../../services/apiSettings';
import toast from 'react-hot-toast';

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  const { mutate: updateSettings, isPending: isUpdating } = useMutation({
    mutationFn: updateSetting,
    onSuccess: () => {
      toast.success('Settings updated!');
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { updateSettings, isUpdating };
}

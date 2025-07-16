import { useQuery } from '@tanstack/react-query';
import { getSettings } from '../../services/apiSettings';
import type { CabinSettings } from '../../models/settings.model';

export function useSettings() {
  const {
    isLoading,
    error,
    data: settings,
  } = useQuery<CabinSettings>({
    queryKey: ['settings'],
    queryFn: getSettings,
  });

  return { isLoading, error, settings };
}

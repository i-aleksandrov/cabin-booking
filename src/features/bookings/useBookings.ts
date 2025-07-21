import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getBookings } from '../../services/apiBookings';
import { useSearchParams } from 'react-router-dom';
import { PAGE_SIZE } from '../../utils/constants';

export function useBookings() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const filterValue = searchParams.get('status');
  const filter =
    !filterValue || filterValue === 'all'
      ? null
      : { field: 'status', value: filterValue, method: 'eq' };

  const sortByRaw = searchParams.get('sortBy') ?? 'startDate-desc';
  const [field, direction] = sortByRaw.split('-');
  const sortBy = { field, direction };

  const page = !searchParams.get('page') ? 1 : Number(searchParams.get('page'));

  const { isPending, error, data } = useQuery({
    queryKey: ['bookings', filter, sortBy, page],
    queryFn: () => getBookings({ filter, sortBy, page }),
  });

  if (data) {
    const pageCount = Math.ceil(data.count! / PAGE_SIZE);

    if (page < pageCount) {
      queryClient.prefetchQuery({
        queryKey: ['bookings', filter, sortBy, page + 1],
        queryFn: () => getBookings({ filter, sortBy, page: page + 1 }),
      });
    }
  }

  return {
    isPending,
    error,
    bookings: data?.data ?? [],
    count: data?.count ?? 0,
  };
}

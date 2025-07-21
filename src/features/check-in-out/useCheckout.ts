import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBooking } from '../../services/apiBookings';
import toast from 'react-hot-toast';

export function useCheckout() {
  const queryClient = useQueryClient();

  const { isPending, mutate: checkout } = useMutation({
    mutationFn: (bookingId: string) =>
      updateBooking(bookingId!, {
        status: 'checked-out',
        isPaid: true,
      }),
    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked out`);
      queryClient.invalidateQueries();
    },
    onError: () => {
      toast.error('There was an error while checking out');
    },
  });

  return { updateIsPending: isPending, checkout };
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBooking as deleteBookingApi } from '../../services/apiBookings';
import toast from 'react-hot-toast';

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  const { mutate: deleteBooking, isPending: isDeleting } = useMutation({
    mutationFn: (bookingId: string) => deleteBookingApi(bookingId),
    onSuccess: () => {
      toast.success(`Booking deleted`);
      queryClient.invalidateQueries({
        queryKey: ['bookings'],
      });
    },
    onError: () => {
      toast.error('Something went wrong trying to delete booking');
    },
  });

  return { deleteBooking, isDeleting };
}

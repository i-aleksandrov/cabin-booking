import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBooking } from '../../services/apiBookings';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function useCheckin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isPending, mutate: checkin } = useMutation({
    mutationFn: ({
      bookingId,
      breakfast,
    }: {
      bookingId: string;
      breakfast: any;
    }) =>
      updateBooking(bookingId!, {
        isPaid: true,
        status: 'checked-in',
        ...breakfast,
      }),
    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked in`);
      queryClient.invalidateQueries();
      navigate('/');
    },
    onError: () => {
      toast.error('There was an error while checking in');
    },
  });

  return { updateIsPending: isPending, checkin };
}

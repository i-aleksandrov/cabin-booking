import Button from '../../ui/Button';
import { useCheckout } from './useCheckout';

interface CheckoutButtonProps extends React.PropsWithChildren {
  bookingId: number;
}

function CheckoutButton({ bookingId }: CheckoutButtonProps) {
  const { checkout, updateIsPending } = useCheckout();

  return (
    <Button
      $variation="primary"
      $size="small"
      onClick={() => checkout(bookingId.toString())}
      disabled={updateIsPending}
    >
      Check out
    </Button>
  );
}

export default CheckoutButton;

import styled from 'styled-components';
import BookingDataBox from '../bookings/BookingDataBox';

import Row from '../../ui/Row';
import Heading from '../../ui/Heading';
import ButtonGroup from '../../ui/ButtonGroup';
import Button from '../../ui/Button';
import ButtonText from '../../ui/ButtonText';

import { useMoveBack } from '../../hooks/useMoveBack';
import { useBooking } from '../bookings/useBooking';
import Spinner from '../../ui/Spinner';
import { useEffect, useState } from 'react';
import Checkbox from '../../ui/Checkbox';
import { formatCurrency } from '../../utils/helpers';
import { useCheckin } from './useCheckin';
import { useSettings } from '../settings/useSettings';

const Box = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const moveBack = useMoveBack();
  const [confirmPaid, setConfirmPaid] = useState(false);
  const [addBreakfast, setAddBreakfast] = useState(false);
  const { booking, isPending } = useBooking();
  const { updateIsPending, checkin } = useCheckin();
  const { settings, isLoading } = useSettings();

  useEffect(() => {
    setConfirmPaid(booking?.isPaid ?? false);
  }, [booking?.isPaid]);

  if (isPending || isLoading) {
    return <Spinner />;
  }

  console.log(booking);

  const {
    id: bookingId,
    guests,
    totalPrice,
    numGuests,
    hasBreakfast,
    numNights,
  } = booking!;

  const optionalBreakfastPrice =
    settings!.breakfastPrice * numNights * numGuests;

  const totalPriceFormatted = formatCurrency(totalPrice);
  const breakfastPriceFormatted = formatCurrency(optionalBreakfastPrice);

  function handleCheckin() {
    if (!confirmPaid) {
      return;
    }

    if (addBreakfast) {
      checkin({
        bookingId: bookingId.toString(),
        breakfast: {
          hasBreakfast: true,
          extrasPrice: optionalBreakfastPrice,
          totalPrice: totalPrice + optionalBreakfastPrice,
        },
      });
    } else {
      checkin({ bookingId: bookingId.toString(), breakfast: {} });
    }
  }

  return (
    <>
      <Row $type="horizontal">
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking!} />

      {!hasBreakfast && (
        <Box>
          <Checkbox
            onChange={() => {
              setAddBreakfast((add) => !add);
              setConfirmPaid(false);
            }}
            checked={addBreakfast}
            id="add-breakfast"
            disabled={updateIsPending}
          >
            Want to add breakfast for {breakfastPriceFormatted}
          </Checkbox>
        </Box>
      )}

      <Box>
        <Checkbox
          onChange={() => setConfirmPaid((confirm) => !confirm)}
          checked={confirmPaid}
          disabled={confirmPaid}
          id="confirm"
        >
          I confirm that {guests.fullName} has paid the full amount of{' '}
          {!addBreakfast
            ? totalPriceFormatted
            : `${formatCurrency(
                totalPrice + optionalBreakfastPrice
              )} (${totalPriceFormatted} + ${breakfastPriceFormatted})`}
        </Checkbox>
      </Box>

      <ButtonGroup>
        <Button
          $size="medium"
          $variation="primary"
          onClick={handleCheckin}
          disabled={!confirmPaid || updateIsPending}
        >
          Check in booking #{bookingId}
        </Button>
        <Button $size="medium" $variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
